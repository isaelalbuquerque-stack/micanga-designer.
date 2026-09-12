
const $ = (id)=>document.getElementById(id);
const views = ["homeView","newProjectView","imageProjectView","templatesView","editorView","projectsView"];
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
let selectedRows = new Set();
let selectedCols = new Set();
let colDragSelecting=false;
let colDragMode="add";
let colDragVisited=new Set();
let areaSelection = null;
let areaAnchor = null;
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
let imageCropPoints = [];
let imageCropHistory = [];
let imageCropDrawing = false;
let imageCropActive = false;
let imageCropMode = "free";
let imageQuad = null;
let imageQuadAdjusted = false;
let imageSixPoints = null;
let imagePointDrag = -1;
let imagePreviewZoom = 1;
let imagePanMode = false;
let geometryPreviewState = null;
let geometryPreviewTool = "paint";
let geometryPreviewColorId = "capture_red";
let imageMagnifierVisible = false;
const IMAGE_PREVIEW_ZOOM_MIN = 1;
const IMAGE_PREVIEW_ZOOM_MAX = 6;


const READY_TEMPLATES = [
  {id:"flag_br_real",name:"Bandeira do Brasil — realista",category:"Bandeiras",type:"Pulseira / Colar",technique:"Tear",rows:35,cols:53,pattern:[
"GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGGGGGGGYGGGGGGGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGGGGGYYYYYGGGGGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGGGGYYYYYYYGGGGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGGYYYBBBBBYYYGGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGYBBBBBBBBBBBYGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGYYBBBBBBBBBBBBBYYGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGYBBBBBBBBBBBBBBBBBYGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGYBBBBBBBBBBBBBBBBBBBYGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGYYYBBBBBBBBBBBBBBBBBBBYYYGGGGGGGGGGGGGG","GGGGGGGGGGGGGYYYBBBBBBBBBBBBBBBBBBBBBYYYGGGGGGGGGGGGG","GGGGGGGGGGGYYYYYBBBBBBBBBBBBBBBBBBBBBYYYYYGGGGGGGGGGG","GGGGGGGGGGYYYYYWWWWWWWWWWWBBBBBBBBBBBBYYYYYGGGGGGGGGG","GGGGGGGGGYYYYYYBBBBBWWWWWWWWWWBBBBBBBBYYYYYYGGGGGGGGG","GGGGGGGYYYYYYYYBBBBBBBBBBBBWWWWWWWBBBBYYYYYYYYGGGGGGG","GGGGGGYYYYYYYYYBBBBBBBBBBBBBBBBWWWWWWBYYYYYYYYYGGGGGG","GGGGGGGYYYYYYYYBBBBBBBBBBBBBBBBBBBBWWWYYYYYYYYGGGGGGG","GGGGGGGGGYYYYYYBBBBBBBBBBBBBBBBBBBBBBWYYYYYYGGGGGGGGG","GGGGGGGGGGYYYYYBBBBWBBBWBBBBBBBWBBBBBBYYYYYGGGGGGGGGG","GGGGGGGGGGGYYYYYBBBBBBBBBBBWBBBBBBBBBYYYYYGGGGGGGGGGG","GGGGGGGGGGGGGYYYBBBBBBBBBBBBBBBBBBBBBYYYGGGGGGGGGGGGG","GGGGGGGGGGGGGGYYYBBBBWBBBBBBBBBBBWBBYYYGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGYBBBBBBBBWBBBWBBBBBBYGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGYBBBBBBBBBBBBBBBBBYGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGYYWBBBBBBBBBBBWYYGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGYBBBWBBBWBBBYGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGGYYYBBBBBYYYGGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGGGGYYYYYYYGGGGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGGGGGYYYYYGGGGGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGGGGGGGYGGGGGGGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG"],map:{G:"c6",Y:"c5",B:"c37",W:"c2"},detail:"Realista · losango, globo, faixa branca curva e estrelas"},
  {id:"flag_br",name:"Bandeira do Brasil",category:"Bandeiras",type:"Pulseira",technique:"Tear",rows:10,cols:10,pattern:[
    "GGGGGGGGGG","GGGGYYGGGG","GGYYYYYYGG","GYYYBBYYYG","YYYBBBBYYY","YYYBBBBYYY","GYYYBBYYYG","GGYYYYYYGG","GGGGYYGGGG","GGGGGGGGGG"], map:{G:"c6",Y:"c5",B:"c4"}},
  {id:"flag_ar",name:"Bandeira da Argentina",category:"Bandeiras",type:"Pulseira",technique:"Tear",rows:9,cols:12,pattern:[
    "BBBBBBBBBBBB","BBBBBBBBBBBB","BBBBBBBBBBBB","WWWWWWWWWWWW","WWWWWYYWWWWW","WWWWWWWWWWWW","BBBBBBBBBBBB","BBBBBBBBBBBB","BBBBBBBBBBBB"], map:{B:"c13",W:"c2",Y:"c5"}},
  {id:"flag_pt",name:"Bandeira de Portugal",category:"Bandeiras",type:"Pulseira",technique:"Tear",rows:10,cols:12,pattern:[
    "GGGGGRRRRRRR","GGGGGRRRRRRR","GGGGGRRRRRRR","GGGYYRRRRRRR","GGYYYYRRRRRR","GGYYYYRRRRRR","GGGYYRRRRRRR","GGGGGRRRRRRR","GGGGGRRRRRRR","GGGGGRRRRRRR"], map:{G:"c16",R:"c3",Y:"c5"}},
  {id:"flag_fr",name:"Bandeira da França",category:"Bandeiras",type:"Pulseira",technique:"Tear",rows:10,cols:12,pattern:Array(10).fill("BBBBWWWWRRRR"),map:{B:"c37",W:"c2",R:"c3"}},
  {id:"flag_it",name:"Bandeira da Itália",category:"Bandeiras",type:"Pulseira",technique:"Tear",rows:10,cols:12,pattern:Array(10).fill("GGGGWWWWRRRR"),map:{G:"c6",W:"c2",R:"c3"}},

  {id:"team_fla",name:"Flamengo — vermelho e preto",category:"Futebol",type:"Pulseira",technique:"Tear",rows:10,cols:12,pattern:[
    "RRRRRRRRRRRR","KKKKKKKKKKKK","RRRRRRRRRRRR","KKKKKKKKKKKK","RRRRRRRRRRRR","KKKKKKKKKKKK","RRRRRRRRRRRR","KKKKKKKKKKKK","RRRRRRRRRRRR","KKKKKKKKKKKK"],map:{R:"c3",K:"c1"}},
  {id:"team_cor",name:"Corinthians — preto e branco",category:"Futebol",type:"Pulseira",technique:"Tear",rows:10,cols:12,pattern:[
    "WWWWWWWWWWWW","WWKKKKKKKKWW","WKKWWWWWWKKW","WKKWKKKKWKKW","WKKWKKKKWKKW","WKKWKKKKWKKW","WKKWKKKKWKKW","WKKWWWWWWKKW","WWKKKKKKKKWW","WWWWWWWWWWWW"],map:{W:"c2",K:"c1"}},
  {id:"team_pal",name:"Palmeiras — verde e branco",category:"Futebol",type:"Brinco",technique:"Brick Stitch",rows:10,cols:10,pattern:[
    "GGGGGGGGGG","GGWWWWWWGG","GWWGGGGWWG","GWGGWWGGWG","GWGWWWWGWG","GWGWWWWGWG","GWGGWWGGWG","GWWGGGGWWG","GGWWWWWWGG","GGGGGGGGGG"],map:{G:"c16",W:"c2"}},
  {id:"team_sp",name:"São Paulo — branco, vermelho e preto",category:"Futebol",type:"Brinco",technique:"Brick Stitch",rows:10,cols:10,pattern:[
    "WWWWWWWWWW","WWWWWWWWWW","RRRRRRRRRR","KKKKKKKKKK","WWWWWWWWWW","WWWWWWWWWW","KKKKKKKKKK","RRRRRRRRRR","WWWWWWWWWW","WWWWWWWWWW"],map:{W:"c2",R:"c3",K:"c1"}},
  {id:"team_vasco",name:"Vasco — preto, branco e vermelho",category:"Futebol",type:"Cordão",technique:"Tear",rows:10,cols:12,pattern:[
    "KKKKKKKKKKWW","KKKKKKKKKWWK","KKKKKKKKWWKK","KKKKKKKWWKKK","KKKKRRWWKKKK","KKKKWWRRKKKK","KKKWWKKKKKKK","KKWWKKKKKKKK","KWWKKKKKKKKK","WWKKKKKKKKKK"],map:{K:"c1",W:"c2",R:"c3"}},
  {id:"team_pay",name:"Paysandu — azul e branco",category:"Futebol",type:"Pulseira",technique:"Tear",rows:10,cols:12,pattern:[
    "BBBBBBBBBBBB","WWWWWWWWWWWW","BBBBBBBBBBBB","WWWWWWWWWWWW","BBBBBBBBBBBB","WWWWWWWWWWWW","BBBBBBBBBBBB","WWWWWWWWWWWW","BBBBBBBBBBBB","WWWWWWWWWWWW"],map:{B:"c37",W:"c2"}},
  {id:"team_rem",name:"Remo — azul marinho e branco",category:"Futebol",type:"Pulseira",technique:"Tear",rows:10,cols:12,pattern:[
    "NNNNNNNNNNNN","NNWWWWWWWWNN","NWWNNNNNNWWN","NWNNWWWWNNWN","NWNNWWWWNNWN","NWNNWWWWNNWN","NWNNWWWWNNWN","NWWNNNNNNWWN","NNWWWWWWWWNN","NNNNNNNNNNNN"],map:{N:"c14",W:"c2"}},

  {id:"ear_geo1",name:"Brinco losango clássico",category:"Brincos",type:"Brinco",technique:"Brick Stitch",rows:12,cols:9,pattern:[
    "....M....","...MMM...","..MYYYM..",".MYYYMMY.","MYYMMYYYM",".MYYYMMY.","..MYYYM..","...MMM...","....M....","....M....","...M.M...","..M...M.."],map:{M:"c23",Y:"c5"}},
  {id:"ear_geo2",name:"Brinco tribal geométrico",category:"Brincos",type:"Brinco",technique:"Tear",rows:12,cols:10,pattern:[
    "....KK....","...KTTK...","..KTTTTK..",".KTTKKTTK.","KTTKYYKTTK","KTTKYYKTTK",".KTTKKTTK.","..KTTTTK..","...KTTK...","....KK....","...K..K...","..K....K.."],map:{K:"c1",T:"c12",Y:"c5"}},
  {id:"brace_geo",name:"Pulseira chevron",category:"Pulseiras",type:"Pulseira",technique:"Tear",rows:8,cols:16,pattern:[
    "RR..RR..RR..RR..",".RR..RR..RR..RR.","..RR..RR..RR..RR","...RR..RR..RR..R","...BB..BB..BB..B","..BB..BB..BB..BB",".BB..BB..BB..BB.","BB..BB..BB..BB.."],map:{R:"c3",B:"c37"}},
  {id:"neck_geo",name:"Cordão geométrico central",category:"Cordões",type:"Cordão",technique:"Tear",rows:9,cols:18,pattern:[
    "........YY........",".......YGGY.......","......YGGGGY......",".....YGGKKGGY.....","....YGGKKKKGGY....",".....YGGKKGGY.....","......YGGGGY......",".......YGGY.......","........YY........"],map:{Y:"c7",G:"c41",K:"c1"}},
  {id:"team_fla_detail",name:"Flamengo — escudo detalhado",category:"Futebol",type:"Brinco",technique:"Brick Stitch",rows:20,cols:20,pattern:[
    "....RRRRRRRRRRRR....","...RRRRRRRRRRRRRR...","..RRKKKKKKKKKKKKRR..","..RRKKKKKKKKKKKKRR..","..RRRRRRRRRRRRRRRR..","..RRRRRRRRRRRRRRRR..","..RRKKKKKKKKKKKKRR..","..RRKKKKKKKKKKKKRR..","..RRRRRRRRRRRRRRRR..","..RRRRRWWWWWWRRRRR..","..RRKKKWKWWKWRKKRR..","..RRKKKWWKKWWKKKRR..","...RRRRRRRRRRRRRR...","...RRKKKKKKKKKKRR...","....RRRRRRRRRRRR....",".....RRKKKKKKRR.....","......RRRRRRRR......",".......RRRRRR.......","........RRRR........",".........RR........."],map:{R:"c3",K:"c1",W:"c2"}},
  {id:"team_vasco_detail",name:"Vasco — escudo detalhado",category:"Futebol",type:"Brinco",technique:"Brick Stitch",rows:20,cols:20,pattern:[
    "....KKKKKKKKKKKK....","...KKKKKKKKKKKKKK...","..KKKKKKKKKKKKKKKK..","..KKKKKKKKKKKKKWWK..","..KKKKKKKKKKKKWWWK..","..KKKKKKKKKKKWWKKK..","..KKKKKKKKKKWWKKKK..","..KKKKRRRKKWWKKKKK..","..KKKKRRRWWKKKKKKK..","..KKKRRRWWRRKKKKKK..","..KKKRRWWRRRKKKKKK..","..KKKKWWKRRRKKKKKK..","...KWWKKKKKKKKKKK...","...WWKKKKKKKKKKKK...","....KKKKKKKKKKKK....",".....KKKKKKKKKK.....","......KKKKKKKK......",".......KKKKKK.......","........KKKK........",".........KK........."],map:{K:"c1",W:"c2",R:"c3"}}
];

