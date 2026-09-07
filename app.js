
const $ = (id)=>document.getElementById(id);
const views = ["homeView","newProjectView","imageProjectView","editorView","projectsView"];
const STORAGE_KEY = "micangaDesignerProjects_v1";
const ACTIVE_KEY = "micangaDesignerActive_v1";

const defaultPalette = [
  {id:"c1", name:"Preto", code:"001", hex:"#111111"},
  {id:"c2", name:"Branco", code:"002", hex:"#ffffff"},
  {id:"c3", name:"Vermelho", code:"003", hex:"#d8342a"},
  {id:"c4", name:"Azul", code:"004", hex:"#2767c9"},
  {id:"c5", name:"Amarelo", code:"005", hex:"#f0c533"},
  {id:"c6", name:"Verde", code:"006", hex:"#2e9d59"},
  {id:"c7", name:"Dourado", code:"007", hex:"#c7952f"},
  {id:"c8", name:"Rosa", code:"008", hex:"#e46e9f"},
  {id:"c9", name:"Laranja", code:"009", hex:"#f07a24"},
  {id:"c10", name:"Roxo", code:"010", hex:"#7b43a6"},
  {id:"c11", name:"Lilás", code:"011", hex:"#b78bd4"},
  {id:"c12", name:"Turquesa", code:"012", hex:"#27b7b2"},
  {id:"c13", name:"Azul claro", code:"013", hex:"#69aef5"},
  {id:"c14", name:"Azul marinho", code:"014", hex:"#173a73"},
  {id:"c15", name:"Verde limão", code:"015", hex:"#8bcf3f"},
  {id:"c16", name:"Verde escuro", code:"016", hex:"#17633b"},
  {id:"c17", name:"Bege", code:"017", hex:"#d7bea6"},
  {id:"c18", name:"Marrom", code:"018", hex:"#79513d"},
  {id:"c19", name:"Cinza", code:"019", hex:"#8f9297"},
  {id:"c20", name:"Prata", code:"020", hex:"#c7cbd1"},
  {id:"c21", name:"Vinho", code:"021", hex:"#7f213d"},
  {id:"c22", name:"Coral", code:"022", hex:"#ef6f61"},
  {id:"c23", name:"Magenta", code:"023", hex:"#c82c85"},
  {id:"c24", name:"Creme", code:"024", hex:"#f2e6c9"},
  {id:"c25", name:"Cobre", code:"025", hex:"#b66a3c"},
  {id:"c26", name:"Champagne", code:"026", hex:"#dfc993"},
  {id:"c27", name:"Verde água", code:"027", hex:"#65c6b8"},
  {id:"c28", name:"Azul petróleo", code:"028", hex:"#245b66"},
  {id:"c29", name:"Rosa claro", code:"029", hex:"#f4b1ca"},
  {id:"c30", name:"Mostarda", code:"030", hex:"#b98d22"},
  {id:"c31", name:"Terracota", code:"031", hex:"#b75f43"},
  {id:"c32", name:"Grafite", code:"032", hex:"#4d5056"}
];

let project = null;
let tool = "paint";
let selectedColor = defaultPalette[0].id;
let symmetry = false;
let undoStack = [];
let redoStack = [];
let isPointerDown = false;
let deferredPrompt = null;
let zoomLevel = 1;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.15;
let pinchStartDistance = 0;
let pinchStartZoom = 1;
let panStart = null;
let loomMode = false;
let uploadedImage = null;


function ensurePalette(p){
  if(!p.palette) p.palette=[];
  defaultPalette.forEach(c=>{
    if(!p.palette.some(x=>x.id===c.id)) p.palette.push({...c});
  });
  return p;
}

function clampZoom(v){ return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, v)); }

function applyZoom(nextZoom, focusX=null, focusY=null){
  const viewport=$("gridViewport"), grid=$("beadGrid");
  if(!viewport||!grid) return;
  const old=zoomLevel, next=clampZoom(nextZoom);
  if(focusX===null) focusX=viewport.clientWidth/2;
  if(focusY===null) focusY=viewport.clientHeight/2;
  const contentX=(viewport.scrollLeft+focusX)/old;
  const contentY=(viewport.scrollTop+focusY)/old;
  zoomLevel=next;
  grid.style.transform=`scale(${zoomLevel})`;
  grid.style.marginRight=`${Math.max(0,(zoomLevel-1)*grid.scrollWidth)}px`;
  grid.style.marginBottom=`${Math.max(0,(zoomLevel-1)*grid.scrollHeight)}px`;
  viewport.scrollLeft=contentX*zoomLevel-focusX;
  viewport.scrollTop=contentY*zoomLevel-focusY;
  const pct=Math.round(zoomLevel*100);
  $("zoomResetBtn").textContent=`${pct}%`;
  $("zoomLabel").textContent=`Zoom ${pct}%`;
}

