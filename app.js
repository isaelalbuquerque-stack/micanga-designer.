
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
  {id:"c32", name:"Grafite", code:"032", hex:"#4d5056"},
  {id:"c33", name:"Lavanda", code:"033", hex:"#c4a7e7"},
  {id:"c34", name:"Ameixa", code:"034", hex:"#6f2f72"},
  {id:"c35", name:"Fúcsia", code:"035", hex:"#e43bb5"},
  {id:"c36", name:"Rosa antigo", code:"036", hex:"#c98c9f"},
  {id:"c37", name:"Azul royal", code:"037", hex:"#2448c8"},
  {id:"c38", name:"Ciano", code:"038", hex:"#21c6d8"},
  {id:"c39", name:"Menta", code:"039", hex:"#8edbc0"},
  {id:"c40", name:"Oliva", code:"040", hex:"#7e8b3b"},
  {id:"c41", name:"Esmeralda", code:"041", hex:"#138a67"},
  {id:"c42", name:"Chocolate", code:"042", hex:"#5e3828"},
  {id:"c43", name:"Caramelo", code:"043", hex:"#c9894b"},
  {id:"c44", name:"Pêssego", code:"044", hex:"#f4aa83"},
  {id:"c45", name:"Salmão", code:"045", hex:"#ef8f86"},
  {id:"c46", name:"Marfim", code:"046", hex:"#fff3d2"},
  {id:"c47", name:"Preto azulado", code:"047", hex:"#18202b"},
  {id:"c48", name:"Branco gelo", code:"048", hex:"#f4f7fb"}
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
const ZOOM_MIN = 0.05;
const ZOOM_MAX = 5;
const ZOOM_STEP = 0.10;
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
  const viewport=$("gridViewport"), stage=$("gridStage");
  if(!viewport||!stage) return;
  const old=zoomLevel, next=clampZoom(nextZoom);
  if(focusX===null) focusX=viewport.clientWidth/2;
  if(focusY===null) focusY=viewport.clientHeight/2;
  const contentX=(viewport.scrollLeft+focusX)/old;
  const contentY=(viewport.scrollTop+focusY)/old;
  zoomLevel=next;
  stage.style.transform=`scale(${zoomLevel})`;
  const w=stage.scrollWidth, h=stage.scrollHeight;
  stage.style.marginRight=`${Math.max(0,(zoomLevel-1)*w)}px`;
  stage.style.marginBottom=`${Math.max(0,(zoomLevel-1)*h)}px`;
  viewport.scrollLeft=Math.max(0,contentX*zoomLevel-focusX);
  viewport.scrollTop=Math.max(0,contentY*zoomLevel-focusY);
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
    }else if(e.touches.length===1 && tool==="pan"){
      e.preventDefault();
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
    }else if(e.touches.length===1 && panStart && tool==="pan"){
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

function columnLabel(index){
  let n=index+1, s="";
  while(n>0){ n--; s=String.fromCharCode(65+(n%26))+s; n=Math.floor(n/26); }
  return s;
}
function renderRulers(){
  if(!project) return;
  const cols=$("columnRuler"), rows=$("rowRuler");
  if(!cols||!rows) return;
  cols.innerHTML=""; rows.innerHTML="";
  cols.style.gridTemplateColumns=`repeat(${project.cols},28px)`;
  rows.style.gridTemplateRows=`repeat(${project.rows},28px)`;
  for(let c=0;c<project.cols;c++){
    const el=document.createElement("div"); el.className="rulerCell"; el.textContent=columnLabel(c); cols.appendChild(el);
  }
  for(let r=0;r<project.rows;r++){
    const el=document.createElement("div"); el.className="rulerCell"; el.textContent=String(r+1); rows.appendChild(el);
  }
}
function rotate90(){
  if(!project) return;
  pushHistory();
  const old=project.grid, nr=project.cols, nc=project.rows;
  const rotated=Array.from({length:nr},()=>Array(nc).fill(null));
  for(let r=0;r<project.rows;r++) for(let c=0;c<project.cols;c++) rotated[c][project.rows-1-r]=old[r][c];
  project.grid=rotated; project.rows=nr; project.cols=nc; renderGrid(); toast("Desenho girado 90°");
}
function safeFileName(name){
  return (name||"projeto").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,70)||"projeto";
}
function downloadBlob(blob, filename){
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=filename; document.body.appendChild(a); a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1200);
}
function projectPackage(){
  return {format:"JPmiçangas Designer",version:5,extension:".jpm",exportedAt:new Date().toISOString(),project:JSON.parse(JSON.stringify(project))};
}
function exportJpm(download=true){
  if(!project) return null;
  saveCurrent();
  const blob=new Blob([JSON.stringify(projectPackage(),null,2)],{type:"application/x-jpmicangas"});
  if(download) downloadBlob(blob,`${safeFileName(project.name)}.jpm`);
  return blob;
}
async function importJpmFile(file){
  try{
    const data=JSON.parse(await file.text()), imported=data.project||data;
    if(!imported||!Array.isArray(imported.grid)||!imported.rows||!imported.cols) throw new Error("Formato inválido");
    imported.id=uid(); imported.name=String(imported.name||"Projeto importado");
    imported.createdAt=imported.createdAt||new Date().toISOString(); imported.updatedAt=new Date().toISOString();
    openProject(imported); saveCurrent(); toast("Projeto .JPM importado");
  }catch(err){ console.error(err); toast("Arquivo .JPM inválido"); }
}
async function shareJpm(){
  if(!project) return;
  const blob=exportJpm(false), file=new File([blob],`${safeFileName(project.name)}.jpm`,{type:"application/x-jpmicangas"});
  if(navigator.canShare?.({files:[file]})&&navigator.share){
    try{ await navigator.share({title:`JPmiçangas — ${project.name}`,text:"Projeto JPmiçangas Designer",files:[file]}); return; }
    catch(e){ if(e?.name==="AbortError") return; }
  }
  downloadBlob(blob,file.name); toast("Arquivo .JPM salvo para compartilhar");
}
function buildExportCanvas(){
  if(!project) return null;
  const cell=34,ruler=38,pad=24,titleH=58,w=pad*2+ruler+project.cols*cell,h=pad*2+titleH+ruler+project.rows*cell;
  const canvas=document.createElement("canvas"); canvas.width=Math.max(640,w); canvas.height=Math.max(480,h);
  const ctx=canvas.getContext("2d"); ctx.fillStyle=loadTheme().gridBg||"#fffaff"; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#4c1d75"; ctx.font="bold 22px system-ui"; ctx.fillText(project.name||"Projeto JPmiçangas",pad,34);
  ctx.font="13px system-ui"; ctx.fillText(`${project.rows} linhas × ${project.cols} colunas • ${project.technique||""}`,pad,54);
  const ox=pad+ruler,oy=pad+titleH+ruler; ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="bold 11px system-ui";ctx.fillStyle="#5b3a78";
  for(let c=0;c<project.cols;c++) ctx.fillText(columnLabel(c),ox+c*cell+cell/2,oy-ruler/2);
  for(let r=0;r<project.rows;r++) ctx.fillText(String(r+1),ox-ruler/2,oy+r*cell+cell/2);
  for(let r=0;r<project.rows;r++) for(let c=0;c<project.cols;c++){
    const x=ox+c*cell+cell/2,y=oy+r*cell+cell/2,id=project.grid[r][c],color=project.palette.find(p=>p.id===id);
    ctx.beginPath();ctx.arc(x,y,cell*.38,0,Math.PI*2);ctx.fillStyle=color?.hex||"#f4eee9";ctx.fill();
    ctx.lineWidth=1;ctx.strokeStyle="rgba(0,0,0,.22)";ctx.stroke();
  }
  return canvas;
}
function exportJpeg(){
  const canvas=buildExportCanvas(); if(!canvas)return;
  canvas.toBlob(blob=>downloadBlob(blob,`${safeFileName(project.name)}.jpg`),"image/jpeg",.94); toast("JPEG gerado");
}
function asciiBytes(s){return new TextEncoder().encode(s)}
function concatBytes(parts){const len=parts.reduce((n,p)=>n+p.length,0),out=new Uint8Array(len);let off=0;parts.forEach(p=>{out.set(p,off);off+=p.length});return out}
function canvasToPdfBlob(canvas){
  const jpg=Uint8Array.from(atob(canvas.toDataURL("image/jpeg",.92).split(",")[1]),c=>c.charCodeAt(0));
  const pageW=595.28,pageH=841.89,margin=28,scale=Math.min((pageW-margin*2)/canvas.width,(pageH-margin*2)/canvas.height);
  const drawW=canvas.width*scale,drawH=canvas.height*scale,x=(pageW-drawW)/2,y=(pageH-drawH)/2;
  const content=`q\n${drawW.toFixed(2)} 0 0 ${drawH.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm\n/Im0 Do\nQ\n`;
  const objs=[];
  objs[1]=asciiBytes("<< /Type /Catalog /Pages 2 0 R >>");
  objs[2]=asciiBytes("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  objs[3]=asciiBytes(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  objs[4]=concatBytes([asciiBytes(`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`),jpg,asciiBytes("\nendstream")]);
  const cb=asciiBytes(content);objs[5]=concatBytes([asciiBytes(`<< /Length ${cb.length} >>\nstream\n`),cb,asciiBytes("endstream")]);
  const parts=[asciiBytes("%PDF-1.4\n")],offsets=[0];let offset=parts[0].length;
  for(let i=1;i<=5;i++){offsets[i]=offset;const part=concatBytes([asciiBytes(`${i} 0 obj\n`),objs[i],asciiBytes("\nendobj\n")]);parts.push(part);offset+=part.length}
  const xrefOffset=offset;let xref="xref\n0 6\n0000000000 65535 f \n";
  for(let i=1;i<=5;i++)xref+=String(offsets[i]).padStart(10,"0")+" 00000 n \n";
  xref+=`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  parts.push(asciiBytes(xref));return new Blob([concatBytes(parts)],{type:"application/pdf"});
}
function exportPdf(){
  const canvas=buildExportCanvas();if(!canvas)return;downloadBlob(canvasToPdfBlob(canvas),`${safeFileName(project.name)}.pdf`);toast("PDF gerado");
}
function saveAsCopy(){
  if(!project)return;const name=prompt("Nome da cópia:",`${project.name} - cópia`);if(!name)return;
  project=JSON.parse(JSON.stringify(project));project.id=uid();project.name=name.trim()||"Cópia";project.createdAt=new Date().toISOString();project.updatedAt=project.createdAt;
  setProjectLabel();saveCurrent();renderGrid();toast("Cópia salva");
}
function setupLaunchQueue(){
  if(!("launchQueue" in window))return;
  launchQueue.setConsumer(async params=>{
    const handle=params.files?.[0];if(handle){const file=await handle.getFile();await importJpmFile(file)}
  });
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


const THEME_KEY = "jpMicangasTheme_v2";

function loadTheme(){
  try{
    return JSON.parse(localStorage.getItem(THEME_KEY)||"{}");
  }catch{
    return {};
  }
}

function applyTheme(theme){
  const appBg = theme.appBg || "#f7efff";
  const gridBg = theme.gridBg || "#fffaff";
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
  const theme={appBg:"#f7efff",gridBg:"#fffaff"};
  localStorage.setItem(THEME_KEY,JSON.stringify(theme));
  applyTheme(theme);
  toast("Cores de fundo restauradas");
}

let currentView="homeView";
let lastBackAt=0;
let historyReady=false;

function showView(id){
  currentView=id;
  views.forEach(v=>$(v).classList.toggle("active",v===id));
}

function initAppHistory(){
  if(historyReady) return;
  historyReady=true;
  // Estado raiz + guarda de saída: o primeiro Voltar na tela inicial não fecha o PWA.
  history.replaceState({jp:true,view:"homeView",root:true},"");
  history.pushState({jp:true,view:"homeView",guard:true},"");
}

function navigateTo(id,{replace=false}={}){
  showView(id);
  const state={jp:true,view:id};
  if(replace) history.replaceState(state,"");
  else history.pushState(state,"");
}

function goHomeFromCurrent(){
  if(currentView==="homeView") return;
  // As telas do app são mantidas rasas no histórico; voltar retorna ao início.
  history.back();
}

window.addEventListener("popstate",(e)=>{
  const st=e.state;
  if(st?.jp && st.view && st.view!=="homeView") {
    showView(st.view);
    return;
  }

  if(st?.jp && st.view==="homeView") {
    showView("homeView");
    setProjectLabel();
    const now=Date.now();
    if(now-lastBackAt<1800){
      // Segundo Voltar: libera a navegação para o sistema fechar/sair do PWA.
      lastBackAt=0;
      setTimeout(()=>history.back(),0);
      return;
    }
    lastBackAt=now;
    toast("Pressione voltar novamente para sair");
    history.pushState({jp:true,view:"homeView",guard:true},"");
    return;
  }

  // Se o navegador entregar um estado externo, não tentamos prendê-lo no app.
});

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

let pendingCellTap=null;
let pendingPaintTimer=null;

function cancelPendingPaint(){
  if(pendingPaintTimer){ clearTimeout(pendingPaintTimer); pendingPaintTimer=null; }
}

function beginPaintFromPending(){
  if(!pendingCellTap || tool!=="paint") return;
  const {r,c}=pendingCellTap;
  cancelPendingPaint();
  pendingCellTap=null;
  pushHistory();
  isPointerDown=true;
  applyAt(r,c);
}

function renderGrid(){
  const g = $("beadGrid");
  g.innerHTML="";
  renderRulers();
  g.style.gridTemplateColumns=`repeat(${project.cols},28px)`;
  project.grid.forEach((row,r)=>{
    row.forEach((colorId,c)=>{
      const bead=document.createElement("button");
      bead.className="bead"+(colorId?"":" empty");
      bead.dataset.r=r; bead.dataset.c=c;
      const color=project.palette.find(x=>x.id===colorId);
      if(color) bead.style.background=color.hex;
      bead.addEventListener("pointerdown",(e)=>{
        if(tool==="pan") return;
        e.preventDefault();
        if(tool==="cellpick"){ openCellColorPicker(r,c); return; }
        if(tool==="erase"){
          isPointerDown=true; pushHistory(); applyAt(r,c); return;
        }
        // No pincel: toque curto abre o menu da célula; segurar/arrastar pinta.
        pendingCellTap={r,c,x:e.clientX,y:e.clientY,pointerId:e.pointerId};
        cancelPendingPaint();
        pendingPaintTimer=setTimeout(beginPaintFromPending,220);
      });
      bead.addEventListener("pointerenter",()=>{
        if(pendingCellTap && tool==="paint") beginPaintFromPending();
        if(isPointerDown) applyAt(r,c,false);
      });
      bead.addEventListener("pointerup",()=>{
        if(pendingCellTap && pendingCellTap.r===r && pendingCellTap.c===c && tool==="paint"){
          cancelPendingPaint();
          pendingCellTap=null;
          isPointerDown=false;
          openCellColorPicker(r,c);
          return;
        }
        isPointerDown=false;
      });
      bead.addEventListener("pointercancel",()=>{
        cancelPendingPaint(); pendingCellTap=null; isPointerDown=false;
      });
      g.appendChild(bead);
    })
  });
  g.onpointermove=(e)=>{
    if(!pendingCellTap || tool!=="paint") return;
    if(Math.hypot(e.clientX-pendingCellTap.x,e.clientY-pendingCellTap.y)>8) beginPaintFromPending();
  };
  updateStats();
}

document.addEventListener("pointerup",()=>{
  if(pendingCellTap){ cancelPendingPaint(); pendingCellTap=null; }
  isPointerDown=false;
});

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
    b.dataset.code=color.code||"";
    b.onclick=()=>{selectedColor=color.id; tool="paint"; updateToolButtons(); renderPalette()};
    wrap.appendChild(b);
  })
}

function updateToolButtons(){
  $("paintToolBtn").classList.toggle("activeTool",tool==="paint");
  $("eraseToolBtn").classList.toggle("activeTool",tool==="erase");
  $("cellColorToolBtn")?.classList.toggle("activeTool",tool==="cellpick");
  $("handToolBtn")?.classList.toggle("activeTool",tool==="pan");
  $("gridViewport")?.classList.toggle("panMode",tool==="pan");
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
  zoomLevel=1; setProjectLabel(); renderPalette(); updateToolButtons(); renderGrid(); navigateTo("editorView",{replace:true}); setupZoomGestures(); applyZoom(1); setLoomMode(project.technique==="Tear");
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
  const current=loadTheme().gridBg||"#fffaff";
  const picked=prompt("Digite a cor hexadecimal do fundo da grade:",current);
  if(picked && /^#[0-9a-fA-F]{6}$/.test(picked.trim())){
    saveTheme({gridBg:picked.trim()});
    toast("Fundo da grade alterado");
  }else if(picked){
    toast("Use formato #RRGGBB");
  }
};

$("newProjectBtn").onclick=()=>navigateTo("newProjectView");
$("imageProjectBtn").onclick=()=>navigateTo("imageProjectView");
$("cancelImageBtn").onclick=goHomeFromCurrent;
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
$("cancelNewBtn").onclick=goHomeFromCurrent;
$("createProjectBtn").onclick=()=>{
  project=newProjectData(); selectedColor=project.palette[0].id; undoStack=[]; redoStack=[];
  zoomLevel=1; setProjectLabel(); renderPalette(); updateToolButtons(); renderGrid(); navigateTo("editorView",{replace:true}); setupZoomGestures(); applyZoom(1); setLoomMode(project.technique==="Tear");
}
$("backHomeBtn").onclick=()=>{saveCurrent(); goHomeFromCurrent();}
$("openProjectsBtn").onclick=()=>{renderProjects(); navigateTo("projectsView")}
$("projectsBackBtn").onclick=goHomeFromCurrent;
$("handToolBtn").onclick=()=>{tool=tool==="pan"?"paint":"pan";isPointerDown=false;panStart=null;updateToolButtons();toast(tool==="pan"?"Modo mover: arraste o tear com um dedo":"Modo mover desligado")}
$("paintToolBtn").onclick=()=>{tool="paint";updateToolButtons()}
$("eraseToolBtn").onclick=()=>{tool="erase";updateToolButtons()}
$("cellColorToolBtn").onclick=()=>{tool=tool==="cellpick"?"paint":"cellpick";updateToolButtons();toast(tool==="cellpick"?"Modo célula: toque numa miçanga para escolher a cor":"Seleção por célula desligada")}
$("moreToolsBtn").onclick=()=>{$("moreToolsPanel").classList.toggle("hidden");$("moreToolsBtn").classList.toggle("activeTool",!$("moreToolsPanel").classList.contains("hidden"))}
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
$("saveAsBtn").onclick=saveAsCopy;
$("rotateBtn").onclick=rotate90;
$("exportJpegBtn").onclick=exportJpeg;
$("exportPdfBtn").onclick=exportPdf;
$("shareProjectBtn").onclick=shareJpm;
$("quickJpmBtn").onclick=()=>exportJpm(true);
$("quickJpegBtn").onclick=exportJpeg;
$("quickPdfBtn").onclick=exportPdf;
$("quickShareBtn").onclick=shareJpm;
$("importProjectBtn").onclick=()=>$("projectFileInput").click();
$("projectFileInput").onchange=async(e)=>{const file=e.target.files?.[0];if(file)await importJpmFile(file);e.target.value=""};
$("addColorBtn").onclick=()=>{
  if(!project)return;
  const name=prompt("Nome da cor:","Nova cor"); if(!name)return;
  const hex=prompt("Código hexadecimal da cor (ex.: #ff6600):","#ff6600")||"#ff6600";
  const code=prompt("Código da miçanga:","009")||"";
  const id="c_"+Date.now();
  project.palette.push({id,name,code,hex});
  selectedColor=id; renderPalette(); updateStats();
}


// ===== V6: cores fiéis, detecção automática, paleta flutuante e seleção por célula =====
let cellPickerTarget=null;
function hexRgb(hex){hex=String(hex||"").replace("#","");if(hex.length===3)hex=hex.split("").map(x=>x+x).join("");return [parseInt(hex.slice(0,2),16)||0,parseInt(hex.slice(2,4),16)||0,parseInt(hex.slice(4,6),16)||0]}
function rgbLab(r,g,b){
  let v=[r,g,b].map(x=>{x/=255;return x>.04045?Math.pow((x+.055)/1.055,2.4):x/12.92});
  let x=(v[0]*.4124+v[1]*.3576+v[2]*.1805)/.95047,y=(v[0]*.2126+v[1]*.7152+v[2]*.0722),z=(v[0]*.0193+v[1]*.1192+v[2]*.9505)/1.08883;
  [x,y,z]=[x,y,z].map(t=>t>.008856?Math.cbrt(t):(7.787*t+16/116));return [116*y-16,500*(x-y),200*(y-z)];
}
function labDist(a,b){return (a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2}
function nearestPaletteIdLab(r,g,b,palette){const lab=rgbLab(r,g,b);let best=null,bd=Infinity;for(const c of palette){const rgb=c.rgb||hexRgb(c.hex),d=labDist(lab,rgbLab(...rgb));if(d<bd){bd=d;best=c}}return best?.id||null}
function median(arr){const a=[...arr].sort((x,y)=>x-y);return a.length?a[Math.floor(a.length/2)]:0}
function estimateBackground(ctx,w,h){
  const d=ctx.getImageData(0,0,w,h).data,rs=[],gs=[],bs=[],band=Math.max(2,Math.round(Math.min(w,h)*.025));
  const take=(x,y)=>{const i=(y*w+x)*4;if(d[i+3]>100){rs.push(d[i]);gs.push(d[i+1]);bs.push(d[i+2])}};
  for(let x=0;x<w;x+=2){for(let y=0;y<band;y++)take(x,y);for(let y=h-band;y<h;y++)take(x,y)}
  for(let y=0;y<h;y+=2){for(let x=0;x<band;x++)take(x,y);for(let x=w-band;x<w;x++)take(x,y)}
  return [median(rs),median(gs),median(bs)];
}
function adaptiveForeground(r,g,b,bg,bgMode){
  if(bgMode==="none")return true;
  if(bgMode==="light" && r>225&&g>225&&b>225)return false;
  if(bgMode==="dark" && r<55&&g<55&&b<55)return false;
  const dl=Math.sqrt(labDist(rgbLab(r,g,b),rgbLab(...bg)));
  const lum=(r+g+b)/3,bgl=(bg[0]+bg[1]+bg[2])/3;
  const threshold=bgMode==="auto"?13:10;
  return dl>threshold || Math.abs(lum-bgl)>24;
}
function denseObjectCrop(ctx,w,h,bgMode){
  if(bgMode==="none")return {x:0,y:0,w,h,bg:[255,255,255]};
  const bg=estimateBackground(ctx,w,h),d=ctx.getImageData(0,0,w,h).data,row=new Uint32Array(h),col=new Uint32Array(w);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]>100&&adaptiveForeground(d[i],d[i+1],d[i+2],bg,bgMode)){row[y]++;col[x]++}}
  const rthr=Math.max(3,Math.round(w*.022)),cthr=Math.max(3,Math.round(h*.022));
  let y0=0,y1=h-1,x0=0,x1=w-1;
  while(y0<h&&row[y0]<rthr)y0++; while(y1>=0&&row[y1]<rthr)y1--;
  while(x0<w&&col[x0]<cthr)x0++; while(x1>=0&&col[x1]<cthr)x1--;
  if(x1<=x0||y1<=y0)return {x:0,y:0,w,h,bg};
  const px=Math.round((x1-x0+1)*.025),py=Math.round((y1-y0+1)*.025);
  x0=Math.max(0,x0-px);x1=Math.min(w-1,x1+px);y0=Math.max(0,y0-py);y1=Math.min(h-1,y1+py);
  return {x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,bg};
}
function cellRepresentatives(ctx,crop,cols,rows,bgMode){
  const d=ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height).data,w=ctx.canvas.width;
  const reps=Array.from({length:rows},()=>Array(cols).fill(null)),colors=[];
  for(let gy=0;gy<rows;gy++)for(let gx=0;gx<cols;gx++){
    const sx0=crop.x+(gx+.18)*crop.w/cols,sx1=crop.x+(gx+.82)*crop.w/cols;
    const sy0=crop.y+(gy+.18)*crop.h/rows,sy1=crop.y+(gy+.82)*crop.h/rows;
    let sr=0,sg=0,sb=0,n=0,total=0;
    const stepx=Math.max(1,Math.floor((sx1-sx0)/5)),stepy=Math.max(1,Math.floor((sy1-sy0)/5));
    for(let y=Math.floor(sy0);y<sy1;y+=stepy)for(let x=Math.floor(sx0);x<sx1;x+=stepx){total++;const i=(y*w+x)*4;if(d[i+3]<100)continue;const r=d[i],g=d[i+1],b=d[i+2];if(adaptiveForeground(r,g,b,crop.bg,bgMode)){sr+=r;sg+=g;sb+=b;n++}}
    if(n>=Math.max(2,total*.22)){const rgb=[sr/n,sg/n,sb/n];reps[gy][gx]=rgb;colors.push(rgb)}
  }
  return {reps,colors};
}
function kmeansRaw(pixels,k){
  if(!pixels.length)return {centers:[],sse:0};k=Math.max(1,Math.min(k,pixels.length));
  const sample=pixels.length>5000?pixels.filter((_,i)=>i%Math.ceil(pixels.length/5000)===0):pixels;
  let centers=[sample[Math.floor(sample.length/2)].slice()];
  while(centers.length<k){let best=sample[0],bd=-1;for(const p of sample){let d=Infinity;for(const c of centers)d=Math.min(d,labDist(rgbLab(...p),rgbLab(...c)));if(d>bd){bd=d;best=p}}centers.push(best.slice())}
  for(let it=0;it<10;it++){
    const sums=Array.from({length:k},()=>[0,0,0,0]);
    for(const p of sample){let bi=0,bd=Infinity;for(let j=0;j<k;j++){const d=labDist(rgbLab(...p),rgbLab(...centers[j]));if(d<bd){bd=d;bi=j}}const q=sums[bi];q[0]+=p[0];q[1]+=p[1];q[2]+=p[2];q[3]++}
    centers=sums.map((q,i)=>q[3]?[q[0]/q[3],q[1]/q[3],q[2]/q[3]]:centers[i]);
  }
  let sse=0;for(const p of sample){let bd=Infinity;for(const c of centers)bd=Math.min(bd,labDist(rgbLab(...p),rgbLab(...c)));sse+=bd}
  return {centers,sse};
}
function autoKmeansPalette(pixels){
  if(pixels.length<2)return[];const maxK=Math.min(10,Math.max(2,Math.floor(Math.sqrt(pixels.length))));let prev=kmeansRaw(pixels,2),chosen=prev;
  for(let k=3;k<=maxK;k++){const cur=kmeansRaw(pixels,k),improve=(prev.sse-cur.sse)/Math.max(prev.sse,1);if(improve<.22){chosen=prev;break}chosen=cur;prev=cur}
  return chosen.centers.map((rgb,i)=>({id:`img_${Date.now()}_${i}`,name:`Cor detectada ${i+1}`,code:`IMG${String(i+1).padStart(2,"0")}`,hex:rgbToHex(...rgb),rgb}));
}
function kmeansPalette(pixels,k){const raw=kmeansRaw(pixels,k);return raw.centers.map((rgb,i)=>({id:`img_${Date.now()}_${i}`,name:`Cor detectada ${i+1}`,code:`IMG${String(i+1).padStart(2,"0")}`,hex:rgbToHex(...rgb),rgb}))}
function manualPalette(text){const parts=String(text||"").split(",").map(x=>x.trim()).filter(Boolean);return parts.map((v,i)=>{let base=defaultPalette.find(c=>c.name.toLowerCase()===v.toLowerCase()||c.code===v);let hex=/^#[0-9a-f]{6}$/i.test(v)?v:(base?.hex||null);if(!hex)return null;return {id:`manual_${Date.now()}_${i}`,name:base?.name||`Cor informada ${i+1}`,code:base?.code||`MAN${String(i+1).padStart(2,"0")}`,hex,rgb:hexRgb(hex)}}).filter(Boolean)}
function showDetectedPalette(pal){const box=$("detectedColorsBox"),wrap=$("detectedColorsPreview");if(!box||!wrap)return;wrap.innerHTML="";pal.forEach(c=>{const d=document.createElement("span");d.className="detectedChip";d.innerHTML=`<i style="background:${c.hex}"></i>${c.hex}`;wrap.appendChild(d)});box.classList.toggle("hidden",!pal.length)}
function imageAnalysisCanvas(){if(!uploadedImage)return null;const canvas=$("imageProcessCanvas"),ctx=canvas.getContext("2d",{willReadFrequently:true});const scale=Math.min(1,900/Math.max(uploadedImage.naturalWidth,uploadedImage.naturalHeight));canvas.width=Math.max(1,Math.round(uploadedImage.naturalWidth*scale));canvas.height=Math.max(1,Math.round(uploadedImage.naturalHeight*scale));ctx.drawImage(uploadedImage,0,0,canvas.width,canvas.height);return {canvas,ctx}}
function detectCurrentImageColors(){
  if(!uploadedImage){toast("Escolha uma imagem primeiro");return[]}
  const a=imageAnalysisCanvas(),mode=$("backgroundModeInput").value,crop=denseObjectCrop(a.ctx,a.canvas.width,a.canvas.height,mode),cols=Number($("imageColsInput").value)||20,rows=Math.max(4,Math.min(100,Math.round(cols*crop.h/crop.w))),cells=cellRepresentatives(a.ctx,crop,cols,rows,mode);
  const val=$("imageColorsInput").value,pal=val==="auto"?autoKmeansPalette(cells.colors):kmeansPalette(cells.colors,Math.max(2,Number(val)||2));showDetectedPalette(pal);toast(`${pal.length} cores detectadas`);return pal
}
$("detectImageColorsBtn").onclick=detectCurrentImageColors;

async function generateProjectFromImageV61(){
  if(!uploadedImage){toast("Escolha uma imagem primeiro");return}
  const cols=Number($("imageColsInput").value)||20,bgMode=$("backgroundModeInput").value,name=$("imageProjectName").value.trim()||"Brinco convertido";
  const a=imageAnalysisCanvas(),crop=denseObjectCrop(a.ctx,a.canvas.width,a.canvas.height,bgMode),rows=Math.max(4,Math.min(100,Math.round(cols*crop.h/crop.w))),cells=cellRepresentatives(a.ctx,crop,cols,rows,bgMode);
  let imgPalette=manualPalette($("manualImageColors").value);if(!imgPalette.length){const val=$("imageColorsInput").value;imgPalette=val==="auto"?autoKmeansPalette(cells.colors):kmeansPalette(cells.colors,Math.max(2,Number(val)||2))}
  if(!imgPalette.length){toast("Não consegui identificar as miçangas. Tente outro modo de fundo.");return}showDetectedPalette(imgPalette);
  const grid=Array.from({length:rows},()=>Array(cols).fill(null));for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const rgb=cells.reps[y][x];if(rgb)grid[y][x]=nearestPaletteIdLab(...rgb,imgPalette)}
  project={id:uid(),name,rows,cols,beadSize:3,technique:"Grade reta",palette:imgPalette.map(({rgb,...rest})=>rest),grid,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),source:"image-v6.1"};selectedColor=project.palette[0].id;tool="paint";symmetry=false;undoStack=[];redoStack=[];zoomLevel=1;setProjectLabel();renderPalette();updateToolButtons();renderGrid();navigateTo("editorView",{replace:true});setupZoomGestures();applyZoom(1);setLoomMode(false);toast(`Diagrama criado com ${imgPalette.length} cores`)
}
$("generateFromImageBtn").onclick=generateProjectFromImageV61;

function openCellColorPicker(r,c){cellPickerTarget={r,c};$("cellPickerTitle").textContent=`Célula ${columnLabel(c)}${r+1} — escolher cor`;$("cellColorSearch").value="";renderCellColorOptions();$("cellColorPicker").classList.remove("hidden")}
function renderCellColorOptions(){if(!project)return;const q=$("cellColorSearch").value.trim().toLowerCase(),wrap=$("cellColorOptions");wrap.innerHTML="";project.palette.filter(c=>!q||c.name.toLowerCase().includes(q)||String(c.code).toLowerCase().includes(q)).forEach(c=>{const b=document.createElement("button");b.className="cellColorOption";b.innerHTML=`<span class="cellColorOptionDot" style="background:${c.hex}"></span><span><strong>${escapeHtml(c.name)}</strong><small>Cód. ${escapeHtml(c.code||"")} · ${c.hex}</small></span>`;b.onclick=()=>{if(!cellPickerTarget)return;pushHistory();selectedColor=c.id;project.grid[cellPickerTarget.r][cellPickerTarget.c]=c.id;renderGrid();renderPalette();$("cellColorPicker").classList.add("hidden");toast(`Cor ${c.code||c.name} aplicada`)};wrap.appendChild(b)})}
$("cellColorSearch").oninput=renderCellColorOptions;$("closeCellPickerBtn").onclick=()=>$("cellColorPicker").classList.add("hidden");

(function setupInlinePalette(){const pal=$("floatingPalette"),btn=$("collapsePaletteBtn");if(!pal||!btn)return;btn.onclick=()=>{pal.classList.toggle("collapsed");btn.textContent=pal.classList.contains("collapsed")?"＋":"−"}})();

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

initAppHistory();
applyTheme(loadTheme());
updateLastProject();
setProjectLabel();
setupLaunchQueue();