function templateMatrix(t){
  return t.pattern.map(row=>Array.from(row).map(ch=>ch==='.'?null:(t.map[ch]||null)));
}
function resizeTemplateGrid(source,newRows,newCols){
  const sr=source.length, sc=source[0]?.length||1;
  return Array.from({length:newRows},(_,r)=>Array.from({length:newCols},(_,c)=>{
    const rr=Math.min(sr-1,Math.floor((r+.5)*sr/newRows));
    const cc=Math.min(sc-1,Math.floor((c+.5)*sc/newCols));
    return source[rr][cc];
  }));
}
function reduceTemplateColors(grid,maxColors){
  const ids=[...new Set(grid.flat().filter(Boolean))];
  if(ids.length<=maxColors) return grid;
  const colors=ids.map(id=>defaultPalette.find(c=>c.id===id)).filter(Boolean);
  const keep=colors.slice(0,Math.max(1,maxColors));
  const rgb=h=>{const x=h.replace('#','');return [parseInt(x.slice(0,2),16),parseInt(x.slice(2,4),16),parseInt(x.slice(4,6),16)]};
  const nearest=id=>{
    const c=defaultPalette.find(x=>x.id===id); if(!c)return keep[0]?.id||id;
    const a=rgb(c.hex); let best=keep[0],bd=Infinity;
    keep.forEach(k=>{const b=rgb(k.hex),d=(a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2;if(d<bd){bd=d;best=k}});
    return best?.id||id;
  };
  return grid.map(row=>row.map(nearest));
}
function templateToProject(t,opts={}){
  const rows=Math.max(2,Math.min(100,Number(opts.rows)||t.rows));
  const cols=Math.max(2,Math.min(100,Number(opts.cols)||t.cols));
  const beadSize=Math.max(1,Math.min(20,Number(opts.beadSize)||3));
  const maxColors=Math.max(1,Math.min(32,Number(opts.colors)||32));
  let grid=resizeTemplateGrid(templateMatrix(t),rows,cols);
  grid=reduceTemplateColors(grid,maxColors);
  return ensurePalette({
    id:uid(),name:t.name,rows,cols,beadSize,technique:t.technique,
    palette:JSON.parse(JSON.stringify(defaultPalette)),grid,
    createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),templateType:t.type
  });
}

function renderTemplatePreview(t,host){
  host.innerHTML='';
  host.style.gridTemplateColumns=`repeat(${t.cols},1fr)`;
  t.pattern.forEach(row=>Array.from(row).forEach(ch=>{
    const d=document.createElement('span'); d.className='templateBead'+(ch==='.'?' templateEmpty':'');
    if(ch!=='.'){
      const id=t.map[ch], color=defaultPalette.find(c=>c.id===id);
      if(color) d.style.background=color.hex;
    }
    host.appendChild(d);
  }));
}

function renderTemplates(category='Todos'){
  const wrap=$('templatesList'); if(!wrap) return;
  wrap.innerHTML='';
  READY_TEMPLATES.filter(t=>category==='Todos'||t.category===category).forEach(t=>{
    const card=document.createElement('article'); card.className='templateItem';
    const preview=document.createElement('div'); preview.className='templatePreview';
    renderTemplatePreview(t,preview);
    const body=document.createElement('div'); body.className='templateBody';
    const nativeColors=new Set(t.pattern.join('').split('').filter(ch=>ch!=='.').map(ch=>t.map[ch]).filter(Boolean)).size;
    const beadCount=t.pattern.join('').split('').filter(ch=>ch!=='.').length;
    body.innerHTML=`<div class="templateBadges"><span>${t.category}</span><span>${t.type}</span></div><h3>${escapeHtml(t.name)}</h3><p>Base ${t.rows}×${t.cols} · ${escapeHtml(t.technique)} · ${nativeColors} cores · ${beadCount} miçangas</p>${t.detail?`<p class="templateDetail">${escapeHtml(t.detail)}</p>`:""}
      <div class="templateCustomize">
        <label>Linhas<input class="tplRows" type="number" min="2" max="100" value="${t.rows}"></label>
        <label>Colunas<input class="tplCols" type="number" min="2" max="100" value="${t.cols}"></label>
        <label>Miçanga (mm)<input class="tplBead" type="number" min="1" max="20" step="0.5" value="3"></label>
        <label>Cores<input class="tplColors" type="number" min="1" max="32" value="${nativeColors}"></label>
      </div>`;
    const info=document.createElement('div'); info.className='templateSizeInfo';
    const updateInfo=()=>{const r=+body.querySelector('.tplRows').value||t.rows,c=+body.querySelector('.tplCols').value||t.cols,b=+body.querySelector('.tplBead').value||3;info.textContent=`Peça aprox.: ${(c*b/10).toFixed(1)} × ${(r*b/10).toFixed(1)} cm`;};
    body.querySelectorAll('input').forEach(i=>i.addEventListener('input',updateInfo)); updateInfo(); body.appendChild(info);
    const btn=document.createElement('button'); btn.className='primary templateUse'; btn.textContent='Usar modelo personalizado';
    btn.onclick=()=>{const opts={rows:body.querySelector('.tplRows').value,cols:body.querySelector('.tplCols').value,beadSize:body.querySelector('.tplBead').value,colors:body.querySelector('.tplColors').value};project=templateToProject(t,opts);openProject(project);toast('Modelo carregado: '+t.name)};
    body.appendChild(btn); card.append(preview,body); wrap.appendChild(card);
  });
}

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
  // CSS zoom altera o tamanho de layout sem criar um ancestral transformado.
  // Isso permite que position:sticky das réguas funcione no Chrome/Android.
  stage.style.transform="none";
  stage.style.marginRight="0px";
  stage.style.marginBottom="0px";
  stage.style.zoom=String(zoomLevel);
  viewport.scrollLeft=Math.max(0,contentX*zoomLevel-focusX);
  viewport.scrollTop=Math.max(0,contentY*zoomLevel-focusY);
  const pct=Math.round(zoomLevel*100);
  $("zoomResetBtn").textContent=`${pct}%`;
  if($("zoomLabel")) $("zoomLabel").textContent=`Zoom ${pct}%`;
  requestAnimationFrame(syncGridRulers);
}

function touchDistance(a,b){ return Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY); }



// V5.17 — trava de réguas independente de position:sticky.
// CSS zoom pode quebrar sticky em alguns WebViews/Chrome Android; por isso
// compensamos o scroll do viewport com translate nas réguas.
function syncGridRulers(){
  const viewport=$("gridViewport");
  const col=$("columnRuler");
  const row=$("rowRuler");
  const corner=document.querySelector(".rulerCorner");
  if(!viewport||!col||!row||!corner) return;
  const z=Math.max(.01,zoomLevel||1);
  const x=viewport.scrollLeft/z;
  const y=viewport.scrollTop/z;
  col.style.transform=`translateY(${y}px)`;
  row.style.transform=`translateX(${x}px)`;
  corner.style.transform=`translate(${x}px, ${y}px)`;
}

function setupLockedRulers(){
  const viewport=$("gridViewport");
  if(!viewport||viewport.dataset.rulerLockReady) return;
  viewport.dataset.rulerLockReady="1";
  viewport.addEventListener("scroll",syncGridRulers,{passive:true});
  window.addEventListener("resize",syncGridRulers,{passive:true});
  syncGridRulers();
}
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
  let pointerPan=null;
  viewport.addEventListener("pointerdown",(e)=>{
    if(tool!=="pan" || e.pointerType==="touch") return;
    e.preventDefault();
    pointerPan={x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};
    viewport.setPointerCapture?.(e.pointerId);
  });
  viewport.addEventListener("pointermove",(e)=>{
    if(!pointerPan || tool!=="pan") return;
    viewport.scrollLeft=pointerPan.left-(e.clientX-pointerPan.x);
    viewport.scrollTop=pointerPan.top-(e.clientY-pointerPan.y);
  });
  const endPointerPan=()=>pointerPan=null;
  viewport.addEventListener("pointerup",endPointerPan);
  viewport.addEventListener("pointercancel",endPointerPan);
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
    const el=document.createElement("button"); el.type="button";
    el.className="rulerCell colSelectCell"+(selectedCols.has(c)?" selectedColRuler":"");
    el.textContent=columnLabel(c); el.title=`Selecionar coluna ${columnLabel(c)}`;
    el.dataset.colIndex=String(c);
    el.setAttribute("aria-pressed",selectedCols.has(c)?"true":"false");
    el.onkeydown=(e)=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();toggleColSelection(c)}};
    cols.appendChild(el);
  }
  for(let r=0;r<project.rows;r++){
    const el=document.createElement("button");
    el.type="button";
    el.className="rulerCell rowSelectCell"+(selectedRows.has(r)?" selectedRowRuler":"");
    el.textContent=String(r+1);
    el.title=`Selecionar linha ${r+1}`;
    el.setAttribute("aria-pressed", selectedRows.has(r)?"true":"false");
    el.onclick=(e)=>{e.preventDefault();e.stopPropagation();toggleRowSelection(r)};
    rows.appendChild(el);
  }
  updateRowSelectionBar();
  updateColSelectionBar();
  setupColumnDragSelection();
}
// V5.19 — seleção de múltiplas linhas pela régua + preenchimento estilo Excel.
function toggleRowSelection(r){
  if(!project || r<0 || r>=project.rows) return;
  if(selectedRows.has(r)) selectedRows.delete(r); else selectedRows.add(r);
  renderGrid();
  const n=selectedRows.size;
  toast(n?`${n} linha${n>1?"s":""} selecionada${n>1?"s":""}`:"Seleção de linhas limpa");
}
function clearRowSelection(){
  selectedRows.clear();
  renderGrid();
}
function updateRowSelectionBar(){
  const bar=$("rowSelectionBar"), count=$("rowSelectionCount");
  if(!bar||!count) return;
  const n=selectedRows.size;
  count.textContent=n?`${n} linha${n>1?"s":""}`:"Nenhuma linha";
  bar.classList.toggle("active",n>0);
  const disabled=n===0;
  if($("copyRowsUpBtn")) $("copyRowsUpBtn").disabled=disabled;
  if($("copyRowsDownBtn")) $("copyRowsDownBtn").disabled=disabled;
}
function selectedRowPattern(){
  return [...selectedRows].filter(r=>r>=0&&r<project.rows).sort((a,b)=>a-b).map(r=>project.grid[r].slice());
}
function rowCopyRepeatCount(){
  return Math.max(1,Math.min(99,Number($("rowCopyRepeat")?.value)||1));
}
function buildRepeatedRowBlock(pattern,repeats){
  const block=[];
  for(let k=0;k<repeats;k++) pattern.forEach(row=>block.push(row.slice()));
  return block;
}
function copySelectedRows(direction){
  if(!project||!selectedRows.size) return;
  const indices=[...selectedRows].filter(r=>r>=0&&r<project.rows).sort((a,b)=>a-b);
  if(!indices.length) return;
  const pattern=selectedRowPattern();
  const block=buildRepeatedRowBlock(pattern,rowCopyRepeatCount());
  pushHistory();
  let start;
  if(direction==="down"){
    start=indices[indices.length-1]+1;
    const need=start+block.length-project.rows;
    for(let i=0;i<need;i++) project.grid.push(Array(project.cols).fill(null));
    project.rows=project.grid.length;
    block.forEach((row,i)=>{project.grid[start+i]=row.slice()});
  }else{
    const min=indices[0];
    const missing=Math.max(0,block.length-min);
    for(let i=0;i<missing;i++) project.grid.unshift(Array(project.cols).fill(null));
    project.rows=project.grid.length;
    start=min+missing-block.length;
    block.forEach((row,i)=>{project.grid[start+i]=row.slice()});
  }
  selectedRows=new Set(Array.from({length:block.length},(_,i)=>start+i));
  renderGrid();
  saveCurrent();
  toast(`Linhas copiadas para ${direction==="down"?"baixo":"cima"}`);
}

// V5.21 — colunas com seleção por toque/arraste + edição avançada.
function toggleColSelection(c){
  if(!project||c<0||c>=project.cols)return;
  if(selectedCols.has(c)) selectedCols.delete(c); else selectedCols.add(c);
  renderGrid();
  const n=selectedCols.size;
  toast(n?`${n} coluna${n>1?"s":""} selecionada${n>1?"s":""} — use ← Copiar ou → Copiar`:"Seleção de colunas limpa");
}
function clearColSelection(){selectedCols.clear();renderGrid()}
function updateColSelectionBar(){
  const bar=$("colSelectionBar"),count=$("colSelectionCount"); if(!bar||!count)return;
  const n=selectedCols.size; count.textContent=n?`${n} coluna${n>1?"s":""}`:"Nenhuma coluna"; bar.classList.toggle("active",n>0);
  ["copyColsLeftBtn","copyColsRightBtn","deleteColsBtn"].forEach(id=>{if($(id))$(id).disabled=!n});
}
function colRepeatCount(){return Math.max(1,Math.min(999,Number($("colCopyRepeat")?.value)||1))}
function copySelectedCols(direction){
  if(!project||!selectedCols.size)return; const inds=[...selectedCols].sort((a,b)=>a-b); const reps=colRepeatCount();
  const pattern=inds.map(c=>project.grid.map(row=>row[c])); const block=[]; for(let k=0;k<reps;k++) pattern.forEach(col=>block.push(col.slice()));
  pushHistory(); let start;
  if(direction==="right"){
    start=inds.at(-1)+1; while(project.cols<start+block.length){project.grid.forEach(r=>r.push(null));project.cols++}
  }else{
    const missing=Math.max(0,block.length-inds[0]); for(let k=0;k<missing;k++){project.grid.forEach(r=>r.unshift(null));project.cols++}
    start=inds[0]+missing-block.length;
  }
  block.forEach((col,j)=>col.forEach((v,r)=>project.grid[r][start+j]=v)); selectedCols=new Set(block.map((_,j)=>start+j)); renderGrid();saveCurrent();toast(`Colunas copiadas para ${direction==="right"?"direita":"esquerda"}`)
}
// V5.21 — seleção profissional de colunas por toque e arraste na régua.
function columnIndexFromPoint(clientX,clientY){
  const el=document.elementFromPoint(clientX,clientY)?.closest?.(".colSelectCell");
  if(!el||!$("columnRuler")?.contains(el)) return null;
  const c=Number(el.dataset.colIndex);
  return Number.isInteger(c)?c:null;
}
function setupColumnDragSelection(){
  const ruler=$("columnRuler");
  if(!ruler||ruler.dataset.colDragReady) return;
  ruler.dataset.colDragReady="1";
  ruler.addEventListener("pointerdown",e=>{
    const cell=e.target.closest?.(".colSelectCell");
    if(!cell) return;
    const c=Number(cell.dataset.colIndex);
    if(!Number.isInteger(c)) return;
    e.preventDefault(); e.stopPropagation();
    colDragSelecting=true; colDragVisited=new Set([c]);
    colDragMode=selectedCols.has(c)?"remove":"add";
    if(colDragMode==="add") selectedCols.add(c); else selectedCols.delete(c);
    try{ruler.setPointerCapture(e.pointerId)}catch(_){ }
    renderGrid();
  });
  ruler.addEventListener("pointermove",e=>{
    if(!colDragSelecting) return;
    const c=columnIndexFromPoint(e.clientX,e.clientY);
    if(c===null||colDragVisited.has(c)) return;
    colDragVisited.add(c);
    if(colDragMode==="add") selectedCols.add(c); else selectedCols.delete(c);
    renderGrid();
  });
  const finish=e=>{
    if(!colDragSelecting) return;
    colDragSelecting=false;
    try{ruler.releasePointerCapture(e.pointerId)}catch(_){ }
    const n=selectedCols.size;
    updateColSelectionBar();
    toast(n?`${n} coluna${n>1?"s":""} selecionada${n>1?"s":""} — escolha ← Copiar ou → Copiar`:"Seleção de colunas limpa");
  };
  ruler.addEventListener("pointerup",finish);
  ruler.addEventListener("pointercancel",finish);
}