function touchDistance(a,b){ return Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY); }

function setupZoomGestures(){
  const viewport=$("gridViewport");
  if(!viewport||viewport.dataset.zoomReady) return;
  viewport.dataset.zoomReady="1";
  viewport.addEventListener("touchstart",(e)=>{
    if(e.touches.length===2){
      e.preventDefault();
      pinchStartDistance=touchDistance(e.touches[0],e.touches[1]);
      pinchStartZoom=zoomLevel;
    }else if(e.touches.length===1 && zoomLevel>1){
      panStart={x:e.touches[0].clientX,y:e.touches[0].clientY,left:viewport.scrollLeft,top:viewport.scrollTop};
    }
  },{passive:false});
  viewport.addEventListener("touchmove",(e)=>{
    if(e.touches.length===2 && pinchStartDistance){
      e.preventDefault();
      const rect=viewport.getBoundingClientRect();
      const cx=((e.touches[0].clientX+e.touches[1].clientX)/2)-rect.left;
      const cy=((e.touches[0].clientY+e.touches[1].clientY)/2)-rect.top;
      const d=touchDistance(e.touches[0],e.touches[1]);
      applyZoom(pinchStartZoom*(d/pinchStartDistance),cx,cy);
    }else if(e.touches.length===1 && panStart && zoomLevel>1){
      e.preventDefault();
      const t=e.touches[0];
      viewport.scrollLeft=panStart.left-(t.clientX-panStart.x);
      viewport.scrollTop=panStart.top-(t.clientY-panStart.y);
    }
  },{passive:false});
  viewport.addEventListener("touchend",(e)=>{
    if(e.touches.length<2) pinchStartDistance=0;
    if(e.touches.length===0) panStart=null;
  });
}

function setLoomMode(on){
  loomMode=on;
  $("gridViewport").classList.toggle("loomMode",loomMode);
  $("loomBtn").classList.toggle("activeTool",loomMode);
  $("viewModeLabel").textContent=loomMode?"Modo: Tear realista":"Modo: Grade";
}

function mirrorHorizontal(){
  if(!project) return;
  pushHistory();
  project.grid=project.grid.map(row=>[...row].reverse());
  renderGrid();
  toast("Desenho espelhado horizontalmente");
}

function mirrorVertical(){
  if(!project) return;
  pushHistory();
  project.grid=[...project.grid].reverse().map(row=>[...row]);
  renderGrid();
  toast("Desenho espelhado verticalmente");
}


function colorDistance(a,b){
  const dr=a[0]-b[0], dg=a[1]-b[1], db=a[2]-b[2];
  return dr*dr+dg*dg+db*db;
}

function rgbToHex(r,g,b){
  return "#"+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
}

function isBackgroundPixel(r,g,b,mode){
  if(mode==="light") return r>235 && g>235 && b>235;
  if(mode==="dark") return r<25 && g<25 && b<25;
  return false;
}

function buildQuantizedPalette(pixels, maxColors, bgMode){
  const buckets = new Map();
  for(let i=0;i<pixels.length;i+=4){
    const r=pixels[i], g=pixels[i+1], b=pixels[i+2], a=pixels[i+3];
    if(a<100 || isBackgroundPixel(r,g,b,bgMode)) continue;
    const qr=Math.round(r/32)*32, qg=Math.round(g/32)*32, qb=Math.round(b/32)*32;
    const key=`${qr},${qg},${qb}`;
    buckets.set(key,(buckets.get(key)||0)+1);
  }
  return [...buckets.entries()]
    .sort((a,b)=>b[1]-a[1])
    .slice(0,maxColors)
    .map(([key],idx)=>{
      const [r,g,b]=key.split(",").map(Number);
      return {id:`img_${Date.now()}_${idx}`,name:`Cor imagem ${idx+1}`,code:`IMG${String(idx+1).padStart(2,"0")}`,hex:rgbToHex(r,g,b),rgb:[r,g,b]};
    });
}

