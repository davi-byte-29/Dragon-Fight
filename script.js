const cv=document.getElementById('cv'),mainX=cv.getContext('2d'),W=480,H=270,R=21,SP=13,Z=1.25,TAU=6.2832;
const WALK=1.5,JUMP=-3.7,GRV=.2,MAXF=6,HY=10;
const TOUCH=matchMedia('(pointer:coarse)').matches,CY='#3df2ff',MG='#ff3d9a',AM='#ffb347',MONO="'Share Tech Mono',ui-monospace,monospace",DISP="Orbitron,ui-sans-serif,sans-serif";
let x=mainX,bcv=document.createElement('canvas'),SC=1,rings=[],fade=0,SPR={};
function fit(){const r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),m=Math.min(2,Math.max(1,Math.ceil(r.width*d/W-.05)));if(cv.width!=W*m){cv.width=W*m;cv.height=H*m}SC=cv.width/W;SPR={}}
if(window.ResizeObserver)new ResizeObserver(fit).observe(cv);addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,150));fit();
const K={};
addEventListener('blur',()=>{for(const k in K)K[k]=0;document.querySelectorAll('.k.a').forEach(b=>b.classList.remove('a'))});
addEventListener('contextmenu',e=>e.preventDefault());
const fsb=document.getElementById('fs'),de=document.documentElement,rf=de.requestFullscreen||de.webkitRequestFullscreen;
if(!rf)fsb.style.display='none';else fsb.addEventListener('click',()=>{if(document.fullscreenElement||document.webkitFullscreenElement)(document.exitFullscreen||document.webkitExitFullscreen).call(document);else rf.call(de)});
addEventListener('keydown',e=>{K[e.code]=1;if(e.code.startsWith('Arrow')||e.code=='Space')e.preventDefault();if(e.code=='Enter')act()});
addEventListener('keyup',e=>K[e.code]=0);
document.querySelectorAll('button[data-k]').forEach(b=>{const k=b.dataset.k;
b.addEventListener('pointerdown',e=>{e.preventDefault();K[k]=1;b.classList.add('a')});
['pointerup','pointercancel','pointerleave'].forEach(v=>b.addEventListener(v,()=>{K[k]=0;b.classList.remove('a')}))});
cv.addEventListener('pointerdown',()=>{if(state!='play')act()});
const NAMES=['Dragão laranja','Dragão verde','Cabeça-martelo','Piranha','Verme','Pássaro','Aranha','Javali','Dragão vermelho','Dragão de gelo','Enguia','Javali vermelho','Dragão roxo','Vulcânico','Polvo'];
const PAL=[
{sky:['#33241f','#553a30','#7a5540','#9c7050','#b88a5c'],far:'#6e4a38',far2:'#8e6248',sea:'#6e5238',sea2:'#a07c50',body:'#dc7a2a',lt:'#f6a848',dk:'#7a3416',eye:'#ffd9a0',cl:'#a8846e',cl2:'#7c5c4e',horn:'#efe3b4',moon:1},
{sky:['#74cacf','#92d6d0','#b0e0cc','#d0eec4','#eaf4c8'],far:'#86bea6',far2:'#aed6be',sea:'#b0e0aa',sea2:'#e2f6c4',body:'#3a7a34',lt:'#82c254',dk:'#1c4422',eye:'#8cf050',cl:'#f4f8e8',cl2:'#c4dcd0',horn:'#d8ea9c',rays:1,sun:1},
{sky:['#5e5e58','#76766c','#8e8e80','#a4a494','#b4b4a2'],far:'#6a6a5e',far2:'#84847a',sea:'#58584c',sea2:'#7e7e6e',body:'#443e62',lt:'#6a6490',dk:'#201d30',eye:'#d83030',cl:'#c8c8b0',cl2:'#8a8a78',horn:'#c8c4b0',rain:1},
{sky:['#33241f','#553a30','#7a5540','#9c7050','#b88a5c'],far:'#6e4a38',far2:'#8e6248',sea:'#6e5238',sea2:'#a07c50',body:'#3a4564',lt:'#66749a',dk:'#1a2036',eye:'#f6bc78',cl:'#a8846e',cl2:'#7c5c4e',horn:'#e0c890',moon:1}];
const TP=[[[-200,-50],[200,-50],[200,60],[-200,60]],
[[-220,0],[-100,0],[-100,-70],[40,-70],[40,0],[220,0],[220,70],[-220,70]],
[[-220,-60],[-60,-60],[-60,-10],[80,-10],[80,40],[220,40],[220,90],[-220,90]],
[[-120,-90],[120,-90],[120,10],[220,10],[220,80],[-220,80],[-220,10],[-120,10]]];
let S,P,PL=PAL[0],lv=0,state='title',fr=0,SX=[],SY=[],PX=[],PY=[],SD=[],RR=[],parts=[],cam={x:0,y:0},upP=0,atP=0,sh=0,clouds=[],vig;
for(let i=0;i<14;i++)clouds.push({x:i*70,y:10+(i*41)%110,s:.7+(i%3)*.4,l:i%3});
function pp(s){s=(s%S.per+S.per)%S.per;const m=S.pts.length;let k=0;while(k<m-1&&S.cu[k+1]<=s)k++;
const a=S.pts[k],b=S.pts[(k+1)%m],l=S.cu[k+1]-S.cu[k],dx=(b[0]-a[0])/l,dy=(b[1]-a[1])/l,t=s-S.cu[k];return[a[0]+dx*t,a[1]+dy*t,dx,dy]}
function segs(){const f=S.dd*S.dd*.006;for(let i=0;i<S.n;i++){PX[i]=SX[i];PY[i]=SY[i];const q=pp(S.s-i*SP);SX[i]=q[0];SY[i]=q[1]+f;SD[i]=[q[2],q[3]]}}
function nrm(i){const d=SD[i];let n=[d[1],-d[0]];if(n[1]>0)n=[-n[0],-n[1]];return n}
function wpp(k){const i=S.wi[k],n=nrm(i);return[SX[i]+n[0]*RR[i]*.5,SY[i]+n[1]*RR[i]*.5]}
function safe(px,py){let b=-1,bd=1e9;for(let i=4;i<S.n-5;i++){let ok=1;for(let j=i-3;j<=i+3;j++)if(SD[j][1])ok=0;if(ok){if(px==null)return i;const d=Math.hypot(SX[i]-px,SY[i]-py);if(d<bd){bd=d;b=i}}}return b<0?8:b}
function alive(k){return S.wh[k]>0}
function expo(k){if(!alive(k))return false;if(S.all)return true;for(let j=0;j<k;j++)if(alive(j))return false;return true}
function cover(k){return lv>=5&&((fr/80|0)+k)%3==2}
function left(){return S.wh.filter(h=>h>0).length}
function start(L){lv=L;PL=PAL[L%4];const n=22+L*3,w=L==8?10:Math.min(7,2+Math.ceil((L+1)/2)),sx=2.1+L*.04;
const pts=TP[L%4].map(q=>[q[0]*sx,q[1]*1.7]),cu=[0];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];cu.push(cu[i]+Math.abs(b[0]-a[0])+Math.abs(b[1]-a[1]))}
let bk=0,bl=0;for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],l=Math.abs(b[0]-a[0]);if(a[1]==b[1]&&l>bl){bl=l;bk=i}}
S={pts,cu,per:cu[pts.length],s:cu[bk]+bl*.75,v:1+L*.04,n,wi:[],wh:[],dead:0,dd:0,stone:0,cr:0,cv:[],fb:[],spk:0,fl:0,all:L==4||L==8,spec:['none','spikes','fire'][L%3]};
for(let i=0;i<n;i++){RR[i]=R*(i<n-8?1:.45+.55*(n-1-i)/8);S.cv[i]=0}
for(let k=0;k<w;k++){S.wi.push(Math.round(5+(n-14)*k/w+(n-14)/w*.5));S.wh.push(L==8?2:3+(L>>1))}
segs();segs();const i=safe();
P={x:SX[i],y:SY[i]-RR[i]-1,vx:0,vy:0,face:1,on:-1,hold:0,atk:0,spin:0,dealt:{},inv:0,hp:5};parts=[];
cam.x=P.x-W/2;cam.y=P.y-H*.58;state='play';rings=[];fade=1}
function act(){if(state=='title')start(0);else if(state=='won')lv<14?start(lv+1):state='end';else if(state=='lost')start(lv);else if(state=='end')state='title'}
function burst(X,Y,n,c,g){if(parts.length>140)return;for(let i=0;i<n;i++)parts.push({x:X,y:Y,vx:Math.random()*4-2,vy:-Math.random()*3.5,l:25+Math.random()*25,c,g:g||.12})}
function near(px,py){let b=-1,bd=1e9;for(let i=0;i<S.n;i++){const d=Math.hypot(px-SX[i],py-SY[i])-RR[i];if(d<bd){bd=d;b=i}}return[b,bd]}
function hurt(){if(P.inv>0||S.dead)return;P.hp--;P.inv=80;P.hold=0;P.on=-1;P.vy=-3;sh=9;rings.push({x:P.x,y:P.y-10,r:4,l:20,c:'#ff4a8a'});burst(P.x,P.y-10,10,'#d8307a');if(P.hp<=0)state='lost'}
function swing(){let cx,cy,rad=22;const c=[P.x,P.y-HY];
if(P.spin){cx=c[0];cy=c[1];rad=34}
else if(P.hold){let t=null;for(let k=0;k<S.wi.length;k++)if(expo(k)){t=wpp(k);break}
 if(t){const dx=t[0]-c[0],dy=t[1]-c[1],d=Math.hypot(dx,dy)||1;cx=c[0]+dx/d*14;cy=c[1]+dy/d*14}else{cx=c[0]+P.face*14;cy=c[1]}}
else if(P.on>=0){cx=P.x+P.face*12;cy=P.y+2}else{cx=c[0]+P.face*10;cy=c[1];rad=26}
S.fb=S.fb.filter(f=>Math.hypot(f.x-cx,f.y-cy)>rad+5);
for(let k=0;k<S.wi.length;k++){if(!expo(k)||P.dealt[k]||cover(k))continue;const w=wpp(k);
 if(Math.hypot(w[0]-cx,w[1]-cy)<rad+10){P.dealt[k]=1;S.fl=8;S.fk=k;sh=4;S.wh[k]--;rings.push({x:w[0],y:w[1],r:5,l:14,c:'#fff'});burst(w[0],w[1],7,'#ff9ad0');burst(w[0],w[1],4,'#fff',.02);
  if(S.wh[k]<=0){sh=11;rings.push({x:w[0],y:w[1],r:6,l:30,c:'#ff6ac0'},{x:w[0],y:w[1],r:2,l:22,c:'#fff'});burst(w[0],w[1],26,'#d23a8c');
   if(S.spec=='spikes')S.spk=!S.spk;
   if(S.spec=='fire')for(let i=3;i<S.n;i+=4)S.fb.push({x:SX[i],y:SY[i],l:280});
   if(!left())S.dead=1}}}}
