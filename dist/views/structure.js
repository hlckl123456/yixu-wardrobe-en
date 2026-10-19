import {layers,wardrobeStructure} from '../garment-model.js';
import {esc,intro,countLabel,actionText,uiNames} from './shared.js';
import {isActiveGarment} from '../garment-status.js';
function categoryButtons(items,selected,attribute){
  return `<div class="wardrobe-tabs" role="group" aria-label="Choose an item category">${layers.map(l=>`<button type="button" class="btn" data-${attribute}="${l.id}" aria-pressed="${selected===l.id}">${l.name}<span>${countLabel(items.filter(i=>i.layer===l.id).length,'item')}</span></button>`).join('')}</div>`;
}
const emptyCategory=name=>`<div class="empty">No items in ${esc(name.toLowerCase())} yet.<br>Send photos in Codex chat to add some.</div>`;

export function analysis({items,analysisLayer='outer'}){return intro(uiNames.analysis,'See the colors you own in each category. Items set aside in Ready to let go aren’t included.')+structure(items.filter(isActiveGarment),analysisLayer);}
function structure(items,analysisLayer){
  const layer=layers.find(l=>l.id===analysisLayer)||layers[0];
  const groups=wardrobeStructure(items,layer.id);
  return categoryButtons(items,layer.id,'analysis-layer')
    +`<section class="structure-panel"><h2>${layer.name}: colors by item type</h2>${groups.length?`<div class="structure-table"><table><thead><tr><th scope="col">Item type</th><th scope="col">Colors</th><th scope="col">Items</th></tr></thead><tbody>${groups.map(g=>`<tr><th scope="row">${esc(g.name)}</th><td>${g.colors.map(c=>`<span class="structure-color"><i class="dot" style="--swatch:${esc(c.hex)}" aria-hidden="true"></i>${esc(c.name)} <b>${c.count}</b></span>`).join('')}</td><td><button type="button" class="btn" data-inspect-layer="${layer.id}" data-inspect-group="${esc(g.id)}" aria-label="View ${countLabel(g.items.length,'item')} in ${esc(g.name.toLowerCase())}">${actionText(countLabel(g.items.length,'item'))}</button></td></tr>`).join('')}</tbody></table></div>`:emptyCategory(layer.name)}<p class="flow-hint">Colors are grouped by item type. Swatches are a guide, not an exact color match.</p></section>`;
}