function nearestPaletteId(r,g,b,palette){
  let best=palette[0], bestD=Infinity;
  palette.forEach(c=>{
    const rgb=c.rgb || [
      parseInt(c.hex.slice(1,3),16),
      parseInt(c.hex.slice(3,5),16),
      parseInt(c.hex.slice(5,7),16)
    ];
    const d=colorDistance([r,g,b],rgb);
    if(d<bestD){bestD=d;best=c;}
  });
  return best?.id || null;
}

function cropTransparentBounds(ctx,w,h,bgMode){
  const data=ctx.getImageData(0,0,w,h).data;
  let minX=w,minY=h,maxX=-1,maxY=-1;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const i=(y*w+x)*4;
      const r=data[i],g=data[i+1],b=data[i+2],a=data[i+3];
      if(a>100 && !isBackgroundPixel(r,g,b,bgMode)){
        if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;
      }
    }
  }
  if(maxX<0) return {x:0,y:0,w,h};
  return {x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
}

async function generateProjectFromImage(){
  if(!uploadedImage){
    toast("Escolha uma imagem primeiro");
    return;
  }

  const cols = Number($("imageColsInput").value)||20;
  const maxColors = Number($("imageColorsInput").value)||8;
  const bgMode = $("backgroundModeInput").value;
  const name = $("imageProjectName").value.trim() || "Brinco convertido";

  const canvas=$("imageProcessCanvas");
  const ctx=canvas.getContext("2d",{willReadFrequently:true});

  const maxSide=800;
  const scale=Math.min(1,maxSide/Math.max(uploadedImage.naturalWidth,uploadedImage.naturalHeight));
  canvas.width=Math.max(1,Math.round(uploadedImage.naturalWidth*scale));
  canvas.height=Math.max(1,Math.round(uploadedImage.naturalHeight*scale));
  ctx.drawImage(uploadedImage,0,0,canvas.width,canvas.height);

  const crop=cropTransparentBounds(ctx,canvas.width,canvas.height,bgMode);
  const aspect=crop.h/crop.w;
  const rows=Math.max(4,Math.min(80,Math.round(cols*aspect)));

  const sample=document.createElement("canvas");
  sample.width=cols;
  sample.height=rows;
  const sctx=sample.getContext("2d",{willReadFrequently:true});
  sctx.imageSmoothingEnabled=true;
  sctx.drawImage(canvas,crop.x,crop.y,crop.w,crop.h,0,0,cols,rows);

  const imgData=sctx.getImageData(0,0,cols,rows);
  const imgPalette=buildQuantizedPalette(imgData.data,maxColors,bgMode);

  if(!imgPalette.length){
    toast("Não consegui identificar cores úteis");
    return;
  }

  const grid=Array.from({length:rows},()=>Array(cols).fill(null));
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4;
      const r=imgData.data[i],g=imgData.data[i+1],b=imgData.data[i+2],a=imgData.data[i+3];
      if(a<100 || isBackgroundPixel(r,g,b,bgMode)) continue;
      grid[y][x]=nearestPaletteId(r,g,b,imgPalette);
    }
  }

  project={
    id:uid(),
    name,
    rows,cols,
    beadSize:3,
    technique:"Grade reta",
    palette:imgPalette.map(({rgb,...rest})=>rest),
    grid,
    createdAt:new Date().toISOString(),
    updatedAt:new Date().toISOString(),
    source:"image"
  };

  selectedColor=project.palette[0].id;
  tool="paint";
  symmetry=false;
  undoStack=[];
  redoStack=[];
  zoomLevel=1;
  setProjectLabel();
  renderPalette();
  updateToolButtons();
  renderGrid();
  showView("editorView");
  if(typeof setupZoomGestures==="function") setupZoomGestures();
  if(typeof applyZoom==="function") applyZoom(1);
  if(typeof setLoomMode==="function") setLoomMode(false);
  toast("Diagrama criado a partir da imagem");
}


const THEME_KEY = "jpMicangasTheme_v1";

function loadTheme(){
  try{
    return JSON.parse(localStorage.getItem(THEME_KEY)||"{}");
  }catch{
    return {};
  }
}