function insertRow(where){if(!project)return;pushHistory();const inds=[...selectedRows].sort((a,b)=>a-b);let at=inds.length?(where==="above"?inds[0]:inds.at(-1)+1):project.rows;project.grid.splice(at,0,Array(project.cols).fill(null));project.rows++;selectedRows=new Set([at]);renderGrid();saveCurrent()}
function deleteSelectedRows(){if(!selectedRows.size||project.rows-selectedRows.size<1)return;pushHistory();project.grid=project.grid.filter((_,r)=>!selectedRows.has(r));project.rows=project.grid.length;selectedRows.clear();renderGrid();saveCurrent()}
function insertCol(where){if(!project)return;pushHistory();const inds=[...selectedCols].sort((a,b)=>a-b);let at=inds.length?(where==="left"?inds[0]:inds.at(-1)+1):project.cols;project.grid.forEach(r=>r.splice(at,0,null));project.cols++;selectedCols=new Set([at]);renderGrid();saveCurrent()}
function deleteSelectedCols(){if(!selectedCols.size||project.cols-selectedCols.size<1)return;pushHistory();project.grid=project.grid.map(row=>row.filter((_,c)=>!selectedCols.has(c)));project.cols=project.grid[0].length;selectedCols.clear();renderGrid();saveCurrent()}
function clearAreaSelection(){areaSelection=null;areaAnchor=null;renderGrid()}
function normalizeArea(a,b){return {r1:Math.min(a.r,b.r),r2:Math.max(a.r,b.r),c1:Math.min(a.c,b.c),c2:Math.max(a.c,b.c)}}
function selectAreaCell(r,c){if(!areaAnchor){areaAnchor={r,c};areaSelection={r1:r,r2:r,c1:c,c2:c};toast("Agora toque no canto oposto da área")}else{areaSelection=normalizeArea(areaAnchor,{r,c});areaAnchor=null;toast(`Área ${columnLabel(areaSelection.c1)}${areaSelection.r1+1}:${columnLabel(areaSelection.c2)}${areaSelection.r2+1}`)}renderGrid()}
function areaContains(r,c){return areaSelection&&r>=areaSelection.r1&&r<=areaSelection.r2&&c>=areaSelection.c1&&c<=areaSelection.c2}
function areaAction(action){if(!areaSelection)return toast("Selecione uma área primeiro");const a=areaSelection;pushHistory();
 if(action==="erase")for(let r=a.r1;r<=a.r2;r++)for(let c=a.c1;c<=a.c2;c++)project.grid[r][c]=null;
 if(action==="color")for(let r=a.r1;r<=a.r2;r++)for(let c=a.c1;c<=a.c2;c++)if(project.grid[r][c])project.grid[r][c]=selectedColor;
 if(action==="mirrorH")for(let r=a.r1;r<=a.r2;r++){const part=project.grid[r].slice(a.c1,a.c2+1).reverse();part.forEach((v,i)=>project.grid[r][a.c1+i]=v)}
 if(action==="mirrorV"){const rows=project.grid.slice(a.r1,a.r2+1).map(r=>r.slice(a.c1,a.c2+1)).reverse();rows.forEach((row,i)=>row.forEach((v,j)=>project.grid[a.r1+i][a.c1+j]=v))}
 renderGrid();saveCurrent();toast("Área atualizada")}
function centralizeDrawing(){let minR=project.rows,maxR=-1,minC=project.cols,maxC=-1;project.grid.forEach((row,r)=>row.forEach((v,c)=>{if(v){minR=Math.min(minR,r);maxR=Math.max(maxR,r);minC=Math.min(minC,c);maxC=Math.max(maxC,c)}}));if(maxR<0)return;pushHistory();const h=maxR-minR+1,w=maxC-minC+1,nr=Math.floor((project.rows-h)/2),nc=Math.floor((project.cols-w)/2),ng=Array.from({length:project.rows},()=>Array(project.cols).fill(null));for(let r=0;r<h;r++)for(let c=0;c<w;c++)ng[nr+r][nc+c]=project.grid[minR+r][minC+c];project.grid=ng;renderGrid();saveCurrent();toast("Desenho centralizado")}
function autoContour(){if(!project)return;pushHistory();const old=project.grid.map(r=>r.slice()),dirs=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];for(let r=0;r<project.rows;r++)for(let c=0;c<project.cols;c++)if(!old[r][c]&&dirs.some(([dr,dc])=>old[r+dr]?.[c+dc]))project.grid[r][c]=selectedColor;renderGrid();saveCurrent();toast("Contorno automático aplicado")}

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

  // Exporta somente a área realmente usada do desenho.
  // Linhas/colunas totalmente vazias ao redor do modelo não entram no JPG/PDF.
  let minRow=project.rows, maxRow=-1, minCol=project.cols, maxCol=-1;
  for(let r=0;r<project.rows;r++){
    for(let c=0;c<project.cols;c++){
      if(project.grid[r][c]){
        if(r<minRow) minRow=r;
        if(r>maxRow) maxRow=r;
        if(c<minCol) minCol=c;
        if(c>maxCol) maxCol=c;
      }
    }
  }

  // Se o desenho estiver vazio, mantém a grade inteira para não gerar arquivo inválido.
  if(maxRow<0 || maxCol<0){
    minRow=0; minCol=0; maxRow=project.rows-1; maxCol=project.cols-1;
  }

  const exportRows=maxRow-minRow+1;
  const exportCols=maxCol-minCol+1;
  const theme=loadTheme();
  const gridBg=theme.gridBg||"#fffaff";
  const cell=34,ruler=38,pad=24,titleH=58;
  const w=pad*2+ruler+exportCols*cell;
  const h=pad*2+titleH+ruler+exportRows*cell;
  const canvas=document.createElement("canvas");
  canvas.width=Math.max(420,w);
  canvas.height=Math.max(320,h);
  const ctx=canvas.getContext("2d");

  ctx.fillStyle=gridBg;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="#4c1d75";
  ctx.font="bold 22px system-ui";
  ctx.textAlign="left";
  ctx.textBaseline="alphabetic";
  ctx.fillText(project.name||"Projeto JPmiçangas",pad,34);
  ctx.font="13px system-ui";
  ctx.fillText(`${exportRows} linhas × ${exportCols} colunas • ${project.technique||""}`,pad,54);

  const ox=pad+ruler,oy=pad+titleH+ruler;
  ctx.textAlign="center";
  ctx.textBaseline="middle";
  ctx.font="bold 11px system-ui";
  ctx.fillStyle="#5b3a78";
  for(let c=0;c<exportCols;c++) ctx.fillText(columnLabel(c),ox+c*cell+cell/2,oy-ruler/2);
  for(let r=0;r<exportRows;r++) ctx.fillText(String(r+1),ox-ruler/2,oy+r*cell+cell/2);

  function hexToRgb(hex){
    const clean=String(hex||"").replace("#","").trim();
    if(clean.length===3){
      return {r:parseInt(clean[0]+clean[0],16),g:parseInt(clean[1]+clean[1],16),b:parseInt(clean[2]+clean[2],16)};
    }
    if(clean.length===6){
      return {r:parseInt(clean.slice(0,2),16),g:parseInt(clean.slice(2,4),16),b:parseInt(clean.slice(4,6),16)};
    }
    return {r:255,g:250,b:255};
  }
  function mix(rgb,target,amount){
    return `rgb(${Math.round(rgb.r+(target-rgb.r)*amount)},${Math.round(rgb.g+(target-rgb.g)*amount)},${Math.round(rgb.b+(target-rgb.b)*amount)})`;
  }
  function drawBead(x,y,hex,isEmpty){
    const radius=cell*.41;
    const rgb=hexToRgb(hex);
    ctx.save();
    ctx.shadowColor="rgba(0,0,0,.24)";
    ctx.shadowBlur=2;
    ctx.shadowOffsetY=1;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2);
    ctx.fillStyle=hex;
    ctx.fill();
    ctx.restore();

    const grad=ctx.createRadialGradient(x-radius*.34,y-radius*.38,radius*.08,x,y,radius);
    grad.addColorStop(0,mix(rgb,255,.42));
    grad.addColorStop(.34,hex);
    grad.addColorStop(.82,mix(rgb,0,.12));
    grad.addColorStop(1,mix(rgb,0,.34));
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2);
    ctx.fillStyle=grad;
    ctx.fill();

    ctx.lineWidth=1;
    ctx.strokeStyle=isEmpty?"rgba(255,255,255,.22)":"rgba(0,0,0,.20)";
    ctx.stroke();

    const shine=ctx.createRadialGradient(x-radius*.35,y-radius*.42,0,x-radius*.35,y-radius*.42,radius*.52);
    shine.addColorStop(0,"rgba(255,255,255,.42)");
    shine.addColorStop(1,"rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.arc(x,y,radius*.92,0,Math.PI*2);
    ctx.fillStyle=shine;
    ctx.fill();
  }

  for(let er=0;er<exportRows;er++){
    const r=minRow+er;
    for(let ec=0;ec<exportCols;ec++){
      const c=minCol+ec;
      const x=ox+ec*cell+cell/2;
      const y=oy+er*cell+cell/2;
      const id=project.grid[r][c];
      const color=project.palette.find(p=>p.id===id);
      drawBead(x,y,color?.hex||gridBg,!color);
    }
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
  // Limites mais conservadores: evita apagar miçangas claras/escuras reais.
  if(mode==="light") return r>248 && g>248 && b>248;
  if(mode==="dark") return r<10 && g<10 && b<10;
  return false;
}

function borderBackgroundColor(ctx,w,h){
  const data=ctx.getImageData(0,0,w,h).data;
  const samples=[];
  const stride=Math.max(1,Math.floor(Math.min(w,h)/120));
  const add=(x,y)=>{const i=(y*w+x)*4;if(data[i+3]>90)samples.push([data[i],data[i+1],data[i+2]])};
  for(let x=0;x<w;x+=stride){add(x,0);add(x,h-1)}
  for(let y=0;y<h;y+=stride){add(0,y);add(w-1,y)}
  if(!samples.length) return [255,255,255];
  return [0,1,2].map(ch=>{const values=samples.map(s=>s[ch]).sort((a,b)=>a-b);return values[Math.floor(values.length/2)]});
}

function matchesSelectedBackground(r,g,b,mode,borderRgb){
  const borderLight=(borderRgb[0]+borderRgb[1]+borderRgb[2])/3;
  if(mode==="light") return borderLight>220&&isBackgroundPixel(r,g,b,"light");
  if(mode==="dark") return borderLight<35&&isBackgroundPixel(r,g,b,"dark");
  return false;
}

function cellColorFromRegion(ctx, x0, y0, x1, y1, bgMode, faithful=false, backgroundRgb=null){
  const w=Math.max(1,x1-x0), h=Math.max(1,y1-y0);
  const data=ctx.getImageData(x0,y0,w,h).data;

  // Lê principalmente o miolo da célula. Em fotos de miçangas, as bordas costumam
  // conter fundo, fio e espaço entre contas; isso não deve decidir a cor da célula.
  const insetX=Math.floor(w*.16), insetY=Math.floor(h*.16);
  const sx0=Math.min(w-1,insetX), sy0=Math.min(h-1,insetY);
  const sx1=Math.max(sx0+1,w-insetX), sy1=Math.max(sy0+1,h-insetY);
  const step=Math.max(1,Math.floor(Math.sqrt((w*h)/260)));
  const buckets=new Map();
  let validWeight=0,totalWeight=0;

  for(let y=sy0;y<sy1;y+=step){
    for(let x=sx0;x<sx1;x+=step){
      const i=(y*w+x)*4;
      const r=data[i],g=data[i+1],b=data[i+2],a=data[i+3];
      const nx=(x+.5)/w-.5, ny=(y+.5)/h-.5;
      // Peso maior no centro da célula.
      const centerWeight=Math.max(.25,1-Math.sqrt(nx*nx+ny*ny)*1.25);
      totalWeight+=centerWeight;
      if(a<70) continue;
      // O fundo estimado pelas bordas é descartado nos dois modos. Assim o modo
      // fiel preserva a silhueta do brinco em vez de preencher um retângulo.
      const matchesBorder=backgroundRgb && colorDistance([r,g,b],backgroundRgb)<42*42;
      const isBg=matchesSelectedBackground(r,g,b,bgMode,backgroundRgb||[255,255,255])||matchesBorder;
      if(isBg) continue;
      validWeight+=centerWeight;

      // Histograma quantizado: escolhe a família de cor dominante, em vez de uma
      // média que mistura azul+branco, vermelho+preto etc.
      const qr=Math.round(r/24)*24, qg=Math.round(g/24)*24, qb=Math.round(b/24)*24;
      const key=`${qr},${qg},${qb}`;
      const item=buckets.get(key)||{w:0,r:0,g:0,b:0};
      item.w+=centerWeight;
      item.r+=r*centerWeight; item.g+=g*centerWeight; item.b+=b*centerWeight;
      buckets.set(key,item);
    }
  }

  if(!buckets.size) return {coverage:0,rgb:null};

  let best=null;
  for(const item of buckets.values()) if(!best || item.w>best.w) best=item;
  return {
    coverage:validWeight/Math.max(.001,totalWeight),
    rgb:[Math.round(best.r/best.w),Math.round(best.g/best.w),Math.round(best.b/best.w)]
  };
}

