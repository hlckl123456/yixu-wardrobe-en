import {layers} from './garment-model.js';
import {isActiveGarment} from './garment-status.js';
import {esc,countLabel} from './views/shared.js';

const categoryColors=Array.from({length:5},(_,i)=>`var(--chart-${i+1})`);
const familyNames={black:'Black',white:'White',gray:'Gray',grey:'Gray',brown:'Brown',beige:'Beige',blue:'Blue',navy:'Navy',green:'Green',red:'Red',burgundy:'Burgundy',yellow:'Yellow',pink:'Pink',purple:'Purple',orange:'Orange',multicolor:'Multicolor',unknown:'Unconfirmed'};
const safeColor=hex=>/^#[a-f\d]{6}$/i.test(hex||'')?hex:'#b5aa98';
export function closetOverviewData(items){
 const active=items.filter(isActiveGarment),families=new Map();
 for(const item of active){const id=item.color?.family||'unknown';if(!families.has(id))families.set(id,{id,name:familyNames[id]||item.color?.name||'Unconfirmed',hex:safeColor(item.color?.hex),count:0});families.get(id).count++;}
 const sorted=[...families.values()].sort((a,b)=>b.count-a.count);
 const colors=sorted.length>6?[...sorted.slice(0,5),{id:'other',name:'Other colors',hex:'#c5beaf',count:sorted.slice(5).reduce((sum,c)=>sum+c.count,0)}]:sorted;
 return {total:active.length,categories:layers.map((l,i)=>({id:l.id,name:l.name,count:active.filter(item=>item.layer===l.id).length,hex:categoryColors[i]})),colors};
}
export function closetOverview(items){
 const {total,categories,colors}=closetOverviewData(items),circumference=2*Math.PI*67;
 let offset=0;
 const arcs=categories.map(c=>{const length=total?c.count/total*circumference:0,arc=`<circle cx="100" cy="100" r="67" fill="none" stroke="${c.hex}" stroke-width="23" stroke-dasharray="${length} ${circumference}" stroke-dashoffset="${-offset}" transform="rotate(-90 100 100)"/>`;offset+=length;return arc;}).join('');
 return `<section class="closet-overview" id="closet-overview" aria-label="Wardrobe overview"><div class="overview-charts"><section><h2>Item categories</h2><div class="category-chart"><svg viewBox="0 0 200 200" role="img" aria-label="${esc(categories.map(c=>`${c.name}: ${countLabel(c.count,'item')}`).join(', '))}"><circle cx="100" cy="100" r="67" fill="none" stroke="var(--chart-track)" stroke-width="23"/>${arcs}<text x="100" y="99" text-anchor="middle" class="donut-total">${total}</text><text x="100" y="120" text-anchor="middle" class="donut-label">active items</text></svg><ul>${categories.map(c=>`<li><i style="background:${c.hex}" aria-hidden="true"></i><span>${c.name}</span><b>${c.count}</b></li>`).join('')}</ul></div></section><section><h2>Top color families</h2><svg class="color-chart" viewBox="0 0 390 218" role="img" aria-label="${esc(colors.map(c=>`${c.name}: ${countLabel(c.count,'item')}`).join(', ')||'No items yet')}">${colors.map((c,i)=>{const y=20+i*33;return `<text x="0" y="${y+4}">${esc(c.name)}</text><rect x="80" y="${y-8}" width="260" height="14" rx="3" fill="var(--chart-track)"/><rect x="80" y="${y-8}" width="${total?c.count/total*260:0}" height="14" rx="3" fill="${c.hex}"/><text x="382" y="${y+4}" text-anchor="end">${c.count}</text>`;}).join('')}</svg></section></div><p class="overview-note">Based on active wardrobe records. Color swatches indicate families, not precise color measurements.</p></section>`;
}