function applyTheme(theme){
  const appBg = theme.appBg || "#f6f1ec";
  const gridBg = theme.gridBg || "#faf6f2";
  document.documentElement.style.setProperty("--bg", appBg);
  document.documentElement.style.setProperty("--grid-bg", gridBg);
  if($("appBgColor")) $("appBgColor").value = appBg;
  if($("gridBgColor")) $("gridBgColor").value = gridBg;
}

function saveTheme(next){
  const current = loadTheme();
  const merged = {...current,...next};
  localStorage.setItem(THEME_KEY,JSON.stringify(merged));
  applyTheme(merged);
}

function resetTheme(){
  const theme={appBg:"#f6f1ec",gridBg:"#faf6f2"};
  localStorage.setItem(THEME_KEY,JSON.stringify(theme));
  applyTheme(theme);
  toast("Cores de fundo restauradas");
}

function showView(id){
  views.forEach(v=>$(v).classList.toggle("active",v===id));
}

function toast(msg){
  $("toast").textContent = msg;
  $("toast").classList.add("show");
  setTimeout(()=>$("toast").classList.remove("show"),1500);
}

function loadProjects(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]")}catch{return []}
}
function saveProjects(list){localStorage.setItem(STORAGE_KEY,JSON.stringify(list))}
function uid(){return "p_"+Date.now()+"_"+Math.random().toString(36).slice(2,7)}
function snapshot(){return project.grid.map(r=>[...r])}
function pushHistory(){
  undoStack.push(snapshot());
  if(undoStack.length>40) undoStack.shift();
  redoStack = [];
}
function setProjectLabel(){
  $("projectLabel").textContent = project ? project.name : "Novo projeto";
}
function newProjectData(){
  const rows = Math.max(4,Math.min(60,Number($("rowsInput").value)||18));
  const cols = Math.max(4,Math.min(40,Number($("colsInput").value)||12));
  return ensurePalette({
    id:uid(),
    name:$("projectName").value.trim()||"Meu brinco",
    rows, cols,
    beadSize:Number($("beadSizeInput").value)||3,
    technique:$("techniqueInput").value,
    palette: JSON.parse(JSON.stringify(defaultPalette)),
    grid:Array.from({length:rows},()=>Array(cols).fill(null)),
    createdAt:new Date().toISOString(),
    updatedAt:new Date().toISOString()
  });
}

function renderGrid(){
  const g = $("beadGrid");
  g.innerHTML="";
  g.style.gridTemplateColumns=`repeat(${project.cols},28px)`;
  project.grid.forEach((row,r)=>{
    row.forEach((colorId,c)=>{
      const bead=document.createElement("button");
      bead.className="bead"+(colorId?"":" empty");
      bead.dataset.r=r; bead.dataset.c=c;
      const color=project.palette.find(x=>x.id===colorId);
      if(color) bead.style.background=color.hex;
      bead.addEventListener("pointerdown",(e)=>{
        e.preventDefault(); isPointerDown=true; pushHistory(); applyAt(r,c);
        bead.setPointerCapture?.(e.pointerId);
      });
      bead.addEventListener("pointerenter",()=>{
        if(isPointerDown) applyAt(r,c,false);
      });
      bead.addEventListener("pointerup",()=>{isPointerDown=false});
      bead.addEventListener("pointercancel",()=>{isPointerDown=false});
      g.appendChild(bead);
    })
  });
  updateStats();
}

document.addEventListener("pointerup",()=>isPointerDown=false);

function applyAt(r,c,rerender=true){
  const value = tool==="erase" ? null : selectedColor;
  project.grid[r][c]=value;
  if(symmetry){
    const mirror=project.cols-1-c;
    project.grid[r][mirror]=value;
  }
  if(rerender) renderGrid(); else {
    updateBeadDom(r,c);
    if(symmetry) updateBeadDom(r,project.cols-1-c);
    updateStats();
  }
}

function updateBeadDom(r,c){
  const idx=r*project.cols+c;
  const bead=$("beadGrid").children[idx];
  if(!bead) return;
  const colorId=project.grid[r][c];
  const color=project.palette.find(x=>x.id===colorId);
  bead.className="bead"+(colorId?"":" empty");
  bead.style.background=color?color.hex:"";
}

