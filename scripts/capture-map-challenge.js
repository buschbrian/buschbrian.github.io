async () => {
  document.querySelectorAll('[id^="capture-"]').forEach(el=>el.remove());
  const data = window.captureData;
  const mapElement = document.querySelector("arcgis-map");
  const view = mapElement.view;
  const map = mapElement.map;
  const reservoirLayer = map.findLayerById("reservoirs");
  const Graphic = reservoirLayer.source.getItemAt(0).constructor;
  const originals = (await reservoirLayer.queryFeatures({where:"1=1",outFields:["*"],returnGeometry:true})).features;
  const byName = new Map(data.reservoirs.map(r => [r.name,r]));
  const byId = new Map(data.reservoirs.map(r => [r.station,r]));
  if (originals.length !== 405 || originals.some(f => !byName.has(f.attributes.name))) throw new Error("Reservoir roster does not match the verified snapshot");
  map.layers.forEach(layer => { if (layer.id !== "oceans-reference-layer" && layer.id !== "reservoirs") layer.visible=false; });
  const style = document.createElement("style");
  style.id="capture-style";
  style.textContent = `
    html,body { background:#242723!important; overflow:hidden!important; }
    calcite-shell-panel,calcite-navigation,#storage-map-legend { display:none!important; }
    arcgis-map { position:fixed!important; inset:182px 20px 140px!important; width:auto!important; height:auto!important; z-index:10000!important; border:1px solid #5f5a50; }
    arcgis-map > :not(arcgis-scale-bar) { display:none!important; }
    #capture-heading,#capture-legend,#capture-timeline,#capture-footer { position:fixed; z-index:20000; font-family:var(--app-font); color:#f5efe5; }
    #capture-heading { top:24px; left:36px; right:36px; height:150px; }
    #capture-eyebrow { color:#86b9b5; font-size:17px; letter-spacing:.03em; }
    #capture-title { font-size:46px; line-height:1.06; font-weight:650; margin:18px 220px 12px 0; }
    #capture-subtitle { font-size:20px; color:#c9c0b2; }
    #capture-stat { position:absolute; right:0; top:36px; width:220px; text-align:right; font-size:49px; line-height:1.03; font-weight:650; }
    #capture-stat span { display:block; font-size:17px; color:#c9c0b2; margin-top:12px; font-weight:400; line-height:1.25; }
    #capture-legend { left:36px; right:36px; bottom:95px; height:27px; display:flex; align-items:center; gap:19px; font-size:17px; }
    #capture-legend b { font-weight:500; }
    #capture-legend i { display:inline-block; width:17px; height:17px; margin-right:7px; vertical-align:-2px; border:1px solid #9a9e92; }
    #capture-timeline { left:36px; right:36px; bottom:47px; height:32px; display:flex; align-items:center; gap:9px; font-size:18px; }
    #capture-timeline .track { display:flex; flex:1; align-items:center; justify-content:space-between; position:relative; margin:0 10px; }
    #capture-timeline .track:before { content:"";position:absolute;left:0;right:0;height:1px;background:#5f5a50;z-index:-1; }
    #capture-timeline em { display:block; width:6px; height:6px; border-radius:50%; background:#5f5a50; }
    #capture-timeline em.done { background:#86b9b5; }
    #capture-timeline em.current { width:12px; height:12px; background:#f5efe5; }
    #capture-footer { left:36px; right:36px; bottom:16px; display:flex; justify-content:space-between; font-size:13px; color:#c9c0b2; }
  `;
  document.head.append(style);
  const background=document.createElement("div");
  background.id="capture-background";
  background.style="position:fixed;inset:0;background:#242723;z-index:9000";
  document.body.append(background);
  let ancestor=mapElement.parentElement;
  while(ancestor && ancestor!==document.body){ancestor.style.background="transparent";ancestor.style.zIndex="10000";ancestor=ancestor.parentElement;}
  for (const [id,html] of [
    ["capture-heading",'<div id="capture-eyebrow"></div><div id="capture-title"></div><div id="capture-subtitle"></div><div id="capture-stat"></div>'],
    ["capture-legend",""],["capture-timeline",""],
    ["capture-footer",'<span>Western Water Dashboard · ArcGIS Maps SDK for JavaScript</span><span>Brian Busch · November 2026</span>']
  ]) { const el=document.createElement("div");el.id=id;el.innerHTML=html;document.body.append(el); }
  view.padding={left:0,right:0,top:0,bottom:0};
  view.constraints.minZoom=4;
  view.popupEnabled=false;
  const point=(r,symbol)=>new Graphic({geometry:{type:"point",longitude:r.lon,latitude:r.lat,spatialReference:{wkid:4326}},symbol});
  const line=(a,b,color,width)=>new Graphic({geometry:{type:"polyline",paths:[[[a.lon,a.lat],[b.lon,b.lat]]],spatialReference:{wkid:4326}},symbol:{type:"simple-line",color,width,cap:"round"}});
  const label=(r,text,color="#233b42",xoffset=0,yoffset=16)=>point(r,{type:"text",text,color,haloColor:"#f5f2e9",haloSize:1.5,xoffset,yoffset,font:{family:"Atkinson Hyperlegible Next",size:10,weight:"bold"}});
  const wait = async () => {
    await new Promise(resolve=>setTimeout(resolve,100));
    const start=Date.now();
    while(view.updating && Date.now()-start<18000) await new Promise(resolve=>setTimeout(resolve,100));
    await new Promise(resolve=>setTimeout(resolve,150));
  };
  const header=(day,title,subtitle,value,note)=>{
    document.getElementById("capture-eyebrow").textContent="#30DayMapChallenge 2026 · "+day;
    document.getElementById("capture-title").textContent=title;
    document.getElementById("capture-subtitle").textContent=subtitle;
    document.getElementById("capture-stat").innerHTML=value+"<span>"+note+"</span>";
  };
  const legend=(colors,labels,lead)=>{document.getElementById("capture-legend").innerHTML='<b>'+lead+'</b>'+colors.map((c,i)=>'<span><i style="background:'+c+'"></i>'+labels[i]+'</span>').join("");};
  const timeline=(index,count,left,right)=>{document.getElementById("capture-timeline").innerHTML='<span>'+left+'</span><span class="track">'+Array.from({length:count},(_,i)=>'<em class="'+(i<index?'done':i===index?'current':'')+'"></em>').join("")+'</span><span>'+right+'</span>';};
  const go = async (xmin,ymin,xmax,ymax) => {
    await view.goTo({center:xmax-xmin>15?[-114.1,40.8]:[-109.6,36.65],zoom:xmax-xmin>15?5.2:7},{animate:false});await wait();
  };
  const networkBase = [];
  for(const s of data.snow){const r=byId.get(s.to);networkBase.push(line(s,r,[35,100,130,.29],.7));}
  for(const [a,b] of data.links)networkBase.push(line(byId.get(a),byId.get(b),[29,91,94,.7],1.2));
  for(const s of data.snow)networkBase.push(point(s,{type:"simple-marker",style:"circle",size:2.8,color:[45,126,151,.9],outline:{color:"#edf3ed",width:.3}}));
  for(const id of data.traced)networkBase.push(point(byId.get(id),{type:"simple-marker",style:"circle",size:4.8,color:"#265b58",outline:{color:"#f5efe5",width:.65}}));
  let mode=null;
  window.capture = {
    async storage(index) {
      if(mode!=="storage"){mode="storage";view.graphics.removeAll();reservoirLayer.visible=true;await go(-126,30.5,-101,50.2);}
      const month=data.months[index];
      const result=await reservoirLayer.applyEdits({updateFeatures:originals.map(f=>{
        const r=byName.get(f.attributes.name),value=r.months[month],pct=value===null?null:100*value/r.capacity;
        const a={...f.attributes,size_basis:r.capacity,fill_percent:pct,late:0,symbol_key:(pct===null?-1:Math.min(4,Math.max(0,Math.floor(pct/20))))+"|0"};
        return new Graphic({attributes:a});
      })});
      if(result.updateFeatureResults.some(r=>r.error))throw new Error("A historical feature could not be updated");
      const date=new Date(month+"-15T12:00:00Z").toLocaleDateString("en-US",{month:"long",year:"numeric",timeZone:"UTC"});
      header("Day 1: Points","Western reservoir storage",date+" · Monthly means at 405 reservoirs",data.percentages[index].toFixed(1)+"%","Combined storage<br>388 complete records");
      legend(["#dde2b1","#95aa87","#698c94","#416e9d","#1b3e82"],["Under 20%","20–40%","40–60%","60–80%","80%+"],"Share stored");
      timeline(index,11,"Nov 2025","Sep 2026");
      document.getElementById("capture-footer").firstElementChild.textContent="Western Water Dashboard · ArcGIS Maps SDK for JavaScript · Snapshot: Oct 31, 2026";
      await wait();return {mode,index,date,updates:result.updateFeatureResults.length,percent:data.percentages[index]};
    },
    async network(stage) {
      if(mode!=="network"){mode="network";reservoirLayer.visible=false;await go(-126,30.5,-101,50.2);}
      view.graphics.removeAll();view.graphics.addMany(networkBase);
      for(let i=0;i<Math.min(stage,11);i++)view.graphics.add(line(byId.get(data.longest[i]),byId.get(data.longest[i+1]),"#b74e25",3));
      for(const id of data.longest.slice(0,stage+1))view.graphics.add(point(byId.get(id),{type:"simple-marker",style:"circle",size:6,color:"#b74e25",outline:{color:"#fff8ea",width:1}}));
      for(const name of ["Jackson Lake","Lake Celilo","Lake Mohave"]){const r=data.reservoirs.find(r=>r.name===name);view.graphics.add(label(r,name));}
      header("Day 2: Lines","How the reservoirs connect","400 traced reservoirs · 44 connected groups · 488 snow stations","256","Inferred reservoir links");
      document.getElementById("capture-legend").innerHTML='<span><i style="background:#265b58"></i>Reservoir</span><span><i style="background:#2d7e97"></i>Snow station</span><span><i style="background:#b74e25"></i>Longest chain: 12 reservoirs</span>';
      timeline(stage,12,"Jackson Lake","Lake Celilo");
      document.getElementById("capture-footer").firstElementChild.textContent="USGS NLDI + NRCS SNOTEL · Straight links do not follow river paths";
      await wait();return {mode,stage,graphics:view.graphics.length};
    },
    async rain(day) {
      if(mode!=="rain"){mode="rain";reservoirLayer.visible=false;await go(-114.5,33.3,-104.7,40.0);}
      view.graphics.removeAll();
      const colors=["#984e14","#ae7c28","#c6ae4f","#d2d98d","#74cfd6","#2a81bb"],breaks=[0,.5,1,2,4,8];
      for(const r of [...data.rain].sort((a,b)=>(b.values[day]??-1)-(a.values[day]??-1))){
        const v=r.values[day],index=v===null?-1:breaks.findLastIndex(b=>v>=b);
        view.graphics.add(point(r,{type:"simple-marker",style:"circle",size:v===null?7:5+13*Math.sqrt(v/16.5),color:v===null?[0,0,0,0]:colors[index],outline:{color:v===null?"#405053":"#28434c",width:.7}}));
      }
      if(day===30)for(const name of ["Buckboard Flat","Wolf Creek Summit","Snowslide Canyon"]){const r=data.rain.find(r=>r.name===name);view.graphics.add(label(r,name));}
      const stats=data.rainStats[day];
      header("Bonus map","Four Corners precipitation","October "+(day+1)+", 2026 · Rain and snow measured as water",stats.median.toFixed(1)+" in","Median of 58 stations<br>Normal: "+stats.normal.toFixed(1)+" in");
      legend(colors,["<0.5","0.5–1","1–2","2–4","4–8","8+"],"Inches since Oct 1");
      timeline(day,31,"Oct 1","Oct 31");
      document.getElementById("capture-footer").firstElementChild.textContent="NRCS SNOTEL · "+stats.reported+" of 111 stations reported · Mountain measurements";
      await wait();return {mode,day,stats,graphics:view.graphics.length};
    }
  };
  await new Promise(resolve=>setTimeout(resolve,200));
  await window.capture.storage(10);
  return {ready:true,originals:originals.length,viewport:[innerWidth,innerHeight,devicePixelRatio]};
}