function kmeansPalette(samples,maxColors){
  if(!samples.length) return [];
  const uniq=[];
  const seen=new Set();
  for(const s of samples){
    const key=s.rgb.map(v=>Math.round(v/6)*6).join(',');
    if(!seen.has(key)){seen.add(key);uniq.push(s.rgb);}
  }
  const k=Math.max(1,Math.min(maxColors,uniq.length));

  // Inicialização por pontos mais distantes para preservar cores minoritárias.
  const centers=[uniq[0].slice()];
  while(centers.length<k){
    let best=null,bestD=-1;
    for(const rgb of uniq){
      let dmin=Infinity;
      for(const c of centers) dmin=Math.min(dmin,colorDistance(rgb,c));
      if(dmin>bestD){bestD=dmin;best=rgb;}
    }
    centers.push(best.slice());
  }

  for(let iter=0;iter<10;iter++){
    const sums=Array.from({length:k},()=>[0,0,0,0]);
    for(const s of samples){
      let bi=0,bd=Infinity;
      for(let i=0;i<k;i++){
        const d=colorDistance(s.rgb,centers[i]);
        if(d<bd){bd=d;bi=i;}
      }
      const weight=Math.max(.25,s.coverage||1);
      sums[bi][0]+=s.rgb[0]*weight;
      sums[bi][1]+=s.rgb[1]*weight;
      sums[bi][2]+=s.rgb[2]*weight;
      sums[bi][3]+=weight;
    }
    for(let i=0;i<k;i++) if(sums[i][3]) centers[i]=[
      Math.round(sums[i][0]/sums[i][3]),
      Math.round(sums[i][1]/sums[i][3]),
      Math.round(sums[i][2]/sums[i][3])
    ];
  }

  return centers.map((rgb,idx)=>({
    id:`img_${Date.now()}_${idx}`,
    name:`Cor imagem ${idx+1}`,
    code:`IMG${String(idx+1).padStart(2,"0")}`,
    hex:rgbToHex(...rgb),
    rgb
  }));
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

function lockDetectedColorsToRealPalette(imagePalette){
  if(!imagePalette.length)return imagePalette;
  let brightest=imagePalette[0];
  for(const color of imagePalette){
    const rgb=color.rgb||[0,0,0];
    if((rgb[0]+rgb[1]+rgb[2])>(brightest.rgb[0]+brightest.rgb[1]+brightest.rgb[2]))brightest=color;
  }
  imagePalette.forEach(color=>{
    const [r,g,b]=color.rgb;
    const max=Math.max(r,g,b),min=Math.min(r,g,b);
    const saturation=max?((max-min)/max):0;
    let real;
    // A conta branca fotografada costuma ficar cinza por sombra/exposição.
    if(color===brightest&&saturation<.28&&(r+g+b)/3>115){
      real=defaultPalette.find(c=>c.id==="c2");
    }else{
      // Corrige a iluminação procurando a cor comercial mais próxima, mas dá
      // preferência às famílias cromáticas para não trocar vermelho por cinza.
      const candidates=saturation>.22
        ? defaultPalette.filter(c=>{
            const cr=parseInt(c.hex.slice(1,3),16),cg=parseInt(c.hex.slice(3,5),16),cb=parseInt(c.hex.slice(5,7),16);
            return Math.max(cr,cg,cb)-Math.min(cr,cg,cb)>35;
          })
        : defaultPalette;
      real=candidates.reduce((best,c)=>{
        const cr=parseInt(c.hex.slice(1,3),16),cg=parseInt(c.hex.slice(3,5),16),cb=parseInt(c.hex.slice(5,7),16);
        return !best||colorDistance([r,g,b],[cr,cg,cb])<best.distance?{color:c,distance:colorDistance([r,g,b],[cr,cg,cb])}:best;
      },null)?.color;
    }
    if(real){color.name=real.name;color.code=real.code;color.hex=real.hex}
  });
  return imagePalette;
}



// =========================================================
// V5.33 — recorte por 6 pontos + zoom real da fotografia
// =========================================================
function defaultImageQuad(){
  return [{x:.20,y:.04},{x:.80,y:.04},{x:.80,y:.96},{x:.20,y:.96}];
}
function defaultImageSixPoints(){
  // topo E/D, meio D, base D/E, meio E — formato ideal para brincos alongados
  return [{x:.36,y:.03},{x:.64,y:.03},{x:.90,y:.50},{x:.64,y:.97},{x:.36,y:.97},{x:.10,y:.50}];
}
function sixPointsToQuad(){
  const p=imageSixPoints||defaultImageSixPoints();
  // Os quatro extremos dão a perspectiva; os dois pontos centrais definem a silhueta lateral.
  return [{...p[0]},{...p[1]},{...p[3]},{...p[4]}];
}
function setCropFromSixPoints(){
  imageCropPoints=(imageSixPoints||defaultImageSixPoints()).map(p=>({...p}));
  imageQuad=sixPointsToQuad();
  imageQuadAdjusted=true;
}
function resetFreeCrop(){
  imageCropPoints=[]; imageCropHistory=[]; imageCropDrawing=false; imageCropActive=false;
  imageCropMode="free"; imageSixPoints=defaultImageSixPoints(); imageQuad=sixPointsToQuad(); imageQuadAdjusted=false; imagePointDrag=-1; imagePreviewZoom=1; geometryPreviewState=null; hideImagePointMagnifier();
  const stage=$("imageCropStage"),canvas=$("imageCropCanvas"),btn=$("freeCropBtn"),guide=$("cropGuideText");
  stage?.classList.remove("cropActive","sixPointActive"); btn?.classList.remove("activeTool"); $("sixPointCropBtn")?.classList.remove("activeTool");
  if(stage){stage.style.width="100%";stage.style.minWidth="100%"}
  if(canvas){const ctx=canvas.getContext("2d");ctx.clearRect(0,0,canvas.width,canvas.height)}
  if($("undoCropBtn")) $("undoCropBtn").disabled=true;
  if($("clearCropBtn")) $("clearCropBtn").disabled=true;
  updateImageZoomLabel();
  if(guide){guide.classList.remove("ready");guide.textContent="Ajuste os 6 pontos da geometria ou contorne somente a peça. Depois confira a Prévia da geometria."}
}

function setCropMode(mode){
  imageCropMode=mode;
  imageCropActive=mode==="free";
  const stage=$("imageCropStage");
  stage?.classList.toggle("cropActive",mode==="free");
  stage?.classList.toggle("sixPointActive",mode==="six");
  imagePanMode=false;
  stage?.classList.remove("panActive");
  $("freeCropBtn")?.classList.toggle("activeTool",mode==="free");
  $("sixPointCropBtn")?.classList.toggle("activeTool",mode==="six");
  $("imagePanBtn")?.classList.remove("activeTool");
  if(mode==="six"){setCropFromSixPoints();$("clearCropBtn").disabled=false}
  drawFreeCrop();
}

function updateImageZoomLabel(){if($("imageZoomLabel")) $("imageZoomLabel").textContent=Math.round(imagePreviewZoom*100)+"%"}
function applyImagePreviewZoom(next,focusX=null,focusY=null){
  const wrap=$("imagePreviewWrap"),stage=$("imageCropStage");if(!wrap||!stage)return;
  const old=Math.max(.01,imagePreviewZoom);
  const nextZoom=Math.max(IMAGE_PREVIEW_ZOOM_MIN,Math.min(IMAGE_PREVIEW_ZOOM_MAX,next));
  const viewRect=wrap.getBoundingClientRect();
  const fx=focusX==null?wrap.clientWidth/2:Math.max(0,Math.min(wrap.clientWidth,focusX-viewRect.left));
  const fy=focusY==null?wrap.clientHeight/2:Math.max(0,Math.min(wrap.clientHeight,focusY-viewRect.top));
  const contentX=(wrap.scrollLeft+fx)/old, contentY=(wrap.scrollTop+fy)/old;
  imagePreviewZoom=nextZoom;
  const base=Math.max(1,wrap.clientWidth-16);
  stage.style.width=Math.round(base*imagePreviewZoom)+"px";
  stage.style.minWidth=stage.style.width;
  updateImageZoomLabel();
  requestAnimationFrame(()=>{syncCropCanvasSize();wrap.scrollLeft=Math.max(0,contentX*imagePreviewZoom-fx);wrap.scrollTop=Math.max(0,contentY*imagePreviewZoom-fy)});
}


function setImagePanMode(){
  if(!uploadedImage){toast("Escolha uma imagem primeiro");return}
  imagePanMode=true; imageCropActive=false; imagePointDrag=-1;
  const stage=$("imageCropStage");
  stage?.classList.remove("cropActive","sixPointActive");
  stage?.classList.add("panActive");
  $("freeCropBtn")?.classList.remove("activeTool");
  $("sixPointCropBtn")?.classList.remove("activeTool");
  $("imagePanBtn")?.classList.add("activeTool");
  toast("Arrastar imagem: deslize com um dedo para mover a foto");
}

function setupImagePreviewPan(){
  const wrap=$("imagePreviewWrap"); if(!wrap||wrap.dataset.panReady)return; wrap.dataset.panReady="1";
  let active=false,startX=0,startY=0,startLeft=0,startTop=0;
  wrap.addEventListener("pointerdown",e=>{
    if(!imagePanMode||e.pointerType==="touch"&&e.isPrimary===false)return;
    active=true; startX=e.clientX; startY=e.clientY; startLeft=wrap.scrollLeft; startTop=wrap.scrollTop;
    try{wrap.setPointerCapture(e.pointerId)}catch(_){}; e.preventDefault();
  });
  wrap.addEventListener("pointermove",e=>{
    if(!active||!imagePanMode)return;
    wrap.scrollLeft=startLeft-(e.clientX-startX); wrap.scrollTop=startTop-(e.clientY-startY); e.preventDefault();
  });
  const end=e=>{if(!active)return;active=false;try{wrap.releasePointerCapture(e.pointerId)}catch(_){}};
  wrap.addEventListener("pointerup",end); wrap.addEventListener("pointercancel",end);
}

function setupImagePreviewPinchZoom(){
  const wrap=$("imagePreviewWrap");if(!wrap||wrap.dataset.pinchReady)return;wrap.dataset.pinchReady="1";
  let startDist=0,startZoom=1,midX=0,midY=0;
  wrap.addEventListener("touchstart",e=>{if(e.touches.length!==2)return;const a=e.touches[0],b=e.touches[1];startDist=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);startZoom=imagePreviewZoom;midX=(a.clientX+b.clientX)/2;midY=(a.clientY+b.clientY)/2},{passive:true});
  wrap.addEventListener("touchmove",e=>{if(e.touches.length!==2||!startDist)return;e.preventDefault();const a=e.touches[0],b=e.touches[1];const d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);applyImagePreviewZoom(startZoom*(d/startDist),midX,midY)},{passive:false});
  wrap.addEventListener("touchend",e=>{if(e.touches.length<2)startDist=0},{passive:true});
}

function syncCropCanvasSize(){
  const img=$("imagePreview"),canvas=$("imageCropCanvas"); if(!img||!canvas)return;
  const rect=img.getBoundingClientRect();
  const w=Math.max(1,Math.round(rect.width)),h=Math.max(1,Math.round(rect.height));
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
  drawFreeCrop();
}

function drawSixPointHandles(ctx,canvas){
  const q=imageSixPoints||defaultImageSixPoints();
  ctx.save();ctx.lineWidth=2.5;ctx.strokeStyle="#f59e0b";ctx.fillStyle="rgba(245,158,11,.12)";
  ctx.beginPath();ctx.moveTo(q[0].x*canvas.width,q[0].y*canvas.height);for(let i=1;i<6;i++)ctx.lineTo(q[i].x*canvas.width,q[i].y*canvas.height);ctx.closePath();ctx.fill();ctx.stroke();
  q.forEach((p,i)=>{ctx.beginPath();ctx.arc(p.x*canvas.width,p.y*canvas.height,12,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();ctx.lineWidth=4;ctx.strokeStyle="#f59e0b";ctx.stroke();ctx.fillStyle="#6b3b00";ctx.font="bold 12px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(String(i+1),p.x*canvas.width,p.y*canvas.height)});
  ctx.restore();
}

function drawFreeCrop(){
  const canvas=$("imageCropCanvas"); if(!canvas)return; const ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(imageCropPoints.length>=2){
    ctx.save();ctx.lineWidth=3;ctx.lineJoin="round";ctx.lineCap="round";ctx.strokeStyle="#8b5cf6";ctx.fillStyle="rgba(139,92,246,.16)";
    ctx.beginPath();ctx.moveTo(imageCropPoints[0].x*canvas.width,imageCropPoints[0].y*canvas.height);
    imageCropPoints.slice(1).forEach(p=>ctx.lineTo(p.x*canvas.width,p.y*canvas.height));
    if(!imageCropDrawing&&imageCropPoints.length>2){ctx.closePath();ctx.fill()}ctx.stroke();ctx.restore();
  }
  if(imageCropMode==="six")drawSixPointHandles(ctx,canvas);
}

function cropPointFromEvent(e){
  const canvas=$("imageCropCanvas"),rect=canvas.getBoundingClientRect();
  return {x:Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width)),y:Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height))};
}
function nearestSixPoint(p){
  const q=imageSixPoints||defaultImageSixPoints();let best=-1,d=.10/Math.max(1,Math.sqrt(imagePreviewZoom));
  q.forEach((c,i)=>{const n=Math.hypot(c.x-p.x,c.y-p.y);if(n<d){d=n;best=i}});return best;
}
function rotateSixPoints(degrees){
  if(!imageSixPoints)imageSixPoints=defaultImageSixPoints();const a=degrees*Math.PI/180;
  const cx=imageSixPoints.reduce((n,p)=>n+p.x,0)/6,cy=imageSixPoints.reduce((n,p)=>n+p.y,0)/6;
  imageSixPoints=imageSixPoints.map(p=>{const x=p.x-cx,y=p.y-cy;return{x:Math.max(0,Math.min(1,cx+x*Math.cos(a)-y*Math.sin(a))),y:Math.max(0,Math.min(1,cy+x*Math.sin(a)+y*Math.cos(a)))}});
  setCropFromSixPoints();drawFreeCrop();
}
function autoStraightenSixPoints(){
  if(!imageSixPoints)imageSixPoints=defaultImageSixPoints();
  const top=Math.atan2(imageSixPoints[1].y-imageSixPoints[0].y,imageSixPoints[1].x-imageSixPoints[0].x)*180/Math.PI;
  rotateSixPoints(-top);toast("Inclinação superior corrigida");
}

