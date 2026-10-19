import { layers } from '../garment-model.js';
import { esc,cutoutImage,codeBadge,garmentImageBadge } from './shared.js';
import {isReconstructed,imageNotice} from '../garment-image.js';
import {garmentClassification,garmentCategories,garmentFacets} from '../data/garment-taxonomy.js';
import {isPendingDiscard} from '../garment-status.js';
import {outfitTitle} from '../outfit-model.js';

export function garmentOutfits(outfits,status='ready'){
  if(status==='loading')return '<h3>Used in These Outfits</h3><p role="status">Loading outfit links…</p>';
  if(status!=='ready'||outfits===null)return '<h3>Used in These Outfits</h3><p role="status">Outfit links are unavailable; usage cannot be determined.</p><button class="text-button" data-resource-retry="personal">Retry</button>';
  return `<h3>Used in ${outfits.length} saved outfits</h3><p class="sources">Counts links in My Outfits, not actual wears.</p>${outfits.length?`<div class="related-outfits">${outfits.map(o=>`<a data-related-outfit href="#outfits/${encodeURIComponent(o.id)}" title="${esc(outfitTitle(o))}" aria-label="View  ${esc(o.code||o.id)}: ${esc(outfitTitle(o))}">${codeBadge(o)}<span>${esc(outfitTitle(o))}</span></a>`).join('')}</div>`:'<p>No saved outfits currently use this garment.</p>'}`;
}

export function detailDialog(item,{outfits=null,status='loading'}={}) {
  const layer = layers.find(x => x.id === item.layer);
  const traits=garmentClassification(item);
  return `<div class="dialog-head">${codeBadge(item)}<h2 id="detail-title">${esc(item.name)}</h2><button class="close-btn" data-close="detail" aria-label="Close details">×</button></div>
    <div class="detail-grid"><div>
      <img id="detail-image" class="detail-image" src="${esc(cutoutImage(item))}" alt="${esc(item.name)}">
      ${isReconstructed(item)?`<p class="sources" data-image-notice>${imageNotice}</p>`:''}
    </div><div class="detail-meta">
      <span class="privacy-badge">${isReconstructed(item)?'Owned garment':'Actual garment'}</span> ${garmentImageBadge(item)}
      ${isPendingDiscard(item)?'<p class="note-block">Ready to Let Go · Records and images are kept; excluded from new outfits. Use its code in Codex to restore it.</p>':''}
      <section class="garment-outfits" data-garment-outfits="${esc(item.id)}">${garmentOutfits(outfits,status)}</section>
      <dl><dt>Category / Type</dt><dd>${layer.name} / ${garmentCategories[traits.category]}</dd>
        <dt>Recorded Style</dt><dd>${esc(item.subtype)}</dd>
        <dt>Neckline / Sleeves</dt><dd>${garmentFacets.neckline[traits.neckline]} / ${garmentFacets.sleeve[traits.sleeve]}</dd>
        <dt>Color / Fit</dt><dd>${esc(item.color.name)} / ${esc(item.fit)}</dd>
        ${item.userConfirmedDetails?.length?`<dt>Confirmed by You</dt><dd>${esc(item.userConfirmedDetails.join('; '))}</dd>`:''}
        <dt>Pattern / Texture</dt><dd>${esc(item.pattern||'Unconfirmed')} / ${esc(item.texture||'Unconfirmed')}</dd>
        <dt>Material / Warmth</dt><dd>${esc(item.material || 'Unconfirmed')} / ${esc(item.warmth || 'Unconfirmed')}</dd></dl>
      <div class="receipt">Internal Record ID <code>${esc(item.id)}</code><p>Check image details against the actual garment.</p>${esc(item.uncertainties.join('; '))}</div>
    </div></div>`;
}