function play(){
const L=+!!(K.ArrowLeft||K.KeyA),Rr=+!!(K.ArrowRight||K.KeyD),U=+!!(K.ArrowUp||K.KeyW),D=+!!(K.ArrowDown||K.KeyS),A=+!!(K.Space||K.KeyZ);
const upE=U&&!upP,atE=A&&!atP;upP=U;atP=A;
if(!S.dead){S.s+=S.v;segs()}
else if(!S.cr){S.dd++;S.s+=S.v;segs();S.stone=Math.min(1,S.dd/150);if(S.dd%4==0){const q=(S.dd/4|0)%S.n;burst(SX[q],SY[q],2,'#9a9a9a')}
if(S.stone>=1){S.cr=1;P.on=-1;P.hold=0;P.vy=-4.5;P.spin=0}}
else{S.cr++;for(let i=0;i<S.n;i++){S.cv[i]+=.15+i*.0008;SY[i]+=S.cv[i]}if(S.cr>110){state='won';return}}
if(atE&&!P.atk&&!P.spin){P.dealt={};if(P.on<0&&!P.hold)P.spin=26;else P.atk=16}
if(P.atk>0){P.atk--;if(P.atk<12&&P.atk>3)swing()}
if(P.spin>0){P.spin--;if(P.spin<22&&P.spin>3)swing()}
if(P.inv>0)P.inv--;if(P.sq>0)P.sq--;
if(!S.cr){
 if(P.on>=0){P.x+=SX[P.on]-PX[P.on];P.y+=SY[P.on]-PY[P.on]}
 if(D&&!P.hold&&near(P.x,P.y-HY)[1]<12){P.hold=1;P.on=-1;P.vy=0}
 if(!D)P.hold=0;
 if(P.hold){let k=near(P.x,P.y-HY)[0];P.x+=SX[k]-PX[k];P.y+=SY[k]-PY[k];
  const mx=(Rr-L)*1.3,my=U?-1.4:0;P.x+=mx;P.y+=my;if(mx)P.face=mx>0?1:-1;
  k=near(P.x,P.y-HY)[0];const dx=P.x-SX[k],dy=P.y-HY-SY[k],d=Math.hypot(dx,dy)||1,r=RR[k]+1;
  if(Math.abs(d-r)>1.5){P.x=SX[k]+dx/d*r;P.y=SY[k]+dy/d*r+HY}}
 else{P.vx=(Rr-L)*WALK;if(P.vx)P.face=P.vx>0?1:-1;
  if(P.on>=0&&upE){P.vy=JUMP;P.on=-1}
  P.x+=P.vx;const air=P.on<0,pv=P.vy;if(air){P.vy=Math.min(P.vy+GRV,MAXF);P.y+=P.vy}
  let g=-1,bt=1e9;for(let i=0;i<S.n;i++){const dx=P.x-SX[i];if(Math.abs(dx)<RR[i]){const t=SY[i]-Math.sqrt(RR[i]*RR[i]-dx*dx);if(t<bt){bt=t;g=i}}}
  if(g>=0){const d=P.y-bt;if(P.on>=0?(d>-12&&d<18):(P.vy>=0&&d>=-2&&d<12+P.vy)){if(air&&pv>2){burst(P.x,bt,6,PL.lt,.05);P.sq=9};P.y=bt;P.vy=0;P.on=g;P.spin=0}else P.on=-1}else P.on=-1}
 // cai pela borda inferior da tela: perde vida e quica alto
 let my=-1e9;for(let i=0;i<S.n;i++)my=Math.max(my,SY[i]+RR[i]);
 if(P.y>cam.y+H+14||P.y>my+70){const k=safe(P.x,P.y);burst(P.x,Math.min(P.y,cam.y+H),10,'#fff',.1);hurt();
  P.x=SX[k];P.y=SY[k]-RR[k]-1;P.vx=0;P.vy=0;P.on=-1;P.hold=0;P.spin=0;cam.x=P.x+P.face*24-W/2;cam.y=P.y-H*.58}
}else{P.vy=Math.min(P.vy+.06,2);P.y+=P.vy;P.x+=(Rr-L)*.8}
if(!S.dead){
 if(S.spec=='spikes'&&S.spk)for(let i=1;i<S.n-1;i+=3){const n=nrm(i),r=RR[i];if(Math.hypot(P.x-(SX[i]+n[0]*(r+7)),P.y-10-(SY[i]+n[1]*(r+7)))<9)hurt()}
 for(const f of S.fb){f.l--;if(Math.hypot(P.x-f.x,P.y-10-f.y)<10)hurt()}S.fb=S.fb.filter(f=>f.l>0)}
if(S.fl>0)S.fl--;if(sh>0)sh-=.5;
cam.x+=(P.x+P.face*24-W/2-cam.x)*.12;cam.y+=(P.y-H*.58-cam.y)*.06}
function circ(X,Y,r,c){x.fillStyle=c;x.beginPath();x.arc(X,Y,r,0,TAU);x.fill()}
function el(X,Y,a,b){x.beginPath();x.ellipse(X,Y,a,b,0,0,TAU);x.fill()}
bcv.width=W;bcv.height=H;const bx=bcv.getContext('2d');
function bgc(){bg()}
function bg(){const hor=Math.min(H-24,H*.74-(cam.y-30)*.22);
const g=x.createLinearGradient(0,0,0,hor);PL.sky.forEach((c,i)=>g.addColorStop(i/(PL.sky.length-1),c));x.fillStyle=g;x.fillRect(0,0,W,H);
const MX=W*.76,MY=H*.24;
if(PL.moon){for(let i=0;i<36;i++){x.globalAlpha=.3+.7*Math.abs(Math.sin(fr*.05+i*1.7));x.fillStyle='#f4d88a';const sx=(i*131)%W,sy=(i*53)%(hor*.75);x.fillRect(sx,sy,1.5,1.5);if(i%3==0){x.fillRect(sx-2,sy,5.5,1);x.fillRect(sx+.2,sy-2,1,5.5)}}x.globalAlpha=1;
const mg=x.createRadialGradient(MX,MY,20,MX,MY,90);mg.addColorStop(0,'rgba(255,225,140,.4)');mg.addColorStop(1,'rgba(255,225,140,0)');x.fillStyle=mg;x.fillRect(MX-100,0,200,MY+100);
circ(MX,MY,34,'#86594a');circ(MX-10,MY-8,7,'#774c3e');circ(MX+9,MY+10,9,'#774c3e');circ(MX+12,MY-12,4,'#936658');circ(MX-14,MY+12,4,'#774c3e');
x.strokeStyle='#f2e4a0';x.lineWidth=5;x.beginPath();x.arc(MX,MY,36,.55,TAU-.35);x.stroke();x.strokeStyle='#c8b070';x.lineWidth=2;x.beginPath();x.arc(MX,MY,39,1.2,5.2);x.stroke()}
else if(PL.sun){const sg=x.createRadialGradient(MX,MY-10,4,MX,MY-10,110);sg.addColorStop(0,'rgba(255,252,215,.95)');sg.addColorStop(1,'rgba(255,252,215,0)');x.fillStyle=sg;x.fillRect(MX-120,0,240,MY+120)}
if(PL.rays){x.fillStyle='rgba(255,255,255,.08)';for(let i=0;i<5;i++){const o=40+i*70+Math.sin(fr*.01+i)*8;x.beginPath();x.moveTo(o,0);x.lineTo(o+36,0);x.lineTo(o+130,hor);x.lineTo(o+60,hor);x.fill()}}
const cloud=(c)=>{const cx=((c.x-cam.x*(.05+c.l*.06)+fr*.04*c.s)%700+700)%700-150,cy=c.y-cam.y*.05,s=c.s*1.2;
x.globalAlpha=.92;x.fillStyle=PL.cl2;el(cx+40*s,cy+14*s,44*s,8*s);x.fillStyle=PL.cl;el(cx+24*s,cy+8*s,22*s,9*s);el(cx+50*s,cy+5*s,26*s,10*s);el(cx+40*s,cy+11*s,40*s,6*s);x.globalAlpha=1};
for(const c of clouds)if(c.l==0)cloud(c);
for(let l=0;l<2;l++){x.fillStyle=l?PL.far:PL.far2;for(let px=0;px<W;px+=6){const q=(px+cam.x*(.12+l*.12)+l*90)*(.02+l*.008),h=(l?26:40)+Math.sin(q)*(l?16:20)+Math.sin(q*3.1)*6+Math.sin(q*7)*2;x.fillRect(px,hor-h,7,h+1)}
x.fillStyle='rgba(255,255,255,.1)';x.fillRect(0,hor-12,W,12)}
for(const c of clouds)if(c.l>0)cloud(c);
x.fillStyle=PL.sea;x.fillRect(0,hor,W,H-hor);const gs=x.createLinearGradient(0,hor,0,hor+50);gs.addColorStop(0,'rgba(255,255,255,.28)');gs.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gs;x.fillRect(0,hor,W,50);
for(let y=hor+3,r=0;y<H;y+=4,r++){x.fillStyle='rgba(255,240,200,'+(.1+.1*Math.sin(r+fr*.04))+')';for(let xx=-((fr*(.15+r*.012)+y*13)%48);xx<W;xx+=48)x.fillRect(xx,y,14+(r%3)*6,1.5)}
if(PL.moon){x.strokeStyle='rgba(250,230,150,.55)';x.lineWidth=3;x.beginPath();x.ellipse(MX,hor+(H-hor)*.4,38,10,0,0,TAU);x.stroke();x.fillStyle=PL.sea;for(let y=hor+(H-hor)*.4-12,r=0;y<hor+(H-hor)*.4+12;y+=3,r++)if(r%2)x.fillRect(MX-45,y,90,1.5)}
else if(PL.sun){x.fillStyle='rgba(255,252,215,.3)';for(let y=hor+2,r=0;y<H;y+=4,r++)x.fillRect(MX-12+Math.sin(fr*.05+r)*5-r*.3,y,24+r*.7,1.5)}
if(PL.rain){x.strokeStyle='rgba(225,225,205,.4)';x.lineWidth=1;x.beginPath();for(let i=0;i<120;i++){const rx=(i*47+fr*3)%W,ry=(i*31+fr*8)%H;x.moveTo(rx,ry);x.lineTo(rx-4,ry+10)}x.stroke()}}
function bodySpr(r,stn,c1,c2,c3){const key=(stn?'s':lv%4)+'_'+r;let c=SPR[key];if(c)return c;const o=r+3;c=document.createElement('canvas');c.width=c.height=Math.ceil(o*2*SC);const g=c.getContext('2d');g.scale(SC,SC);
g.fillStyle=c1;g.beginPath();g.arc(o,o,r+1.3,0,TAU);g.fill();const gr=g.createRadialGradient(o-r*.35,o-r*.5,r*.08,o,o,r);gr.addColorStop(0,c3);gr.addColorStop(.5,c2);gr.addColorStop(1,c1);g.fillStyle=gr;g.beginPath();g.arc(o,o,r,0,TAU);g.fill();
g.globalAlpha=.42;g.fillStyle=stn?'#9a9aa0':PL.horn;g.beginPath();g.ellipse(o,o+r*.6,r*.78,r*.3,0,0,Math.PI);g.fill();g.globalAlpha=.55;g.strokeStyle=c3;g.lineWidth=1.5;g.beginPath();g.arc(o,o,r-1.8,3.5,4.75);g.stroke();return SPR[key]=c}
function ovSpr(r,stn,c1,par){const key='o'+par+(stn?'s':lv%4)+'_'+r;let c=SPR[key];if(c)return c;const o=r+3;c=document.createElement('canvas');c.width=c.height=Math.ceil(o*2*SC);const g=c.getContext('2d');g.scale(SC,SC);g.strokeStyle=c1;g.globalAlpha=.55;g.lineWidth=1.3;
if(par==0){g.beginPath();g.arc(o-r*.25,o,r*.7,-1.3,1.3);g.stroke()}else for(let q=-1;q<=1;q++){g.beginPath();g.arc(o-r*.5,o+q*r*.5,r*.38,-1.2,1.2);g.stroke()}return SPR[key]=c}
function drawS(){const n=S.n,st=S.stone*(n+6),al=S.cr?Math.max(0,1-S.cr/100):1;x.globalAlpha=al;
for(let i=n-1;i>=0;i--){const stn=i<st,X=SX[i],Y=SY[i],d=SD[i],r=RR[i]*(1+.035*Math.sin(fr*.07-i*.55)),m=nrm(i),c1=stn?'#4a4a52':PL.dk,c2=stn?'#85858b':PL.body,c3=stn?'#b4b4ba':PL.lt;
if(S.spec=='spikes'&&S.spk&&i%3==1&&i<n-1&&!stn){x.fillStyle=PL.horn;x.beginPath();x.moveTo(X+m[0]*(r+11),Y+m[1]*(r+11));x.lineTo(X+m[0]*(r-2)-m[1]*5,Y+m[1]*(r-2)+m[0]*5);x.lineTo(X+m[0]*(r-2)+m[1]*5,Y+m[1]*(r-2)-m[0]*5);x.fill()}
else if(!stn&&i>1&&i%2==0){const h=3+7*(r/R)*(1-i/n*.6);x.fillStyle=PL.horn;x.beginPath();x.moveTo(X+m[0]*(r+h),Y+m[1]*(r+h));x.lineTo(X+m[0]*(r-1)-m[1]*3.6,Y+m[1]*(r-1)+m[0]*3.6);x.lineTo(X+m[0]*(r-1)+m[1]*3.6,Y+m[1]*(r-1)-m[0]*3.6);x.fill();x.fillStyle=c1;x.globalAlpha=al*.35;x.beginPath();x.moveTo(X+m[0]*(r+h),Y+m[1]*(r+h));x.lineTo(X+m[0]*(r-1)+m[1]*3.6,Y+m[1]*(r-1)-m[0]*3.6);x.lineTo(X+m[0]*(r-1),Y+m[1]*(r-1));x.fill();x.globalAlpha=al}
{const rr=Math.max(1,Math.round(r)),o=rr+3;x.drawImage(bodySpr(rr,stn,c1,c2,c3),X-o,Y-o,o*2,o*2)}
{const rr=Math.max(1,Math.round(r)),o=rr+3;x.save();x.translate(X,Y);x.rotate(Math.atan2(d[1],d[0]));x.drawImage(ovSpr(rr,stn,c1,i%2),-o,-o,o*2,o*2);x.restore()}}
for(let k=0;k<S.wi.length;k++){const i=S.wi[k],w=wpp(k),stn=i<st,c1=stn?'#5a5a60':PL.dk,c3=stn?'#aaaab0':PL.lt;
if(!alive(k)){circ(w[0],w[1],6,'#2c0c24');circ(w[0],w[1],3.5,'#701848');continue}
const ex=expo(k),cv_=cover(k),fl=S.fl>0&&S.fk==k;
if(ex&&!cv_){x.globalAlpha=al*.35;circ(w[0],w[1],17+Math.sin(fr*.2)*2,'#ff5aa8');x.globalAlpha=al}
const base=fl?'#fff':'#6a2c80',lob=fl?'#fff':'#9a4cb4',hi=fl?'#fff':'#cc86e0';
if(!ex||cv_){circ(w[0],w[1],11,c1);circ(w[0],w[1],8.5,c3);x.strokeStyle=c1;x.lineWidth=1.5;x.beginPath();x.arc(w[0],w[1],5,0,TAU);x.stroke()}
else{circ(w[0],w[1],12,base);for(let q=0;q<5;q++){const a=q*1.26+fr*.01;circ(w[0]+Math.cos(a)*8,w[1]+Math.sin(a)*7,6.5,lob)}circ(w[0],w[1],7,hi);circ(w[0]-2,w[1]-2,2.2,'#f4d0f8')}}
x.globalAlpha=1;drawHead();
for(const f of S.fb){const r=6+Math.sin(fr*.3+f.x)*1.5;x.globalAlpha=.35;circ(f.x,f.y,r+5,'#ff5a10');x.globalAlpha=1;circ(f.x,f.y,r,'#ff7a20');circ(f.x,f.y,r*.5,'#ffe080')}}
function drawHead(){const d=SD[0],a=Math.atan2(d[1],d[0]),st=S.stone>=1,r=R;
x.save();x.translate(SX[0]+d[0]*r*.9,SY[0]+d[1]*r*.9);x.rotate(a+Math.PI/2+(st?0:Math.sin(fr*.05)*.06));
const c=st?['#4a4a50','#7e7e84','#b0b0b6']:[PL.dk,PL.body,PL.lt],bone=st?'#9a9a9e':PL.horn;
for(const s of[-1,1]){x.fillStyle=bone;for(let q=0;q<3;q++){x.beginPath();x.moveTo(s*r*.8,-r*.2+q*r*.55);x.lineTo(s*r*1.55,r*.45+q*r*.6);x.lineTo(s*r*.7,r*.3+q*r*.55);x.fill()}
 const hg=x.createLinearGradient(0,-r*.9,0,-r*2.1);hg.addColorStop(0,c[0]);hg.addColorStop(.4,bone);hg.addColorStop(1,'#fff');x.fillStyle=hg;
 x.beginPath();x.moveTo(s*r*.5,-r*.9);x.quadraticCurveTo(s*r*1.5,-r*1.2,s*r*1.1,-r*2.1);x.quadraticCurveTo(s*r*1.1,-r*1.4,s*r*.35,-r*.9);x.fill()}
x.fillStyle=c[0];el(0,0,r*1.2,r*1.6);
const g=x.createRadialGradient(-r*.3,-r*.7,r*.1,0,0,r*1.5);g.addColorStop(0,c[2]);g.addColorStop(.5,c[1]);g.addColorStop(1,c[0]);x.fillStyle=g;el(0,0,r*1.08,r*1.48);
x.strokeStyle=c[0];x.globalAlpha=.6;x.lineWidth=1.4;for(let q=0;q<3;q++)for(let w=-1;w<=1;w++){x.beginPath();x.arc(w*r*.5,r*.35+q*r*.4,r*.24,0,3.14);x.stroke()}x.globalAlpha=1;
x.fillStyle=c[0];for(const s of[-1,1])el(s*r*.24,-r*1.25,r*.07,r*.11);
for(const s of[-1,1]){x.fillStyle='#fff6e0';x.beginPath();x.moveTo(s*r*.62,-r*1.3);x.lineTo(s*r*.84,-r*1.0);x.lineTo(s*r*.42,-r*1.08);x.fill();
 x.strokeStyle=c[0];x.lineWidth=3;x.lineCap='round';x.beginPath();x.moveTo(s*r*.18,-r*.78);x.lineTo(s*r*.82,-r*.56);x.stroke();
 x.save();x.translate(s*r*.5,-r*.35);x.rotate(s*.3);x.fillStyle=c[0];el(0,0,r*.4,r*.32);
 if(!st){x.globalAlpha=.35;x.fillStyle=PL.eye;el(0,0,r*.46,r*.38);x.globalAlpha=1}x.fillStyle=st?'#555':PL.eye;el(0,0,r*.31,r*.24);
 x.fillStyle=st?'#222':'#1a0a04';el(0,0,r*.07,r*.23);x.fillStyle='#fff';x.fillRect(-r*.16,-r*.14,2.4,2.4);x.restore()}
x.fillStyle=bone;x.fillRect(-1.5,-r*.95,3,3);x.restore()}
function drawP(){if(P.inv>0&&(fr>>2)&1)return;const air=P.on<0&&!P.hold,w=P.on>=0&&P.vx&&!P.hold,st=w?((fr>>3)&1):0;
x.save();x.translate(Math.round(P.x),Math.round(P.y));{const sq=P.sq>0?P.sq/9:0,stt=air?1+Math.min(Math.abs(P.vy)*.03,.18):1,br=(!air&&!w&&!P.hold)?Math.sin(fr*.1)*.018:0,sy=stt*(1-sq*.22)+br;x.scale(P.face*Z/Math.sqrt(sy),Z*sy)}
const cw=Math.sin(fr*.25)*1.2+(air?-P.vy*1.5:0)-(w?2:0);
x.fillStyle='#7a2f6e';x.beginPath();x.moveTo(-3,-11);x.lineTo(-9,-5+cw);x.lineTo(-10,1+cw);x.lineTo(-6,-1+cw);x.lineTo(-3,-3);x.fill();x.fillStyle='#a8478f';x.beginPath();x.moveTo(-3,-11);x.lineTo(-7,-6+cw);x.lineTo(-3,-6);x.fill();
x.fillStyle='#3a2a1e';if(air){x.fillRect(-4,-3,3,3);x.fillRect(2,-4,3,3)}else{x.fillRect(-3-st,-3,3,3);x.fillRect(1+st,-3,3,3)}
x.fillStyle='#4a4e36';x.fillRect(-3,-8,7,5);x.fillStyle='#6a6e4c';x.fillRect(-3,-8,7,1);x.fillStyle='#8a6a3a';x.fillRect(-3,-5,7,1);x.fillStyle='#d8c070';x.fillRect(0,-5,1,1);
x.fillStyle='#e8b080';x.fillRect(3,-8,2,3);
x.fillStyle='#e0286e';x.fillRect(-3,-10,7,3);x.fillStyle='#ff5a98';x.fillRect(-3,-10,7,1);x.fillRect(-6,-10+(cw>0?1:0),3,2);
x.fillStyle='#f0c090';x.fillRect(-2,-12,5,2);x.fillStyle='#2a3a5a';x.fillRect(1,-12,1,1);x.fillStyle='#e8c060';x.fillRect(-3,-12,1,2);
x.fillStyle='#585a5c';x.fillRect(-4,-15,9,3);x.fillStyle='#7a7c7e';x.fillRect(-4,-15,9,1);x.fillStyle='#3a3c3e';x.fillRect(-1,-14,2,1);x.fillStyle='#e8dcc0';x.fillRect(-6,-18,2,4);x.fillRect(5,-18,2,4);x.fillStyle='#fff';x.fillRect(-6,-18,1,2);
let a=-1.1;
if(P.spin>0){a=-1.1+(1-P.spin/26)*TAU*1.15;x.strokeStyle='rgba(255,255,255,.4)';x.lineWidth=4.5;x.beginPath();x.arc(1,-8,16,a-2.2,a);x.stroke();x.strokeStyle='rgba(255,255,255,.2)';x.beginPath();x.arc(1,-8,16,a-4.2,a-2.2);x.stroke()}
else if(P.atk>0){a=-1.3+(1-P.atk/16)*2.6;x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=4.5;x.beginPath();x.arc(3,-7,14,-1.3,a);x.stroke()}
const ox=P.spin>0?1:3,oy=P.spin>0?-8:-7,L=P.spin>0?16:14;
x.strokeStyle='#9a9ca0';x.lineWidth=2.4;x.beginPath();x.moveTo(ox,oy);x.lineTo(ox+Math.cos(a)*L,oy+Math.sin(a)*L);x.stroke();x.strokeStyle='#f0f0f4';x.lineWidth=1;x.beginPath();x.moveTo(ox,oy);x.lineTo(ox+Math.cos(a)*L,oy+Math.sin(a)*L);x.stroke();
x.fillStyle='#d8c070';x.fillRect(Math.round(ox+Math.cos(a)*3)-1,Math.round(oy+Math.sin(a)*3)-1,3,2);
if(P.hold){x.fillStyle='#d0d0d4';x.fillRect(5,-4,2,5);x.fillStyle='#5a3a1e';x.fillRect(5,-6,2,2)}x.restore()}
function txt(t,X,Y,sz,c,glow,f,al){x.font=(f==DISP?(sz>14?'900 ':'700 '):'')+sz+'px '+(f||MONO);x.textAlign=al||'center';
x.shadowColor='transparent';x.shadowBlur=0;x.fillStyle='rgba(2,6,12,.85)';x.fillText(t,X+1.2,Y+1.2);
if(glow){x.shadowColor=glow;x.shadowBlur=9*SC}x.fillStyle=c||'#d9f6ff';x.fillText(t,X,Y);x.shadowBlur=0;x.shadowColor='transparent'}
function panel(X,Y,w,h,c,f,k){k=k||8;x.beginPath();x.moveTo(X+k,Y);x.lineTo(X+w,Y);x.lineTo(X+w,Y+h-k);x.lineTo(X+w-k,Y+h);x.lineTo(X,Y+h);x.lineTo(X,Y+k);x.closePath();
if(f){x.fillStyle=f;x.fill()}if(c){x.strokeStyle=c;x.lineWidth=1.25;x.stroke()}}
function seg(X,Y,w,h,c,glow){x.fillStyle=c;x.beginPath();x.moveTo(X+3,Y);x.lineTo(X+w,Y);x.lineTo(X+w-3,Y+h);x.lineTo(X,Y+h);x.closePath();x.fill();x.shadowBlur=0;x.shadowColor='transparent'}
function brackets(X,Y,w,h,c){x.strokeStyle=c||CY;x.lineWidth=1.5;const l=14;x.beginPath();
x.moveTo(X,Y+l);x.lineTo(X,Y);x.lineTo(X+l,Y);x.moveTo(X+w-l,Y);x.lineTo(X+w,Y);x.lineTo(X+w,Y+l);
x.moveTo(X+w,Y+h-l);x.lineTo(X+w,Y+h);x.lineTo(X+w-l,Y+h);x.moveTo(X+l,Y+h);x.lineTo(X,Y+h);x.lineTo(X,Y+h-l);x.stroke()}
function shade(a){x.fillStyle='rgba(10,6,4,'+a+')';x.fillRect(0,0,W,H)}
function vgn(){if(!vig){vig=document.createElement('canvas');vig.width=W;vig.height=H;const g=vig.getContext('2d'),r=g.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,W*.65);r.addColorStop(0,'rgba(0,0,0,0)');r.addColorStop(1,'rgba(10,4,0,.45)');g.fillStyle=r;g.fillRect(0,0,W,H)}x.drawImage(vig,0,0,W,H)}
function hud(){
const hp=Math.max(P.hp,0),lo=hp<=2;
panel(8,H-40,150,32,'rgba(61,242,255,.55)','rgba(4,9,18,.72)');
txt('HP',18,H-20,10,lo?'#ff5a6e':CY,0,DISP,'left');
for(let i=0;i<5;i++){const on=i<hp;seg(40+i*23,H-30,20,12,on?(lo?'#ff3d5a':CY):'rgba(61,242,255,.14)',on?(lo?'#ff3d5a':CY):0)}
const n=S.wi.length,r0=W-118;
panel(r0,H-40,110,32,'rgba(255,61,154,.6)','rgba(4,9,18,.72)');
txt('ALVOS',r0+10,H-27,8,'#ff8cc4',0,DISP,'left');
txt(String(left()),r0+14,H-12,15,'#fff',0,DISP,'left');
const bw=Math.min(14,50/n);for(let k=0;k<n;k++)seg(r0+46+k*(bw+2),H-25,bw,10,alive(k)?MG:'rgba(255,61,154,.15)',alive(k)?MG:0);
panel(W-152,8,144,32,'rgba(61,242,255,.45)','rgba(4,9,18,.66)');
txt('SERPENTE '+String(lv+1).padStart(2,'0')+'/15',W-144,21,8,CY,0,DISP,'left');
txt(NAMES[lv],W-144,34,11,'#fff',0,MONO,'left')}
function draw(){
x.setTransform(SC,0,0,SC,0,0);
if(!S||state=='title'||state=='end'){bgc();shade(.5);vgn();
if(state=='title'){panel(60,34,360,208,'rgba(61,242,255,.5)','rgba(4,9,18,.62)',14);brackets(52,26,376,224);
txt('DRAGON FIGHT',240,82,30,'#e9fdff',CY,DISP);txt('// ABATA 15 SERPENTES DO CÉU //',240,102,10,CY);
txt('SLAYER: Vou bater seu recorde, pai!',240,134,12);txt('Vou abater 15 serpentes do céu!',240,151,12);txt('PAI: Esse menino...',240,171,12,'#9fb6c4');
if((fr>>5)&1)txt('▶ '+(TOUCH?'TOQUE':'ENTER / TOQUE')+' PARA INICIAR',240,203,12,AM,AM,DISP);
txt(TOUCH?'Use os botões · corte os pontos fracos roxos':'← → andar · ↑ pular · ↓ segurar · ESPAÇO atacar',240,226,10,'#8fb0c2')}
else{panel(60,56,360,150,'rgba(255,179,71,.55)','rgba(4,9,18,.66)',14);brackets(52,48,376,166,AM);
txt('VOCÊ ABATEU 15 SERPENTES!',240,100,16,'#fff',AM,DISP);txt('Ao voltar, o Slayer descobre...',240,132,12);txt('PAI: Eu abati 140.',240,156,14,'#ffd9a0');
if((fr>>5)&1)txt('▶ TOQUE / ENTER PARA VOLTAR',240,188,11,AM,AM,DISP)}return}
bgc();x.save();const sx=sh>0?(Math.random()-.5)*sh:0,sy=sh>0?(Math.random()-.5)*sh:0;x.translate(Math.round(-cam.x+sx),Math.round(-cam.y+sy));drawS();drawP();
x.globalCompositeOperation='lighter';for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.l--;x.globalAlpha=Math.min(1,p.l/15);x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,2.2,0,TAU);x.fill()}x.globalCompositeOperation='source-over';x.globalAlpha=1;
for(const q of rings){q.l--;q.r+=(q.l+6)*.22;x.globalAlpha=Math.max(0,q.l/26);x.strokeStyle=q.c;x.lineWidth=1+q.l*.08;x.beginPath();x.arc(q.x,q.y,q.r,0,TAU);x.stroke()}x.globalAlpha=1;rings=rings.filter(q=>q.l>0);parts=parts.filter(p=>p.l>0);x.restore();
vgn();hud();
if(state=='won'){shade(.55);panel(90,96,300,84,'rgba(61,242,255,.6)','rgba(4,9,18,.78)',12);brackets(84,90,312,96);
txt('SERPENTE '+(lv+1)+' ABATIDA!',240,130,17,'#fff',CY,DISP);txt(lv<14?'▶ ENTER / TOQUE: próxima':'▶ ENTER / TOQUE: continuar',240,158,11,AM)}
if(state=='lost'){shade(.6);panel(90,96,300,84,'rgba(255,61,90,.7)','rgba(14,4,8,.8)',12);brackets(84,90,312,96,'#ff3d5a');
txt('VOCÊ CAIU...',240,130,19,'#ff8a9a','#ff3d5a',DISP);txt('▶ ENTER / TOQUE: tentar de novo',240,158,11,AM)}}
let _d=draw;draw=function(){_d();if(fade>0){shade(fade);fade=Math.max(0,fade-.035)}};
let last=0,acc=0;
function loop(t){acc+=Math.min(t-last,50);last=t;while(acc>=16.67){acc-=16.67;fr++;
if(state=='play')play();else{const A=K.Space||K.KeyZ;if(A&&!atP&&state!='title')act();atP=A?1:0}}
draw();requestAnimationFrame(loop)}
requestAnimationFrame(loop);