function finishFreeCrop(){
  imageCropDrawing=false;
  if(imageCropPoints.length<3){imageCropPoints=[];drawFreeCrop();return}
  const reduced=[imageCropPoints[0]];
  for(const p of imageCropPoints.slice(1)){const q=reduced.at(-1);if(Math.hypot(p.x-q.x,p.y-q.y)>.006)reduced.push(p)}
  imageCropPoints=reduced;imageQuadAdjusted=false;drawFreeCrop();
  if($("undoCropBtn")) $("undoCropBtn").disabled=false;
  if($("clearCropBtn")) $("clearCropBtn").disabled=false;
  const guide=$("cropGuideText");if(guide){guide.classList.add("ready");guide.textContent="Recorte definido. Confira a Prévia da geometria."}
  toast("Recorte livre definido");
}


function showImagePointMagnifier(point){
  const box=$("imagePointMagnifier"),canvas=$("imagePointMagnifierCanvas"),img=$("imagePreview");
  if(!box||!canvas||!img||!point)return;
  const size=150;canvas.width=size;canvas.height=size;
  const ctx=canvas.getContext("2d");ctx.clearRect(0,0,size,size);
  const sw=Math.max(24,img.naturalWidth*.12/imagePreviewZoom),sh=Math.max(24,img.naturalHeight*.12/imagePreviewZoom);
  const sx=Math.max(0,Math.min(img.naturalWidth-sw,point.x*img.naturalWidth-sw/2));
  const sy=Math.max(0,Math.min(img.naturalHeight-sh,point.y*img.naturalHeight-sh/2));
  ctx.imageSmoothingEnabled=true;ctx.drawImage(img,sx,sy,sw,sh,0,0,size,size);
  ctx.save();
  ctx.strokeStyle="#f59e0b";ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(size/2,8);ctx.lineTo(size/2,size-8);ctx.moveTo(8,size/2);ctx.lineTo(size-8,size/2);ctx.stroke();
  ctx.strokeStyle="rgba(139,92,246,.95)";ctx.setLineDash([5,4]);ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(size/2,size/2,34,0,Math.PI*2);ctx.stroke();
  ctx.restore();
  box.classList.remove("hidden");imageMagnifierVisible=true;
}
function hideImagePointMagnifier(){
  $("imagePointMagnifier")?.classList.add("hidden");imageMagnifierVisible=false;
}

function setupFreeCrop(){
  const canvas=$("imageCropCanvas"); if(!canvas||canvas.dataset.ready)return; canvas.dataset.ready="1";
  const begin=e=>{
    const p=cropPointFromEvent(e);
    if(imageCropMode==="six"){const i=nearestSixPoint(p);if(i<0)return;e.preventDefault();imagePointDrag=i;showImagePointMagnifier(p);try{canvas.setPointerCapture(e.pointerId)}catch(_){};return}
    if(!imageCropActive)return;e.preventDefault();syncCropCanvasSize();imageCropHistory.push(imageCropPoints.slice());imageCropPoints=[p];imageCropDrawing=true;try{canvas.setPointerCapture(e.pointerId)}catch(_){}
  };
  const move=e=>{
    const p=cropPointFromEvent(e);
    if(imageCropMode==="six"&&imagePointDrag>=0){e.preventDefault();imageSixPoints[imagePointDrag]=p;setCropFromSixPoints();drawFreeCrop();showImagePointMagnifier(p);return}
    if(!imageCropActive||!imageCropDrawing)return;e.preventDefault();imageCropPoints.push(p);drawFreeCrop()
  };
  const end=e=>{
    if(imageCropMode==="six"&&imagePointDrag>=0){imagePointDrag=-1;hideImagePointMagnifier();try{canvas.releasePointerCapture(e.pointerId)}catch(_){};drawFreeCrop();return}
    if(!imageCropDrawing)return;e.preventDefault();try{canvas.releasePointerCapture(e.pointerId)}catch(_){}finishFreeCrop()
  };
  canvas.addEventListener("pointerdown",begin);canvas.addEventListener("pointermove",move);canvas.addEventListener("pointerup",end);canvas.addEventListener("pointercancel",end);
}

function manualCropBounds(canvasW,canvasH){
  if(imageCropPoints.length<3)return null;
  const xs=imageCropPoints.map(p=>p.x*canvasW),ys=imageCropPoints.map(p=>p.y*canvasH);
  const minX=Math.max(0,Math.floor(Math.min(...xs))),maxX=Math.min(canvasW-1,Math.ceil(Math.max(...xs)));
  const minY=Math.max(0,Math.floor(Math.min(...ys))),maxY=Math.min(canvasH-1,Math.ceil(Math.max(...ys)));
  return {x:minX,y:minY,w:Math.max(1,maxX-minX+1),h:Math.max(1,maxY-minY+1)};
}

function applyManualCropMask(ctx,w,h){
  if(imageCropPoints.length<3)return false;
  ctx.save();ctx.globalCompositeOperation="destination-in";ctx.beginPath();ctx.moveTo(imageCropPoints[0].x*w,imageCropPoints[0].y*h);imageCropPoints.slice(1).forEach(p=>ctx.lineTo(p.x*w,p.y*h));ctx.closePath();ctx.fillStyle="#000";ctx.fill();ctx.restore();return true;
}

function alphaBounds(ctx,w,h){
  const d=ctx.getImageData(0,0,w,h).data;let minX=w,minY=h,maxX=-1,maxY=-1;
  for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){if(d[(y*w+x)*4+3]>30){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y}}
  return maxX<0?null:{x:minX,y:minY,w:Math.max(1,maxX-minX+1),h:Math.max(1,maxY-minY+1)};
}

function affineFromTriangles(s0,s1,s2,d0,d1,d2){
  const den=s0.x*(s1.y-s2.y)+s1.x*(s2.y-s0.y)+s2.x*(s0.y-s1.y);if(Math.abs(den)<1e-6)return null;
  const solve=(v0,v1,v2)=>({
    a:(v0*(s1.y-s2.y)+v1*(s2.y-s0.y)+v2*(s0.y-s1.y))/den,
    b:(v0*(s2.x-s1.x)+v1*(s0.x-s2.x)+v2*(s1.x-s0.x))/den,
    c:(v0*(s1.x*s2.y-s2.x*s1.y)+v1*(s2.x*s0.y-s0.x*s2.y)+v2*(s0.x*s1.y-s1.x*s0.y))/den
  });
  const X=solve(d0.x,d1.x,d2.x),Y=solve(d0.y,d1.y,d2.y);return {a:X.a,b:Y.a,c:X.b,d:Y.b,e:X.c,f:Y.c};
}
function drawWarpTriangle(ctx,img,s,d){
  const m=affineFromTriangles(s[0],s[1],s[2],d[0],d[1],d[2]);if(!m)return;
  ctx.save();ctx.beginPath();ctx.moveTo(d[0].x,d[0].y);ctx.lineTo(d[1].x,d[1].y);ctx.lineTo(d[2].x,d[2].y);ctx.closePath();ctx.clip();ctx.setTransform(m.a,m.b,m.c,m.d,m.e,m.f);ctx.drawImage(img,0,0);ctx.restore();
}
function renderAdjustedImageToCanvas(canvas,maxSide=2400){
  const srcScale=Math.min(1,maxSide/Math.max(uploadedImage.naturalWidth,uploadedImage.naturalHeight));
  const sw=Math.max(1,Math.round(uploadedImage.naturalWidth*srcScale)),sh=Math.max(1,Math.round(uploadedImage.naturalHeight*srcScale));
  const src=document.createElement("canvas");src.width=sw;src.height=sh;const sx=src.getContext("2d",{willReadFrequently:true});sx.imageSmoothingEnabled=true;sx.imageSmoothingQuality="high";sx.drawImage(uploadedImage,0,0,sw,sh);applyManualCropMask(sx,sw,sh);
  const q=(imageQuad||defaultImageQuad()).map(p=>({x:p.x*sw,y:p.y*sh}));
  const top=Math.hypot(q[1].x-q[0].x,q[1].y-q[0].y),bottom=Math.hypot(q[2].x-q[3].x,q[2].y-q[3].y),left=Math.hypot(q[3].x-q[0].x,q[3].y-q[0].y),right=Math.hypot(q[2].x-q[1].x,q[2].y-q[1].y);
  let dw=Math.max(64,Math.round((top+bottom)/2)),dh=Math.max(64,Math.round((left+right)/2));const outScale=Math.min(1,maxSide/Math.max(dw,dh));dw=Math.max(1,Math.round(dw*outScale));dh=Math.max(1,Math.round(dh*outScale));
  canvas.width=dw;canvas.height=dh;const ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.clearRect(0,0,dw,dh);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
  const d=[{x:0,y:0},{x:dw,y:0},{x:dw,y:dh},{x:0,y:dh}];drawWarpTriangle(ctx,src,[q[0],q[1],q[2]],[d[0],d[1],d[2]]);drawWarpTriangle(ctx,src,[q[0],q[2],q[3]],[d[0],d[2],d[3]]);return ctx;
}

function cropTransparentBounds(ctx,w,h,bgMode){
  const data=ctx.getImageData(0,0,w,h).data;
  const border=borderBackgroundColor(ctx,w,h);
  const adaptiveLimit=bgMode==="none" ? 46*46 : 40*40;
  let minX=w,minY=h,maxX=-1,maxY=-1;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const i=(y*w+x)*4;
      const r=data[i],g=data[i+1],b=data[i+2],a=data[i+3];
      const differsFromBorder=colorDistance([r,g,b],border)>adaptiveLimit;
      if(a>90 && !matchesSelectedBackground(r,g,b,bgMode,border) && differsFromBorder){
        if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;
      }
    }
  }
  if(maxX<0) return {x:0,y:0,w,h};
  const pad=Math.max(2,Math.round(Math.max(maxX-minX,maxY-minY)*.025));
  minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);
  maxX=Math.min(w-1,maxX+pad);maxY=Math.min(h-1,maxY+pad);
  return {x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
}

function fitCropToGrid(crop,canvasW,canvasH,cols,rows){
  const targetAspect=cols/rows;
  let width=crop.w,height=crop.h;
  if(width/height<targetAspect) width=height*targetAspect;
  else height=width/targetAspect;
  if(width>canvasW){width=canvasW;height=width/targetAspect}
  if(height>canvasH){height=canvasH;width=height*targetAspect}
  const centerX=crop.x+crop.w/2,centerY=crop.y+crop.h/2;
  const x=Math.max(0,Math.min(canvasW-width,centerX-width/2));
  const y=Math.max(0,Math.min(canvasH-height,centerY-height/2));
  const ix=Math.max(0,Math.floor(x)),iy=Math.max(0,Math.floor(y));
  return {x:ix,y:iy,w:Math.max(1,Math.min(canvasW-ix,Math.floor(width))),h:Math.max(1,Math.min(canvasH-iy,Math.floor(height)))};
}

function isRedBead(r,g,b){
  return r>85 && r>g*1.30 && r>b*1.22 && r-g>28;
}

function redBeadBounds(ctx,w,h){
  const data=ctx.getImageData(0,0,w,h).data;
  const rowCounts=new Uint32Array(h),colCounts=new Uint32Array(w);
  for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){
    const i=(y*w+x)*4;if(data[i+3]>30&&isRedBead(data[i],data[i+1],data[i+2])){rowCounts[y]++;colCounts[x]++}
  }
  const rowMin=Math.max(2,Math.floor(w*.006)),colMin=Math.max(2,Math.floor(h*.006));
  let top=rowCounts.findIndex(n=>n>=rowMin),bottom=-1,left=colCounts.findIndex(n=>n>=colMin),right=-1;
  for(let y=h-1;y>=0;y--)if(rowCounts[y]>=rowMin){bottom=y;break}
  for(let x=w-1;x>=0;x--)if(colCounts[x]>=colMin){right=x;break}
  if(top<0||left<0||bottom<=top||right<=left)return null;
  const padX=Math.round((right-left)*.07),padY=Math.round((bottom-top)*.035);
  left=Math.max(0,left-padX);right=Math.min(w-1,right+padX);top=Math.max(0,top-padY);bottom=Math.min(h-1,bottom+padY);
  return {x:left,y:top,w:right-left+1,h:bottom-top+1};
}

