import {icon,countLabel} from './shared.js';
import {dataStatus} from './data-status.js';
import {mixListHref} from '../outfit-model.js';
import {outfitFilterControls,outfitCards} from './outfits.js';

export function mixOutfits({items=[],mixPool=[],mixFilters,mixBatch,personalStatus='ready',catalogStatus='ready'}){
  const intro='<div class="intro lookbook-intro"><div><span class="eyebrow">OUTFIT SHUFFLE</span><h1>Outfit shuffle</h1><p>Choose a range and see four looks at a time.</p></div></div>';
  if(personalStatus!=='ready')return intro+dataStatus('personal','Saved outfits',personalStatus);
  if(catalogStatus!=='ready')return intro+dataStatus('catalog','Wardrobe items',catalogStatus);
  const {outfits,total,batchNumber,canAdvance}=mixBatch;
  const query=new URLSearchParams({from:'mix'});
  if(mixFilters.season!=='all')query.set('season',mixFilters.season);
  if(mixFilters.style!=='all')query.set('style',mixFilters.style);
  return intro+outfitFilterControls(mixPool,mixFilters,{href:mixListHref})+
    `<div class="outfit-page-tools mix-toolbar"><span role="status" aria-live="polite" aria-atomic="true">Batch ${batchNumber} · ${countLabel(outfits.length,'outfit')} shown · ${countLabel(total,'outfit')} in range</span><button class="btn primary" type="button" data-mix-next ${canAdvance?'':'disabled'}>${icon('shuffle')}Shuffle again</button></div>
    <p class="lookbook-disclaimer">Drawn from saved illustrated outfits using active items. Unseen looks appear first. AI previews are not photos of you wearing the clothes.</p>
    ${total>0&&!canAdvance?`<p class="mix-pool-note">Only ${countLabel(total,'outfit')} in this range; all are shown. Widen the filters to see more.</p>`:''}
    <div class="outfits-grid real-outfits mix-outfits">${outfits.length?outfitCards(outfits,items,{query:query.toString()}):`<section class="empty"><h2>${mixPool.length?'No available outfits in this range':'No saved outfits available yet'}</h2><p>${mixPool.length?'Try another season or style.':'Browse My outfits or add a look you like through Codex chat.'}</p><a class="btn" href="${mixPool.length?'#mix':'#outfits'}">${mixPool.length?'View all ranges':'View my outfits'}</a></section>`}</div>`;
}
