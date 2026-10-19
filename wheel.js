const prizes=['Десерт','Скидка 5%','Аплодисменты','Обнимашки','5% скидка на самовывоз','2 входных билета в караоке зал','Бокал вина','Фирменная настойка','Мороженое','Сертификат на следующий визит в Эмпатио на 500₽','Авторский чай','Чашечка американо','20 % скидка','Авторский коктейль'];
const icons=['🍰','🏷️','👏','🫶','🛍️','🎤','🍷','🥃','🍨','🎁','🫖','☕','🏷️','🍸'];
const labels=[['Десерт'],['Скидка','5%'],['Аплодис-','менты'],['Обнимашки'],['Самовывоз','скидка 5%'],['Караоке','2 билета'],['Бокал','вина'],['Фирменная','настойка'],['Мороженое'],['Сертификат','500₽'],['Авторский','чай'],['Чашечка','американо'],['Скидка','20 %'],['Авторский','коктейль']];
const count=prizes.length,sector=360/count;
const colors=['#664055','#eee5db','#a27889','#f6f1e9','#80566d','#dac9bc'];
const wheel=document.querySelector('.wheel'),button=document.querySelector('#spin'),outcome=document.querySelector('#outcome');
const ns='http://www.w3.org/2000/svg';
function point(angle,r=240){const a=(angle-90)*Math.PI/180;return [240+r*Math.cos(a),240+r*Math.sin(a)];}
const legend=document.querySelector('.prizes');
legend.replaceChildren();
for(let i=0;i<count;i++){
 const a=point(i*sector),b=point((i+1)*sector),path=document.createElementNS(ns,'path');
 path.setAttribute('d',`M240 240L${a}A240 240 0 0 1 ${b}Z`);path.setAttribute('fill',colors[i%colors.length]);path.setAttribute('stroke','#f6f1e9');path.setAttribute('stroke-width','1.5');wheel.append(path);
 const title=document.createElementNS(ns,'title');title.textContent=prizes[i];path.append(title);
 const group=document.createElementNS(ns,'g');group.setAttribute('transform',`rotate(${i*sector+sector/2} 240 240)`);
 const lines=labels[i].map((text,n)=>[text,65+n*15,11.5]);lines.push([icons[i],120,22]);
 for(const [text,y,size] of lines){const el=document.createElementNS(ns,'text');el.setAttribute('x','240');el.setAttribute('y',y);el.setAttribute('text-anchor','middle');el.setAttribute('fill',i%2===0?'#fff':'#30252e');el.setAttribute('font-size',size);el.setAttribute('font-family','Segoe UI, sans-serif');el.setAttribute('font-weight','600');el.textContent=text;group.append(el);}wheel.append(group);
 const item=document.createElement('span');item.textContent=`${icons[i]} ${prizes[i]}`;legend.append(item);
}
let angle=0,busy=false;
function randomIndex(){const value=new Uint32Array(1),limit=Math.floor(4294967296/count)*count;do{crypto.getRandomValues(value);}while(value[0]>=limit);return value[0]%count;}
button.addEventListener('click',async()=>{
 if(busy)return;busy=true;button.disabled=true;button.textContent='Колесо крутится…';outcome.textContent='✦';
 const index=randomIndex(),jitter=(Math.random()-.5)*sector*.5,target=((360-index*sector-sector/2+jitter)%360+360)%360;
 const next=angle+360*6+((target-angle%360+360)%360);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 try{const animation=wheel.animate([{transform:`rotate(${angle}deg)`},{transform:`rotate(${next}deg)`}],{duration:reduced?120:4800,easing:'cubic-bezier(.12,.75,.12,1)',fill:'forwards'});await animation.finished;wheel.style.transform=`rotate(${next}deg)`;animation.cancel();angle=next;outcome.textContent=`${icons[index]} ${prizes[index]}`;}
 finally{busy=false;button.disabled=false;button.textContent='Вращать ещё ↗';}
});