function convertGeometricTwoColorBeads(ctx,crop,cols,rows){
  const pixels=ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height).data;
  const W=ctx.canvas.width,H=ctx.canvas.height;
  const grid=Array.from({length:rows},()=>Array(cols).fill(null));
  const confidence=Array.from({length:rows},()=>Array(cols).fill(0));
  const rx=Math.max(2,crop.w/cols*.34), ry=Math.max(2,crop.h/rows*.34);
  const step=Math.max(1,Math.floor(Math.min(rx,ry)/4));

  // Cada célula é validada principalmente pelo miolo arredondado da conta.
  // As bordas/cantos (onde aparecem os "X" entre quatro contas) pesam contra
  // falsos positivos de fios, fundo e fechamentos.
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){
    const cx=crop.x+(x+.5)*crop.w/cols, cy=crop.y+(y+.5)*crop.h/rows;
    let red=0,white=0,center=0,edgeInk=0,edgeTotal=0;
    for(let dy=-ry;dy<=ry;dy+=step) for(let dx=-rx;dx<=rx;dx+=step){
      const nx=dx/rx,ny=dy/ry,d2=nx*nx+ny*ny;if(d2>1)continue;
      const px=Math.round(cx+dx),py=Math.round(cy+dy);if(px<0||px>=W||py<0||py>=H)continue;
      const i=(py*W+px)*4,a=pixels[i+3];if(a<40)continue;
      const r=pixels[i],g=pixels[i+1],b=pixels[i+2];
      if(d2<=.62){center++; if(isRedBead(r,g,b))red++; if(Math.min(r,g,b)>145&&Math.max(r,g,b)-Math.min(r,g,b)<62)white++;}
      else {edgeTotal++; if(isRedBead(r,g,b)||Math.min(r,g,b)>145)edgeInk++;}
    }
    if(center<4)continue;
    const rr=red/center,wr=white/center,roundness=edgeTotal?edgeInk/edgeTotal:0;
    // O centro deve conter uma cor de conta; a faixa externa pode conter os
    // pequenos vazios/cruzamentos que separam uma miçanga da outra.
    if(rr>=.16){grid[y][x]='capture_red';confidence[y][x]=rr*(1.15-.25*roundness)}
    else if(wr>=.30){grid[y][x]='capture_white';confidence[y][x]=wr*(1.15-.25*roundness)}
  }

  // Regularização geométrica: pontos isolados sem vizinhos no passo esperado
  // são descartados; lacunas fortes entre vizinhos alinhados são recuperadas.
  const out=grid.map(r=>r.slice());
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){
    const n=[[y-1,x],[y+1,x],[y,x-1],[y,x+1]].filter(([a,b])=>a>=0&&a<rows&&b>=0&&b<cols).map(([a,b])=>grid[a][b]).filter(Boolean);
    if(grid[y][x] && !n.length && confidence[y][x]<.42) out[y][x]=null;
    if(!grid[y][x]){
      const lr=x>0&&x<cols-1&&grid[y][x-1]&&grid[y][x+1];
      const ud=y>0&&y<rows-1&&grid[y-1][x]&&grid[y+1][x];
      if(lr||ud){
        const ids=[lr&&grid[y][x-1],lr&&grid[y][x+1],ud&&grid[y-1][x],ud&&grid[y+1][x]].filter(Boolean);
        if(ids.length>=2 && ids.every(v=>v===ids[0])) out[y][x]=ids[0];
      }
    }
  }
  return {grid:out,palette:[
    {id:'capture_white',name:'Branco',code:'002',hex:'#ffffff'},
    {id:'capture_red',name:'Vermelho',code:'003',hex:'#d8342a'}
  ]};
}

function convertTwoColorBeads(ctx,crop,cols,rows){
  const pixels=ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height).data;
  const width=ctx.canvas.width;
  const red=Array.from({length:rows},()=>Array(cols).fill(false));
  const light=Array.from({length:rows},()=>Array(cols).fill(false));
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
    const x0=Math.floor(crop.x+x*crop.w/cols),x1=Math.ceil(crop.x+(x+1)*crop.w/cols);
    const y0=Math.floor(crop.y+y*crop.h/rows),y1=Math.ceil(crop.y+(y+1)*crop.h/rows);
    let redCount=0,lightCount=0,total=0;
    const step=Math.max(1,Math.floor(Math.min(x1-x0,y1-y0)/7));
    for(let py=y0;py<y1;py+=step)for(let px=x0;px<x1;px+=step){
      if(px<0||px>=width||py<0||py>=ctx.canvas.height)continue;
      const i=(py*width+px)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];
      if(isRedBead(r,g,b))redCount++;
      if(Math.min(r,g,b)>142&&Math.max(r,g,b)-Math.min(r,g,b)<65)lightCount++;
      total++;
    }
    red[y][x]=redCount>=Math.max(2,total*.11);
    light[y][x]=lightCount>=Math.max(2,total*.28);
  }
  // A silhueta é construída por fileira, seguindo a largura da área tecida.
  // Fios finos e textura isolada fora da peça não criam contas.
  const spans=red.map((row,y)=>{
    const indices=row.flatMap((on,x)=>on?[x]:[]);
    if(!indices.length)return null;
    const margin=Math.max(2,Math.ceil(cols*.10));
    return [Math.max(0,indices[0]-margin),Math.min(cols-1,indices.at(-1)+margin)];
  });
  for(let y=0;y<rows;y++)if(!spans[y]){
    for(let d=1;d<Math.ceil(rows*.12);d++){
      if(spans[y-d]){spans[y]=spans[y-d].slice();break}
      if(spans[y+d]){spans[y]=spans[y+d].slice();break}
    }
  }
  const grid=Array.from({length:rows},(_,y)=>Array.from({length:cols},(_,x)=>{
    const span=spans[y];if(!span||x<span[0]||x>span[1])return null;
    if(red[y][x])return "capture_red";
    return light[y][x]?"capture_white":null;
  }));
  return {grid,palette:[
    {id:"capture_white",name:"Branco",code:"002",hex:"#ffffff"},
    {id:"capture_red",name:"Vermelho",code:"003",hex:"#d8342a"}
  ]};
}

function buildCleanCaptureMask(cells,threshold){
  const rows=cells.length,cols=cells[0]?.length||0;
  const original=cells.map(row=>row.map(info=>!!info.rgb&&info.coverage>=threshold));
  const mask=original.map(row=>row.slice());
  // Remove pontos isolados, geralmente textura do tecido ou reflexos.
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++) if(mask[y][x]){
    let neighbors=0;
    for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){
      if(!dx&&!dy)continue;
      if(original[y+dy]?.[x+dx])neighbors++;
    }
    if(neighbors<2) mask[y][x]=false;
  }
  return mask;
}

function paletteLuminance(color){
  const hex=color.hex||"#000000";
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return .2126*r+.7152*g+.0722*b;
}

function rebuildRepeatingPattern(grid,palette,period,axis="both"){
  const rows=grid.length,cols=grid[0]?.length||0;
  if(rows<3||!cols||!palette.length) return grid;
  const white=[...palette].sort((a,b)=>paletteLuminance(b)-paletteLuminance(a))[0].id;
  const yStart=Math.max(1,Math.floor(rows*.20)),yEnd=Math.min(rows-1,Math.ceil(rows*.80));
  const xStart=Math.max(1,Math.floor(cols*.15)),xEnd=Math.min(cols-1,Math.ceil(cols*.85));
  const tileCols=axis==="rows"?cols:period;
  const tileRows=axis==="cols"?rows:period;
  const template=Array.from({length:tileRows},()=>Array(tileCols).fill(white));
  const scanYStart=axis==="cols"?1:yStart,scanYEnd=axis==="cols"?rows-1:yEnd;
  const scanXStart=axis==="rows"?1:xStart,scanXEnd=axis==="rows"?cols-1:xEnd;

  for(let ty=0;ty<tileRows;ty++) for(let tx=0;tx<tileCols;tx++){
    const counts=new Map();
    for(let y=scanYStart;y<scanYEnd;y++) for(let x=scanXStart;x<scanXEnd;x++){
      const matchesY=axis==="cols"?y===ty:(y-1)%period===ty;
      const matchesX=axis==="rows"?x===tx:(x-1)%period===tx;
      if(!matchesY||!matchesX)continue;
      const id=grid[y][x];if(id)counts.set(id,(counts.get(id)||0)+1);
    }
    let best=white,bestCount=-1;
    counts.forEach((count,id)=>{if(count>bestCount){best=id;bestCount=count}});
    template[ty][tx]=best;
  }

  const rebuilt=Array.from({length:rows},(_,y)=>Array.from({length:cols},(_,x)=>{
    if(y===0||y===rows-1||x===0||x===cols-1)return white;
    const ty=axis==="cols"?y:(y-1)%period;
    const tx=axis==="rows"?x:(x-1)%period;
    return template[ty]?.[tx]||white;
  }));
  return rebuilt;
}

function captureSetupForPreview(){
  if(imageCropPoints.length<3){
    toast("Defina primeiro a área da peça com o Recorte livre");
    return null;
  }
  const cols=Math.max(2,Math.min(100,Number($("imageColsInput").value)||20));
  const rowsChoice=$("imageRowsInput")?.value||"auto";
  const work=document.createElement("canvas");const ctx=renderAdjustedImageToCanvas(work,2000);
  const objectCrop=alphaBounds(ctx,work.width,work.height);
  if(!objectCrop){toast("Não consegui ler a área selecionada");return null}
  const aspect=objectCrop.h/objectCrop.w;
  const rows=rowsChoice==="auto"?Math.max(2,Math.min(100,Math.round(cols*aspect))):Math.max(2,Math.min(100,Number(rowsChoice)||Math.round(cols*aspect)));
  const crop=fitCropToGrid(objectCrop,work.width,work.height,cols,rows);
  return {work,ctx,crop,cols,rows};
}

function geometryPaletteById(id){
  return geometryPreviewState?.palette?.find(c=>c.id===id)||null;
}
function renderGeometryPreview(){
  const s=geometryPreviewState;if(!s)return;
  const {work,crop,cols,rows,grid,palette,scale}=s;
  const canvas=$("geometryPreviewCanvas"),out=canvas.getContext("2d");
  canvas.width=Math.max(1,Math.round(work.width*scale));canvas.height=Math.max(1,Math.round(work.height*scale));
  out.clearRect(0,0,canvas.width,canvas.height);out.drawImage(work,0,0,canvas.width,canvas.height);
  out.save();out.scale(scale,scale);
  out.lineWidth=Math.max(1,2/scale);out.strokeStyle="rgba(139,92,246,.58)";
  for(let x=0;x<=cols;x++){const px=crop.x+x*crop.w/cols;out.beginPath();out.moveTo(px,crop.y);out.lineTo(px,crop.y+crop.h);out.stroke()}
  for(let y=0;y<=rows;y++){const py=crop.y+y*crop.h/rows;out.beginPath();out.moveTo(crop.x,py);out.lineTo(crop.x+crop.w,py);out.stroke()}
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
    const id=grid[y][x];if(!id)continue;const col=palette.find(c=>c.id===id);if(!col)continue;
    const cx=crop.x+(x+.5)*crop.w/cols,cy=crop.y+(y+.5)*crop.h/rows,r=Math.max(2,Math.min(crop.w/cols,crop.h/rows)*.34);
    out.beginPath();out.arc(cx,cy,r,0,Math.PI*2);out.fillStyle=col.hex;out.fill();
    out.strokeStyle="rgba(30,20,40,.45)";out.lineWidth=Math.max(1,1.4/scale);out.stroke();
  }
  out.restore();
  $("geometryPreviewInfo").textContent=`Prévia ${cols} × ${rows}: toque nas células para corrigir falhas antes de gerar.`;
  renderGeometryPreviewPalette();
}
function renderGeometryPreviewPalette(){
  const holder=$("geometryPreviewPalette");if(!holder||!geometryPreviewState)return;holder.innerHTML="";
  for(const c of geometryPreviewState.palette){
    const b=document.createElement("button");b.type="button";b.className="geometryColorBtn"+(geometryPreviewTool==="paint"&&geometryPreviewColorId===c.id?" activeTool":"");
    b.title=c.name;b.innerHTML=`<span style="background:${c.hex}"></span><small>${c.name}</small>`;
    b.onclick=()=>{geometryPreviewTool="paint";geometryPreviewColorId=c.id;renderGeometryPreviewPalette()};
    holder.appendChild(b);
  }
  const erase=document.createElement("button");erase.type="button";erase.className="geometryColorBtn"+(geometryPreviewTool==="erase"?" activeTool":"");
  erase.innerHTML="<span class='eraseDot'>×</span><small>Apagar</small>";erase.onclick=()=>{geometryPreviewTool="erase";renderGeometryPreviewPalette()};holder.appendChild(erase);
}
function geometryCellFromEvent(e){
  const s=geometryPreviewState,canvas=$("geometryPreviewCanvas");if(!s||!canvas)return null;
  const rect=canvas.getBoundingClientRect();
  const px=(e.clientX-rect.left)*(canvas.width/rect.width)/s.scale;
  const py=(e.clientY-rect.top)*(canvas.height/rect.height)/s.scale;
  const x=Math.floor((px-s.crop.x)/s.crop.w*s.cols),y=Math.floor((py-s.crop.y)/s.crop.h*s.rows);
  if(x<0||x>=s.cols||y<0||y>=s.rows)return null;return{x,y};
}
function paintGeometryPreviewCell(e){
  const cell=geometryCellFromEvent(e);if(!cell||!geometryPreviewState)return;
  geometryPreviewState.grid[cell.y][cell.x]=geometryPreviewTool==="erase"?null:geometryPreviewColorId;
  renderGeometryPreview();
}
function addGeometryPreviewColor(hex){
  if(!geometryPreviewState)return;
  const exists=geometryPreviewState.palette.find(c=>c.hex.toLowerCase()===hex.toLowerCase());
  if(exists){geometryPreviewColorId=exists.id;geometryPreviewTool="paint";renderGeometryPreviewPalette();return}
  const id="capture_custom_"+Date.now().toString(36);
  geometryPreviewState.palette.push({id,name:"Cor manual",code:"M",hex});
  geometryPreviewColorId=id;geometryPreviewTool="paint";renderGeometryPreview();
}
function showGeometryPreview(){
  if(!uploadedImage){toast("Escolha uma imagem primeiro");return}
  const setup=captureSetupForPreview();if(!setup)return;
  const {work,ctx,crop,cols,rows}=setup;const detected=convertGeometricTwoColorBeads(ctx,crop,cols,rows);
  const max=1100,scale=Math.min(1,max/Math.max(work.width,work.height));
  geometryPreviewState={work,crop,cols,rows,scale,grid:detected.grid.map(r=>r.slice()),palette:detected.palette.map(c=>({...c}))};
  geometryPreviewTool="paint";geometryPreviewColorId=detected.palette.find(c=>c.id==="capture_red")?.id||detected.palette[0]?.id;
  renderGeometryPreview();$("geometryPreviewModal").classList.remove("hidden");
}
function closeGeometryPreview(){$("geometryPreviewModal")?.classList.add("hidden")}


