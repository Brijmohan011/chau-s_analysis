const $=id=>document.getElementById(id);
const defaults={alpha:15.6,beta:28,m0:-1.143,m1:-0.714,dt:.005};
const specs=[['alpha',8,20,.1],['beta',15,35,.5],['m0',-1.6,-.6,.001],['m1',-1.1,-.2,.001],['dt',.001,.01,.001]];
let p={...defaults}, state=[.1,0,0], t=0, running=false, data=[], frame=0;
const controls=$('controls');
specs.forEach(([k,min,max,step])=>{let wrap=document.createElement('div');wrap.innerHTML=`<label>${k.toUpperCase()} <span class="value" id="${k}v">${p[k]}</span></label><input id="${k}" type="range" min="${min}" max="${max}" step="${step}" value="${p[k]}">`;controls.appendChild(wrap);$(k).addEventListener('input',()=>{p[k]=+$(k).value;$(k+'v').textContent=p[k].toFixed(k==='m0'||k==='m1'?3:2)})});
['x0','y0','z0'].forEach(k=>$(k).addEventListener('input',()=>$(k+'v').textContent=(+$(k).value).toFixed(2)));
function deriv(s){let [x,y,z]=s, h=p.m1*x+.5*(p.m0-p.m1)*(Math.abs(x+1)-Math.abs(x-1));return [p.alpha*(y-x-h),x-y+z,-p.beta*y]}
function add(a,b,f){return a.map((v,i)=>v+b[i]*f)}
function rk4(s,dt){let k1=deriv(s),k2=deriv(add(s,k1,dt/2)),k3=deriv(add(s,k2,dt/2)),k4=deriv(add(s,k3,dt));return s.map((v,i)=>v+dt*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6)}
function reset(){running=false;state=[$('x0').value*1,$('y0').value*1,$('z0').value*1];t=0;data=[];draw()}
function step(){for(let i=0;i<5;i++){state=rk4(state,p.dt);t+=p.dt;if(state.some(v=>!Number.isFinite(v)||Math.abs(v)>1e5)){reset();return}if(data.length<30000)data.push({t,x:state[0],y:state[1],z:state[2]})}}
function axes(ctx,w,h){ctx.clearRect(0,0,w,h);ctx.strokeStyle='#29435a';ctx.lineWidth=1;for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(w*i/5,0);ctx.lineTo(w*i/5,h);ctx.stroke();ctx.beginPath();ctx.moveTo(0,h*i/5);ctx.lineTo(w,h*i/5);ctx.stroke()}}
function plot(id,series,rangeX,rangeY){let c=$(id),ctx=c.getContext('2d'),w=c.width=c.clientWidth*devicePixelRatio,h=c.height=c.clientHeight*devicePixelRatio;axes(ctx,w,h);let left=36*devicePixelRatio,right=10*devicePixelRatio,top=10*devicePixelRatio,bottom=22*devicePixelRatio,pw=w-left-right,ph=h-top-bottom;let [xmin,xmax]=rangeX,[ymin,ymax]=rangeY;
series.forEach(s=>{ctx.strokeStyle=s.color;ctx.lineWidth=1.5*devicePixelRatio;ctx.beginPath();let first=true;data.forEach((d,i)=>{if(i%Math.max(1,Math.floor(data.length/5000)))return;let xx=left+(d[s.x]-xmin)/(xmax-xmin)*pw,yy=top+ph-(d[s.y]-ymin)/(ymax-ymin)*ph;if(first){ctx.moveTo(xx,yy);first=false}else ctx.lineTo(xx,yy)});ctx.stroke()});
ctx.fillStyle='#9bb0c4';ctx.font=`${11*devicePixelRatio}px Arial`;ctx.fillText(ymin.toFixed(1),2,h-8);ctx.fillText(ymax.toFixed(1),2,14);ctx.fillText(xmin.toFixed(1),left,h-5);ctx.fillText(xmax.toFixed(1),w-40,h-5)}
function draw(){if(!data.length)data=[{t:0,x:state[0],y:state[1],z:state[2]}];let tail=data.slice(-1800),xs=tail.map(d=>d.t),lo=Math.min(...xs),hi=Math.max(...xs);if(hi===lo)hi=lo+1;
let extent=(key)=>{let a=tail.map(d=>d[key]);let mn=Math.min(...a),mx=Math.max(...a),pad=Math.max(.5,(mx-mn)*.08);return [mn-pad,mx+pad]};
plot('time',[{x:'t',y:'x',color:'#35d6e8'},{x:'t',y:'y',color:'#ffb454'},{x:'t',y:'z',color:'#b99cff'}],[lo,hi],[-8,8]);
plot('phase',[{x:'x',y:'y',color:'#35d6e8'}],[-4,4],[-4,4]);
plot('attractor',[{x:'x',y:'z',color:'#35d6e8'}],[-4,4],[-5,5]);
$('clock').textContent=t.toFixed(2);$('samples').textContent=data.length;$('cx').textContent=state[0].toFixed(3)}
function loop(){if(running){step();draw()}requestAnimationFrame(loop)}
$('start').onclick=()=>{running=true};$('pause').onclick=()=>running=false;$('reset').onclick=reset;
$('preset').onclick=()=>{p={...defaults};specs.forEach(([k])=>{$(k).value=p[k];$(k+'v').textContent=p[k].toFixed(k==='m0'||k==='m1'?3:2)});reset()};
$('download').onclick=()=>{let rows=['time,x,y,z',...data.map(d=>[d.t,d.x,d.y,d.z].join(','))].join('\n'),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([rows],{type:'text/csv'}));a.download='chuas-circuit-data.csv';a.click();URL.revokeObjectURL(a.href)};
reset();loop();window.addEventListener('resize',draw);