function renderPalette(){
  const wrap=$("paletteColors"); wrap.innerHTML="";
  project.palette.forEach(color=>{
    const b=document.createElement("button");
    b.className="colorSwatch"+(color.id===selectedColor?" selected":"");
    b.style.background=color.hex;
    b.title=`${color.name} (${color.code})`;
    b.onclick=()=>{selectedColor=color.id; tool="paint"; updateToolButtons(); renderPalette()};
    wrap.appendChild(b);
  })
}

function updateToolButtons(){
  $("paintToolBtn").classList.toggle("activeTool",tool==="paint");
  $("eraseToolBtn").classList.toggle("activeTool",tool==="erase");
  $("symmetryBtn").classList.toggle("activeTool",symmetry);
}

function updateStats(){
  const counts={}; let total=0;
  project.grid.forEach(row=>row.forEach(id=>{
    if(id){counts[id]=(counts[id]||0)+1; total++}
  }));
  $("totalBeads").textContent=total;
  $("totalColors").textContent=Object.keys(counts).length;
  const width=(project.cols*project.beadSize/10).toFixed(1);
  const height=(project.rows*project.beadSize/10).toFixed(1);
  $("dimensions").textContent=`${width} × ${height} cm`;
  const list=$("materialsList"); list.innerHTML="";
  if(total===0){list.innerHTML='<p style="color:#786c66">Pinte algumas miçangas para ver a contagem.</p>';return}
  Object.entries(counts).sort((a,b)=>b[1]-a[1]).forEach(([id,qtd])=>{
    const color=project.palette.find(x=>x.id===id); if(!color)return;
    const row=document.createElement("div"); row.className="materialRow";
    row.innerHTML=`<span class="materialDot" style="background:${color.hex}"></span>
      <div class="materialName"><strong>${color.name}</strong><small>Cód. ${color.code}</small></div>
      <strong>${qtd}</strong>`;
    list.appendChild(row);
  })
}

function saveCurrent(){
  if(!project) return;
  project.updatedAt=new Date().toISOString();
  const list=loadProjects();
  const i=list.findIndex(x=>x.id===project.id);
  if(i>=0) list[i]=project; else list.unshift(project);
  saveProjects(list);
  localStorage.setItem(ACTIVE_KEY,project.id);
  updateLastProject();
  toast("Projeto salvo");
}

function updateLastProject(){
  const list=loadProjects();
  if(!list.length){$("lastProject").textContent="Nenhum projeto salvo ainda.";return}
  const p=list.sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt))[0];
  $("lastProject").innerHTML=`<strong>${p.name}</strong><br><small>${p.rows}×${p.cols} · ${p.technique}</small>`;
}

function openProject(p){
  project=ensurePalette(JSON.parse(JSON.stringify(p)));
  selectedColor=project.palette?.[0]?.id || defaultPalette[0].id;
  tool="paint"; symmetry=false; undoStack=[]; redoStack=[];
  zoomLevel=1; setProjectLabel(); renderPalette(); updateToolButtons(); renderGrid(); showView("editorView"); setupZoomGestures(); applyZoom(1); setLoomMode(project.technique==="Tear");
}

function renderProjects(){
  const list=loadProjects();
  const wrap=$("projectsList"); wrap.innerHTML="";
  if(!list.length){wrap.innerHTML="<p>Nenhum projeto salvo ainda.</p>";return}
  list.sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt)).forEach(p=>{
    const item=document.createElement("div"); item.className="projectItem";
    item.innerHTML=`<div><h3>${escapeHtml(p.name)}</h3><p>${p.rows}×${p.cols} · ${escapeHtml(p.technique)} · ${new Date(p.updatedAt).toLocaleDateString("pt-BR")}</p></div>`;
    const actions=document.createElement("div"); actions.className="projectActions";
    const open=document.createElement("button"); open.textContent="Abrir"; open.className="primary"; open.onclick=()=>openProject(p);
    const del=document.createElement("button"); del.textContent="Excluir"; del.className="secondary"; del.onclick=()=>{
      if(confirm(`Excluir "${p.name}"?`)){
        saveProjects(loadProjects().filter(x=>x.id!==p.id)); renderProjects(); updateLastProject();
      }
    };
    actions.append(open,del); item.appendChild(actions); wrap.appendChild(item);
  })
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}


