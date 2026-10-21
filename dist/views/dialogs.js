import { layers } from '../garment-model.js';
import { esc,cutoutImage,codeBadge,garmentImageBadge,countLabel,itemTerm,closeButton } from './shared.js';
import {isReconstructed,imageNotice} from '../garment-image.js';
import {garmentClassification,garmentCategories,garmentFacets,subtypeLabel} from '../data/garment-taxonomy.js';
import {isPendingDiscard} from '../garment-status.js';
import {outfitTitle} from '../outfit-model.js';

export function garmentOutfits(outfits,status='ready'){
  if(status==='loading')return '<h3>Saved outfits</h3><p role="status">Checking outfits for this item…</p>';
  if(status!=='ready'||outfits===null)return '<h3>Saved outfits</h3><p role="status">Couldn’t check which outfits use this item.</p><button type="button" class="text-button" data-resource-retry="personal">Try again</button>';
  return `<h3>${countLabel(outfits.length,'saved outfit')}</h3><p class="sources">Outfits that include this item, not a count of times worn. Looks with unpurchased pieces are labeled.</p>${outfits.length?`<div class="related-outfits">${outfits.map(o=>`<a data-related-outfit href="#outfits/${encodeURIComponent(o.id)}" title="${esc(outfitTitle(o))}" aria-label="View outfit ${esc(o.code||o.id)}: ${esc(outfitTitle(o))}">${codeBadge(o)}<span>${esc(outfitTitle(o))}${o.outfitKind==='planned'?' · Includes unpurchased items':''}</span></a>`).join('')}</div>`:'<p>This item isn’t in any saved outfits yet.</p>'}`;
}

export function detailDialog(item,{outfits=null,status='loading'}={}) {
  const layer = layers.find(x => x.id === item.layer);
  const traits=garmentClassification(item);
  const upper=['outer','inner'].includes(item.layer),known=value=>esc(itemTerm(value));
  return `<div class="dialog-head">${codeBadge(item)}<h2 id="detail-title">${esc(item.name)}</h2>${closeButton('detail','Close item details')}</div>
    <div class="detail-grid"><div>
      <img id="detail-image" class="detail-image" src="${esc(cutoutImage(item))}" alt="${esc(item.name)}">
      ${isReconstructed(item)?`<p class="sources" data-image-notice>${imageNotice}</p>`:''}
    </div><div class="detail-meta">
      <span class="privacy-badge">Owned item</span> ${garmentImageBadge(item)}
      ${isPendingDiscard(item)?'<p class="note-block">Set aside, not deleted. This item won’t be suggested for new outfits. Use its code in Codex chat to move it back to your wardrobe.</p>':''}
      <section class="garment-outfits" data-garment-outfits="${esc(item.id)}">${garmentOutfits(outfits,status)}</section>
      <dl><dt>Category</dt><dd>${esc(layer?.name||'Uncategorized')} / ${garmentCategories[traits.category]}</dd>
        <dt>Item type</dt><dd>${known(subtypeLabel(item.subtype))}</dd>
        ${upper?`<dt>Neckline</dt><dd>${garmentFacets.neckline[traits.neckline]}</dd><dt>Sleeves</dt><dd>${garmentFacets.sleeve[traits.sleeve]}</dd>`:''}
        <dt>Color</dt><dd>${known(item.color?.name)}</dd><dt>Fit</dt><dd>${known(item.fit)}</dd>
        ${item.userConfirmedDetails?.length?`<dt>You confirmed</dt><dd>${esc(item.userConfirmedDetails.join('; '))}</dd>`:''}
        <dt>Pattern</dt><dd>${known(item.pattern)}</dd><dt>Texture</dt><dd>${known(item.texture)}</dd>
        <dt>Material</dt><dd>${known(item.material)}</dd><dt>Warmth</dt><dd>${known(item.warmth)}</dd></dl>
      <div class="receipt"><h3>Details to check</h3><p>Use the original item to confirm image details and fit.</p>${item.uncertainties?.length?`<ul>${item.uncertainties.map(note=>`<li>${esc(note)}</li>`).join('')}</ul>`:''}<details><summary>Record details</summary><p>Record ID: <code>${esc(item.id)}</code></p></details></div>
    </div></div>`;
}
