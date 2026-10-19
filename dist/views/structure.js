import {layers,wardrobeStructure} from '../garment-model.js';
import {esc,intro} from './shared.js';
import {isActiveGarment} from '../garment-status.js';
function categoryButtons(items,selected,attribute){
  return `<div class="wardrobe-tabs" aria-label="Garment categories">${layers.map(l=>`<button class="btn" data-${attribute}="${l.id}" aria-pressed="${selected===l.id}">${l.name}<span>${items.filter(i=>i.layer===l.id).length} items</span></button>`).join('')}</div>`;
}
const emptyCategory=name=>`<div class="empty">No records yet for ${esc(name)}. <br>You can skip this category. Send garment photos in chat to add items.</div>`;

export function analysis({items,analysisLayer='outer'}){return intro('Wardrobe Overview','Review colors by garment category. Set-aside clothes are excluded. Open a Style Reference to see matching items.')+structure(items.filter(isActiveGarment),analysisLayer);}
function structure(items,analysisLayer){
  const layer=layers.find(l=>l.id===analysisLayer)||layers[0];
  const groups=wardrobeStructure(items,layer.id);
  return categoryButtons(items,layer.id,'analysis-layer')
    +`<section class="structure-panel"><h2>${layer.name} · Colors by Garment Type</h2>${groups.length?`<div class="structure-table"><table><thead><tr><th scope="col">Garment Type</th><th scope="col">Recorded Colors</th><th scope="col">Garments</th></tr></thead><tbody>${groups.map(g=>`<tr><th scope="row">${esc(g.name)}</th><td>${g.colors.map(c=>`<span class="structure-color"><i class="dot" style="--swatch:${esc(c.hex)}"></i>${esc(c.name)} <b>${c.count}</b></span>`).join('')}</td><td><button class="btn" data-inspect-layer="${layer.id}" data-inspect-group="${esc(g.id)}" aria-label="View ${esc(g.name)} ${g.items.length} items">${g.items.length} items ↗</button></td></tr>`).join('')}</tbody></table></div>`:emptyCategory(layer.name)}<p class="flow-hint">Review colors within each garment type rather than adding unrelated categories together. Swatches help identify colors; they are not precise measurements.</p></section>`;
}