async function generateProjectFromImage(){
  if(!uploadedImage){
    toast("Escolha uma imagem primeiro");
    return;
  }

  const cols=Math.max(2,Math.min(100,Number($("imageColsInput").value)||20));
  const rowsChoice=$("imageRowsInput")?.value||"auto";
  const maxColors=Math.max(2,Math.min(32,Number($("imageColorsInput").value)||12));
  const bgMode=$("backgroundModeInput").value;
  const fidelityMode=$("imageFidelityInput")?.value||"faithful";
  const useRealColors=($("imageRealColorsInput")?.value||"real")==="real";
  const faithful=fidelityMode==="faithful";
  if(imageCropPoints.length<3){
    toast("Defina primeiro a área da peça com o Recorte livre");
    return;
  }
  const sensitivity=Number($("imageSensitivityInput")?.value)||0.10;
  const name=$("imageProjectName").value.trim()||"Brinco convertido";

  const canvas=$("imageProcessCanvas");
  const maxSide=2400;
  const ctx=renderAdjustedImageToCanvas(canvas,maxSide);
  // V5.32: somente a área recortada manualmente participa da leitura.
  // Não há reconstrução nem repetição automática de padrão.
  const manualBounds=alphaBounds(ctx,canvas.width,canvas.height);
  if(!manualBounds){toast("Não consegui ler a área selecionada");return}
  const objectCrop=manualBounds;
  const aspect=objectCrop.h/objectCrop.w;
  const rows=rowsChoice==="auto"
    ? Math.max(2,Math.min(100,Math.round(cols*aspect)))
    : Math.max(2,Math.min(100,Number(rowsChoice)||Math.round(cols*aspect)));
  // A área amostrada assume a mesma proporção da grade escolhida. Isso impede
  // que uma tabela larga ou alta deforme o objeto fotografado.
  const crop=fitCropToGrid(objectCrop,canvas.width,canvas.height,cols,rows);
  {
    const previewOk=geometryPreviewState && geometryPreviewState.cols===cols && geometryPreviewState.rows===rows;
    const detected=previewOk
      ? {palette:geometryPreviewState.palette.map(c=>({...c})),grid:geometryPreviewState.grid.map(r=>r.slice())}
      : convertGeometricTwoColorBeads(ctx,crop,cols,rows);
    project={id:uid(),name,rows,cols,beadSize:3,technique:"Grade reta",
      palette:detected.palette,grid:detected.grid,
      createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),
      source:"image",captureMode:"selected-area-v533",detectedColorIds:detected.palette.map(c=>c.id),captureCrop:crop,manualCrop:imageCropPoints.map(p=>({...p})),sixPointGeometry:imageSixPoints?.map(p=>({...p}))||null,cornerQuad:imageQuadAdjusted?imageQuad.map(p=>({...p})):null};
    selectedColor="capture_red";tool="paint";symmetry=false;undoStack=[];redoStack=[];
    selectedRows.clear();selectedCols.clear();areaSelection=null;updateRowSelectionBar();updateColSelectionBar();
    zoomLevel=1;setProjectLabel();renderPalette();$("editorPaletteBar")?.classList.remove("paletteCollapsed");
    $("paletteBtn")?.classList.add("activeTool");updateToolButtons();renderGrid();showView("editorView");
    setupZoomGestures();applyZoom(1);setLoomMode(false);
    toast("Área selecionada convertida — confira o diagrama");
    geometryPreviewState=null;
    return;
  }
  const backgroundRgb=borderBackgroundColor(ctx,canvas.width,canvas.height);

  const cells=[];
  for(let y=0;y<rows;y++){
    const row=[];
    for(let x=0;x<cols;x++){
      const x0=Math.floor(crop.x+(x/cols)*crop.w);
      const x1=Math.max(x0+1,Math.floor(crop.x+((x+1)/cols)*crop.w));
      const y0=Math.floor(crop.y+(y/rows)*crop.h);
      const y1=Math.max(y0+1,Math.floor(crop.y+((y+1)/rows)*crop.h));
      const info=cellColorFromRegion(ctx,x0,y0,x1,y1,bgMode,faithful,backgroundRgb);
      row.push(info);
    }
    cells.push(row);
  }


  // O modo fiel exige mais conteúdo real por célula: isso elimina fios finos e
  // o tecido, mas mantém as contas vermelhas e brancas da peça.
  const captureThreshold=faithful?Math.max(.16,sensitivity):sensitivity;
  const captureMask=buildCleanCaptureMask(cells,captureThreshold);
  const useful=[];
  cells.forEach((row,y)=>row.forEach((info,x)=>{if(captureMask[y][x])useful.push(info)}));

  const imgPalette=kmeansPalette(useful,maxColors);
  if(!imgPalette.length){
    toast("Não consegui identificar as cores da imagem. Tente Fidelidade máxima.");
    return;
  }
  if(useRealColors)lockDetectedColorsToRealPalette(imgPalette);

  const grid=Array.from({length:rows},()=>Array(cols).fill(null));
  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      const info=cells[y][x];
      if(!captureMask[y][x]||!info.rgb) continue;
      grid[y][x]=nearestPaletteId(...info.rgb,imgPalette);
    }
  }
  const finalGrid=grid;

  project={
    id:uid(),name,rows,cols,beadSize:3,technique:"Grade reta",
    palette:imgPalette.map(({rgb,...rest})=>rest),grid:finalGrid,
    createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),
    source:"image",captureMode:fidelityMode,
    detectedColorIds:imgPalette.map(c=>c.id),
    sourceImage:$("imagePreview")?.src||null,
    captureCrop:crop,objectCrop,
    captureTable:{rows,cols},mode:"selected-area",useRealColors,manualCrop:imageCropPoints.map(p=>({...p}))
  };

  selectedColor=project.palette[0].id;
  tool="paint"; symmetry=false; undoStack=[]; redoStack=[]; selectedRows.clear(); selectedCols.clear(); areaSelection=null; updateRowSelectionBar(); updateColSelectionBar(); zoomLevel=1;
  setProjectLabel(); renderPalette();
  $("editorPaletteBar")?.classList.remove("paletteCollapsed");
  $("paletteBtn")?.classList.add("activeTool");
  updateToolButtons(); renderGrid(); showView("editorView");
  if(typeof setupZoomGestures==="function") setupZoomGestures();
  if(typeof applyZoom==="function") applyZoom(1);
  if(typeof setLoomMode==="function") setLoomMode(false);
  toast(`Diagrama ${rows}×${cols}: ${project.palette.length} cores detectadas`);
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

