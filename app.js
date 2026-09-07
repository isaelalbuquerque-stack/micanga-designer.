
const $ = (id)=>document.getElementById(id);
const views = ["homeView","newProjectView","editorView","projectsView"];
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

$("newProjectBtn").onclick=()=>showView("newProjectView");
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

updateLastProject();
setProjectLabel();