$("appBgColor").oninput=(e)=>saveTheme({appBg:e.target.value});
$("gridBgColor").oninput=(e)=>saveTheme({gridBg:e.target.value});
$("resetBgBtn").onclick=resetTheme;
$("bgQuickBtn").onclick=()=>{
  const current=loadTheme().gridBg||"#faf6f2";
  const picked=prompt("Digite a cor hexadecimal do fundo da grade:",current);
  if(picked && /^#[0-9a-fA-F]{6}$/.test(picked.trim())){
    saveTheme({gridBg:picked.trim()});
    toast("Fundo da grade alterado");
  }else if(picked){
    toast("Use formato #RRGGBB");
  }
};

$("newProjectBtn").onclick=()=>showView("newProjectView");
$("imageProjectBtn").onclick=()=>showView("imageProjectView");
$("cancelImageBtn").onclick=()=>showView("homeView");
$("imageInput").onchange=(e)=>{
  const file=e.target.files?.[0];
  if(!file) return;
  const url=URL.createObjectURL(file);
  const img=new Image();
  img.onload=()=>{
    uploadedImage=img;
    $("imagePreview").src=url;
    $("imagePreviewWrap").classList.remove("hidden");
  };
  img.src=url;
};
$("generateFromImageBtn").onclick=generateProjectFromImage;
$("cancelNewBtn").onclick=()=>showView("homeView");
$("createProjectBtn").onclick=()=>{
  project=newProjectData(); selectedColor=project.palette[0].id; undoStack=[]; redoStack=[];
  zoomLevel=1; setProjectLabel(); renderPalette(); updateToolButtons(); renderGrid(); showView("editorView"); setupZoomGestures(); applyZoom(1); setLoomMode(project.technique==="Tear");
}
$("backHomeBtn").onclick=()=>{saveCurrent(); showView("homeView"); setProjectLabel()}
$("openProjectsBtn").onclick=()=>{renderProjects(); showView("projectsView")}
$("projectsBackBtn").onclick=()=>showView("homeView");
$("paintToolBtn").onclick=()=>{tool="paint";updateToolButtons()}
$("eraseToolBtn").onclick=()=>{tool="erase";updateToolButtons()}
$("symmetryBtn").onclick=()=>{symmetry=!symmetry;updateToolButtons();toast(symmetry?"Simetria ligada":"Simetria desligada")}
$("undoBtn").onclick=()=>{
  if(!project||!undoStack.length)return;
  redoStack.push(snapshot()); project.grid=undoStack.pop(); renderGrid();
}
$("redoBtn").onclick=()=>{
  if(!project||!redoStack.length)return;
  undoStack.push(snapshot()); project.grid=redoStack.pop(); renderGrid();
}
$("clearBtn").onclick=()=>{
  if(!project||!confirm("Limpar todo o desenho?"))return;
  pushHistory(); project.grid=Array.from({length:project.rows},()=>Array(project.cols).fill(null)); renderGrid();
}

$("mirrorHBtn").onclick=mirrorHorizontal;
$("mirrorVBtn").onclick=mirrorVertical;
$("zoomOutBtn").onclick=()=>applyZoom(zoomLevel-ZOOM_STEP);
$("zoomInBtn").onclick=()=>applyZoom(zoomLevel+ZOOM_STEP);
$("zoomResetBtn").onclick=()=>applyZoom(1);
$("loomBtn").onclick=()=>setLoomMode(!loomMode);

$("saveBtn").onclick=saveCurrent;
$("addColorBtn").onclick=()=>{
  if(!project)return;
  const name=prompt("Nome da cor:","Nova cor"); if(!name)return;
  const hex=prompt("Código hexadecimal da cor (ex.: #ff6600):","#ff6600")||"#ff6600";
  const code=prompt("Código da miçanga:","009")||"";
  const id="c_"+Date.now();
  project.palette.push({id,name,code,hex});
  selectedColor=id; renderPalette(); updateStats();
}

window.addEventListener("beforeinstallprompt",(e)=>{
  e.preventDefault(); deferredPrompt=e; $("installBtn").classList.remove("hidden");
});
$("installBtn").onclick=async()=>{
  if(!deferredPrompt)return;
  deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; $("installBtn").classList.add("hidden");
};

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
}

applyTheme(loadTheme());
updateLastProject();
setProjectLabel();