function showView(id){
  views.forEach(v=>$(v).classList.toggle("active",v===id));
  document.body.classList.toggle("editor-mode",id==="editorView");
  requestAnimationFrame(()=>updateEditorStickyOffsets());
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
function snapshot(){
  return {rows:project.rows, cols:project.cols, grid:project.grid.map(r=>[...r])};
}
function restoreSnapshot(state){
  if(Array.isArray(state)){
    project.grid=state.map(r=>[...r]);
    project.rows=project.grid.length;
    project.cols=project.grid[0]?.length||project.cols;
    return;
  }
  project.rows=state.rows;
  project.cols=state.cols;
  project.grid=state.grid.map(r=>[...r]);
}
function pushHistory(){
  undoStack.push(snapshot());
  if(undoStack.length>40) undoStack.shift();
  redoStack = [];
}
function setProjectLabel(){
  $("projectLabel").textContent = project ? project.name : "Novo projeto";
}
function newProjectData(){
  const rows = Math.max(4,Math.min(500,Number($("rowsInput").value)||18));
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


function closeReplaceColorPicker(){
  const modal=$("replaceColorPicker");
  if(modal) modal.classList.add("hidden");
}

function openReplaceColorPicker(r,c){
  const modal=$("replaceColorPicker");
  const list=$("replaceColorList");
  if(!modal||!list||!project) return;

  list.innerHTML="";
  project.palette.forEach(color=>{
    const btn=document.createElement("button");
    btn.type="button";
    btn.className="replaceColorSwatch";
    btn.style.background=color.hex;
    btn.title=`${color.name} (${color.code})`;
    btn.setAttribute("aria-label",`Escolher ${color.name}`);
    if(project.grid[r][c]===color.id) btn.classList.add("currentColor");

    btn.onclick=(e)=>{
      e.preventDefault();
      e.stopPropagation();
      pushHistory();
      project.grid[r][c]=color.id;
      selectedColor=color.id;
      closeReplaceColorPicker();
      renderPalette();
      renderGrid();
      toast(`Nova cor: ${color.name}`);
    };
    list.appendChild(btn);
  });

  modal.dataset.row=String(r);
  modal.dataset.col=String(c);
  modal.classList.remove("hidden");
  toast("Escolha nova cor");
}

function renderGrid(){
  const g = $("beadGrid");
  g.innerHTML="";
  renderRulers();
  g.style.gridTemplateColumns=`repeat(${project.cols},28px)`;
  project.grid.forEach((row,r)=>{
    row.forEach((colorId,c)=>{
      const bead=document.createElement("button");
      bead.className="bead"+(colorId?"":" empty")+(selectedRows.has(r)?" selectedRowBead":"")+(selectedCols.has(c)?" selectedColBead":"")+(areaContains(r,c)?" selectedAreaBead":"");
      bead.dataset.r=r; bead.dataset.c=c;
      const color=project.palette.find(x=>x.id===colorId);
      if(color) bead.style.background=color.hex;
      bead.addEventListener("pointerdown",(e)=>{
        if(tool==="pan") return;
        e.preventDefault();
        if(tool==="area"){selectAreaCell(r,c);return;}

        // V5.22 — célula colorida abre troca de cor SOMENTE com o lápis.
        // A borracha deve apagar imediatamente, inclusive ao arrastar.
        if(tool==="paint" && project.grid[r][c]){
          isPointerDown=false;
          openReplaceColorPicker(r,c);
          return;
        }

        isPointerDown=true;
        pushHistory();
        // Não recria a grade no pointerdown; preserva o gesto contínuo.
        applyAt(r,c,false);
      });
      bead.addEventListener("pointerenter",()=>{
        if(isPointerDown && tool!=="pan") applyAt(r,c,false);
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
  bead.className="bead"+(colorId?"":" empty")+(selectedRows.has(r)?" selectedRowBead":"")+(selectedCols.has(c)?" selectedColBead":"")+(areaContains(r,c)?" selectedAreaBead":"");
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
  });
  renderCapturePaletteColumn();
}

function selectCaptureColor(id){
  selectedColor=id;tool="paint";updateToolButtons();renderPalette();
  toast("Cor selecionada: toque na miçanga que deseja corrigir");
}

function renderCapturePaletteColumn(){
  const column=$("capturePaletteColumn"),wrap=$("capturePaletteColors");
  if(!column||!wrap||!project) return;
  const ids=project.detectedColorIds||[];
  const colors=ids.map(id=>project.palette.find(c=>c.id===id)).filter(Boolean);
  column.classList.toggle("hidden",project.source!=="image"||!colors.length);
  wrap.innerHTML="";
  colors.forEach(color=>{
    const b=document.createElement("button");
    b.type="button";b.className="captureColorBtn"+(color.id===selectedColor?" selected":"");
    b.style.setProperty("--capture-color",color.hex);
    b.innerHTML=`<span></span><small>${color.name.replace("Cor imagem ","")}</small>`;
    b.title=`${color.name} (${color.hex})`;
    b.onclick=()=>selectCaptureColor(color.id);
    wrap.appendChild(b);
  });
}

function updateToolButtons(){
  $("paintToolBtn").classList.toggle("activeTool",tool==="paint");
  $("eraseToolBtn").classList.toggle("activeTool",tool==="erase");
  $("panToolBtn")?.classList.toggle("activeTool",tool==="pan");
  $("areaToolBtn")?.classList.toggle("activeTool",tool==="area");
  $("gridViewport")?.classList.toggle("panMode",tool==="pan");
  $("symmetryBtn").classList.toggle("activeTool",symmetry);
}

function updateStats(){
  if($("quickRowsInfo") && project) $("quickRowsInfo").textContent=project.rows;
  if($("quickColsInfo") && project) $("quickColsInfo").textContent=project.cols;
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
  zoomLevel=1; setProjectLabel(); renderPalette();
  $("editorPaletteBar")?.classList.remove("paletteCollapsed");
  $("paletteBtn")?.classList.add("activeTool"); updateToolButtons(); renderGrid(); showView("editorView"); setupZoomGestures(); setupLockedRulers(); applyZoom(1); setLoomMode(project.technique==="Tear");
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

$("newProjectBtn").onclick=()=>showView("newProjectView");
$("imageProjectBtn").onclick=()=>showView("imageProjectView");
$("templatesBtn").onclick=()=>{renderTemplates("Todos");showView("templatesView")};
$("templatesBackBtn").onclick=()=>showView("homeView");
document.querySelectorAll(".templateFilter").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".templateFilter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");renderTemplates(btn.dataset.cat)});
$("cancelImageBtn").onclick=()=>showView("homeView");
function loadImageFromInput(input){
  const file=input.files?.[0];
  if(!file) return;
  const url=URL.createObjectURL(file);
  const img=new Image();
  img.onload=()=>{
    uploadedImage=img;
    resetFreeCrop();
    $("imagePreview").src=url;
    $("imagePreviewWrap").classList.remove("hidden");
    requestAnimationFrame(()=>{syncCropCanvasSize();setupFreeCrop()});
    setupImagePreviewPinchZoom(); setupImagePreviewPan();toast("Imagem carregada — ajuste os 6 pontos, use o zoom e confira a geometria");
  };
  img.onerror=()=>{
    URL.revokeObjectURL(url);
    toast("Não foi possível abrir esta imagem");
  };
  img.src=url;
}

$("freeCropBtn").onclick=()=>{if(!uploadedImage){toast("Escolha uma imagem primeiro");return}setCropMode("free");syncCropCanvasSize();setupFreeCrop();toast("Recorte livre: contorne a peça com o dedo")};
$("sixPointCropBtn").onclick=()=>{if(!uploadedImage){toast("Escolha uma imagem primeiro");return}setCropMode("six");syncCropCanvasSize();setupFreeCrop();toast("Arraste os 6 pontos para acompanhar a geometria do brinco")};
$("imagePanBtn").onclick=setImagePanMode;
$("imageZoomOutBtn").onclick=()=>applyImagePreviewZoom(imagePreviewZoom-.25);
$("imageZoomInBtn").onclick=()=>applyImagePreviewZoom(imagePreviewZoom+.25);
$("imageZoomResetBtn").onclick=()=>applyImagePreviewZoom(1);
$("rotateImageLeftBtn").onclick=()=>rotateSixPoints(-1);
$("rotateImageRightBtn").onclick=()=>rotateSixPoints(1);
$("straightenImageBtn").onclick=autoStraightenSixPoints;
$("resetSixPointsBtn").onclick=()=>{imageSixPoints=defaultImageSixPoints();setCropFromSixPoints();drawFreeCrop();toast("6 pontos restaurados")};
$("previewGeometryBtn").onclick=showGeometryPreview;
$("closeGeometryPreviewBtn").onclick=closeGeometryPreview;
$("backGeometryPreviewBtn").onclick=closeGeometryPreview;
$("confirmGeometryBtn").onclick=()=>{closeGeometryPreview();generateProjectFromImage()};
$("geometryPreviewCanvas")?.addEventListener("pointerdown",e=>{e.preventDefault();paintGeometryPreviewCell(e)});
$("geometryPreviewAddColorBtn")?.addEventListener("click",()=>$("geometryPreviewColorInput")?.click());
$("geometryPreviewColorInput")?.addEventListener("input",e=>addGeometryPreviewColor(e.target.value));
$("undoCropBtn").onclick=()=>{
  if(!imageCropHistory.length){imageCropPoints=[]}else imageCropPoints=imageCropHistory.pop();
  drawFreeCrop();$("undoCropBtn").disabled=!imageCropHistory.length&&imageCropPoints.length===0;$("clearCropBtn").disabled=imageCropPoints.length===0;
};
$("clearCropBtn").onclick=()=>{imageCropHistory.push(imageCropPoints.slice());imageCropPoints=[];drawFreeCrop();$("clearCropBtn").disabled=true;const guide=$("cropGuideText");if(guide){guide.classList.remove("ready");guide.textContent="Ajuste os 6 pontos ou contorne somente a peça. O algoritmo usará apenas essa área."}};
window.addEventListener("resize",()=>{if(uploadedImage)requestAnimationFrame(syncCropCanvasSize)});

$("cameraImageBtn").onclick=()=>{
  const input=$("cameraImageInput");
  input.value="";
  input.click();
};
$("galleryImageBtn").onclick=()=>{
  const input=$("imageInput");
  input.value="";
  input.click();
};
$("cameraImageInput").onchange=(e)=>loadImageFromInput(e.target);
$("imageInput").onchange=(e)=>loadImageFromInput(e.target);
$("generateFromImageBtn").onclick=showGeometryPreview;
$("captureAddColorBtn").onclick=()=>$("addColorBtn").click();
$("cancelNewBtn").onclick=()=>showView("homeView");
$("createProjectBtn").onclick=()=>{
  project=newProjectData(); selectedColor=project.palette[0].id; undoStack=[]; redoStack=[]; selectedRows.clear(); updateRowSelectionBar();
  zoomLevel=1; setProjectLabel(); renderPalette();
  $("editorPaletteBar")?.classList.remove("paletteCollapsed");
  $("paletteBtn")?.classList.add("activeTool"); updateToolButtons(); renderGrid(); showView("editorView"); setupZoomGestures(); setupLockedRulers(); applyZoom(1); setLoomMode(project.technique==="Tear");
}
$("backHomeBtn").onclick=()=>{saveCurrent(); showView("homeView"); setProjectLabel()}
$("paletteBtn").onclick=()=>{
  const bar=$("editorPaletteBar");
  const hidden=bar.classList.toggle("paletteCollapsed");
  $("paletteBtn").classList.toggle("activeTool",!hidden);
  $("paletteBtn").title=hidden?"Mostrar paleta":"Ocultar paleta";
}
$("closeReplaceColorBtn").onclick=closeReplaceColorPicker;
$("replaceColorPicker").addEventListener("click",(e)=>{
  if(e.target===$("replaceColorPicker")) closeReplaceColorPicker();
});
$("openProjectsBtn").onclick=()=>{renderProjects(); showView("projectsView")}
$("projectsBackBtn").onclick=()=>showView("homeView");
$("paintToolBtn").onclick=()=>{tool="paint";updateToolButtons()}
$("eraseToolBtn").onclick=()=>{tool="erase";updateToolButtons()}
$("panToolBtn").onclick=()=>{tool="pan";updateToolButtons();toast("Mão ativada: arraste a tabela") }
$("symmetryBtn").onclick=()=>{symmetry=!symmetry;updateToolButtons();toast(symmetry?"Simetria ligada":"Simetria desligada")}
$("undoBtn").onclick=()=>{
  if(!project||!undoStack.length)return;
  redoStack.push(snapshot()); restoreSnapshot(undoStack.pop()); selectedRows.clear(); renderGrid();
}
$("redoBtn").onclick=()=>{
  if(!project||!redoStack.length)return;
  undoStack.push(snapshot()); restoreSnapshot(redoStack.pop()); selectedRows.clear(); renderGrid();
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

$("rotateBtn").onclick=rotate90;



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
  if(project.source==="image"){
    if(!Array.isArray(project.detectedColorIds)) project.detectedColorIds=[];
    project.detectedColorIds.push(id);
  }
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


// =========================================================
// V5.22 — interface compacta inspirada no novo visual aprovado
// =========================================================
function updateEditorStickyOffsets(){
  const root=document.documentElement;
  const header=document.querySelector('.topbar');
  const toolbar=document.querySelector('.editorView .toolbar');
  const palette=document.querySelector('.editorView .editorPaletteBar');
  const hh=header?.offsetHeight||68;
  const th=document.body.classList.contains('editor-mode')?(toolbar?.offsetHeight||50):0;
  const ph=document.body.classList.contains('editor-mode')?(palette?.offsetHeight||52):0;
  root.style.setProperty('--jp-header-h',`${hh}px`);
  root.style.setProperty('--jp-toolbar-h',`${th}px`);
  root.style.setProperty('--jp-palette-h',`${ph}px`);
}

function setupV522Ui(){
  const topbar=document.querySelector('.topbar');
  const toolbar=document.querySelector('.editorView .toolbar');
  const canvasTop=document.querySelector('.editorView .canvasTop');
  const fileActions=document.querySelector('.editorView .fileActions');
  if(!topbar||!toolbar||!canvasTop||!fileActions||toolbar.dataset.v522Ready) return;
  toolbar.dataset.v522Ready='1';

  // Ações rápidas do cabeçalho — aparecem apenas dentro do editor.
  const headerActions=document.createElement('div');
  headerActions.className='editorHeaderActions';
  headerActions.innerHTML=`
    <button type="button" id="headerOpenBtn" title="Abrir projetos"><span>📁</span><small>Abrir</small></button>
    <button type="button" id="headerSaveBtn" title="Salvar projeto"><span>💾</span><small>Salvar</small></button>
    <button type="button" id="headerShareBtn" title="Compartilhar"><span>↗</span><small>Compart.</small></button>
    <button type="button" id="headerMenuBtn" title="Mais ferramentas"><span>☰</span><small>Menu</small></button>`;
  topbar.appendChild(headerActions);

  // Barra principal: só os controles de uso mais frequente ficam sempre visíveis.
  const labels={
    backHomeBtn:['⌂','Início'], paletteBtn:['🎨','Cor'], paintToolBtn:['✏️','Lápis'],
    eraseToolBtn:['🧽','Borracha'], panToolBtn:['✋','Mão'], areaToolBtn:['▣','Seleção'],
    mirrorHBtn:['⇆','Espelhar'], undoBtn:['↶','Desfazer'], redoBtn:['↷','Refazer']
  };
  Object.entries(labels).forEach(([id,[icon,label]])=>{
    const b=$(id); if(!b) return;
    b.innerHTML=`<span class="toolIcon">${icon}</span><small>${label}</small>`;
    b.classList.add('mainTool');
  });
  const mainIds=new Set(Object.keys(labels));
  [...toolbar.querySelectorAll('button')].forEach(b=>{if(!mainIds.has(b.id)) b.classList.add('advancedTool')});
  const more=document.createElement('button');
  more.type='button'; more.id='moreToolsBtn'; more.className='mainTool moreToolsBtn';
  more.innerHTML='<span class="toolIcon">•••</span><small>Mais</small>';
  toolbar.appendChild(more);

  // Informações enxutas de linhas/colunas ao lado do zoom.
  const info=document.createElement('div');
  info.className='quickGridInfo';
  info.innerHTML='<span>Linhas <b id="quickRowsInfo">—</b></span><span>Colunas <b id="quickColsInfo">—</b></span>';
  canvasTop.appendChild(info);

  // Exportações ficam abaixo da tabela; salvar saiu daqui para evitar duplicação.
  $('saveBtn')?.classList.add('duplicateSaveAction');
  const imgBtn=document.createElement('button');
  imgBtn.type='button'; imgBtn.id='editorImageBtn'; imgBtn.className='primary editorImageBtn';
  imgBtn.textContent='📷 Foto → Diagrama';
  fileActions.appendChild(imgBtn);

  const setAdvanced=(on)=>{
    toolbar.classList.toggle('advanced-open',!!on);
    document.querySelector('.editorView')?.classList.toggle('advanced-open',!!on);
    more.classList.toggle('activeTool',!!on);
    $('headerMenuBtn')?.classList.toggle('activeTool',!!on);
    requestAnimationFrame(updateEditorStickyOffsets);
  };
  more.onclick=()=>setAdvanced(!toolbar.classList.contains('advanced-open'));
  $('headerMenuBtn').onclick=()=>setAdvanced(!toolbar.classList.contains('advanced-open'));
  $('headerOpenBtn').onclick=()=>{saveCurrent();renderProjects();showView('projectsView')};
  $('headerSaveBtn').onclick=saveCurrent;
  $('headerShareBtn').onclick=shareJpm;
  imgBtn.onclick=()=>{saveCurrent();showView('imageProjectView')};

  // Melhora o arraste contínuo da borracha/lápis em telas touch.
  const viewport=$('gridViewport');
  viewport?.addEventListener('pointermove',(e)=>{
    if(!isPointerDown || tool==='pan' || tool==='area') return;
    const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest?.('.bead');
    if(!hit || !viewport.contains(hit)) return;
    const r=Number(hit.dataset.r), c=Number(hit.dataset.c);
    if(Number.isInteger(r)&&Number.isInteger(c)) applyAt(r,c,false);
  },{passive:true});

  const ro=window.ResizeObserver?new ResizeObserver(updateEditorStickyOffsets):null;
  [topbar,toolbar,$('editorPaletteBar')].forEach(el=>el&&ro?.observe(el));
  window.addEventListener('resize',updateEditorStickyOffsets,{passive:true});
  updateEditorStickyOffsets();
  if(project) updateStats();
}

setupV522Ui();

applyTheme(loadTheme());
updateLastProject();
setProjectLabel();
setupLaunchQueue();

$("copyRowsUpBtn")?.addEventListener("click",()=>copySelectedRows("up"));
$("copyRowsDownBtn")?.addEventListener("click",()=>copySelectedRows("down"));
$("clearRowSelectionBtn")?.addEventListener("click",clearRowSelection);
$("copyColsLeftBtn")?.addEventListener("click",()=>copySelectedCols("left"));
$("copyColsRightBtn")?.addEventListener("click",()=>copySelectedCols("right"));
$("clearColSelectionBtn")?.addEventListener("click",clearColSelection);
$("insertRowAboveBtn")?.addEventListener("click",()=>insertRow("above"));
$("insertRowBelowBtn")?.addEventListener("click",()=>insertRow("below"));
$("deleteRowsBtn")?.addEventListener("click",deleteSelectedRows);
$("insertColLeftBtn")?.addEventListener("click",()=>insertCol("left"));
$("insertColRightBtn")?.addEventListener("click",()=>insertCol("right"));
$("deleteColsBtn")?.addEventListener("click",deleteSelectedCols);
$("areaToolBtn")?.addEventListener("click",()=>{tool=tool==="area"?"paint":"area";areaAnchor=null;updateToolButtons();toast(tool==="area"?"Toque em dois cantos da área":"Seleção de área encerrada")});
$("areaEraseBtn")?.addEventListener("click",()=>areaAction("erase"));
$("areaColorBtn")?.addEventListener("click",()=>areaAction("color"));
$("areaMirrorHBtn")?.addEventListener("click",()=>areaAction("mirrorH"));
$("areaMirrorVBtn")?.addEventListener("click",()=>areaAction("mirrorV"));
$("clearAreaBtn")?.addEventListener("click",clearAreaSelection);
$("centerDrawingBtn")?.addEventListener("click",centralizeDrawing);
$("contourBtn")?.addEventListener("click",autoContour);
