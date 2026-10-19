import {outfitFilters,outfitSeasons,outfitSeasonName,outfitStyleNames} from '../outfit-model.js';
import {validateAssumedBasics,basicName} from '../assumed-basics.js';
import {validateSuggestedPieces} from './suggested-pieces.js';
const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slots={outer:'Outer Layer',middle:'Mid Layer',inner:'Base Layer',bottom:'Bottoms',shoes:'Shoes',belt:'Belt',bag:'Bag',accessory:'Accessories'};
let candidates=[],withheldCandidates=[],withdrawnCandidates=[],season='all',style='all',trigger=null;
const expectedCount=Number(document.body.dataset.expectedCount);
const ready=c=>c.status==='reviewed'&&c.visual;
function assumptionSummary(c){return (c.suggestedPieces||[]).length?' · Includes an Unowned Item':(c.assumedBasics||[]).length?' · Includes an assumed basic layer':'';}
function assumptions(c){return (c.assumedBasics||[]).length?`<h3>Assumed Basic Layer</h3><ul>${c.assumedBasics.map(b=>`<li><span style="display:inline-block;width:14px;height:14px;background:${esc(b.color.hex)};border:1px solid #aaa;border-radius:50%;vertical-align:middle"></span> ${esc(basicName(b))}: ${esc(b.exposure)}</li>`).join('')}</ul><p class="notice">A user-authorized palette assumption without a photo record or garment code; not counted in the wardrobe. This label remains if selected.</p>`:'';}
function suggestions(c){return c.suggestedPieces?.length?`<section data-shopping-concept><h3>Suggested Item · Not Owned</h3>${c.suggestedPieces.map(p=>`<p><strong>${esc(p.name)}</strong> · ${esc(p.color.name)}</p><p>${esc(p.reason)}</p><p>What to Look For: ${esc(p.specification)}</p>`).join('')}<p class="notice">This is a shopping direction, not an owned item or exact product image. Review it before confirming an item; this page does not add it to the wardrobe or saved outfits.</p></section>`:'';}
function comparison(c){
  if(!c.comparison)return '';
  const swap=c.comparison.kind==='garment-swap',original=swap?'Original Outfit':'Original Palette',proposal=swap?'After Item Swap':'Suggested Palette';
  return `<p class="notice">${swap?'Single-item Variation of a Saved Outfit':'Base-layer Color Variation'}: <a href="/#outfits/${encodeURIComponent(c.comparison.outfitId)}">${esc(c.comparison.code)} Original Outfit</a>. The original record and image are unchanged.</p>${c.comparison.visualSrc?`<details class="color-comparison"><summary>${swap?'Compare Original and Item Swap':'Compare Original and New Palette'}</summary><div class="comparison-pair"><figure><img src="/${esc(c.comparison.visualSrc)}" alt="${esc(c.comparison.code)} ${original}" loading="lazy"><figcaption>${esc(c.comparison.code)} ${original}</figcaption></figure><figure><img src="${esc(c.visual.src)}" alt="${esc(c.code)} ${proposal}" loading="lazy"><figcaption>${esc(c.code)} ${proposal}</figcaption></figure></div></details>`:''}`;
}
function chip(id,name,count,selected,type){return `<button type="button" data-${type}="${esc(id)}" aria-pressed="${id===selected}">${esc(name)}<small>${count}</small></button>`;}
function render(){
  const f=outfitFilters(candidates,{season,style});season=f.season;style=f.style;
  $('seasons').innerHTML=chip('all','All',candidates.length,season,'season')+f.seasons.map(s=>chip(s.id,s.name,s.count,season,'season')).join('');
  $('styles').innerHTML=chip('all','All Styles',f.inSeason.length,style,'style')+f.styles.map(s=>chip(s.id,s.name,s.count,style,'style')).join('');
  const q=$('query').value.trim().toLowerCase(),visible=f.visible.filter(c=>!q||[c.code,c.title,c.comparison?.code,...c.garments.flatMap(g=>[g.code,g.name]),...(c.suggestedPieces||[]).flatMap(p=>[p.name,p.color.name,'Not Owned'])].join(' ').toLowerCase().includes(q));
  $('count').textContent=`${visible.length} looks · ${visible.filter(ready).length} reviewed images`;
  $('grid').innerHTML=visible.map(c=>`<article class="card"><button type="button" class="image-button" data-code="${c.code}" aria-label="View  ${c.code} ${esc(c.title)}" ${ready(c)?'':'disabled'}>${ready(c)?`<img src="${esc(c.visual.thumbnail)}" width="480" height="720" alt="${esc(c.title)}, AI outfit visualization" loading="lazy">`:'<span class="placeholder">Image in Progress<small>Available after review</small></span>'}<span class="code">${c.code}</span></button><h3>${esc(c.title)}</h3><p class="meta">${outfitSeasonName(c.season)} · ${outfitStyleNames(c).join(' / ')}${ready(c)?' · AI illustration':''}</p><p class="garment-codes">${c.garments.map(g=>g.code).join(' · ')}</p></article>`).join('');
  $('grid').querySelectorAll('.card .meta').forEach((el,n)=>{el.textContent+=assumptionSummary(visible[n]);});
  $('empty').hidden=visible.length>0;
}
function openCandidate(code){
  const c=candidates.find(c=>c.code===code);if(!c){const held=[...withheldCandidates,...withdrawnCandidates].find(c=>c.code===code);$('error').textContent=held?`${held.code}: ${held.reason}`:'Candidate not found. Check the HX code.';$('error').hidden=false;return;}
  if(!ready(c)){$('error').textContent=`${code}  image is still under review. Please check later.`;$('error').hidden=false;return;}
  $('error').hidden=true;
  $('detail-body').innerHTML=`<img class="detail-visual" src="${esc(c.visual.src)}" alt="${esc(c.title)}, AI outfit visualization"><section class="detail-copy"><div class="detail-code">${c.code}</div><h2 id="detail-title">${esc(c.title)}</h2><p class="meta">${outfitSeasonName(c.season)} · ${outfitStyleNames(c).join(' / ')}</p><p class="notice">To select this outfit, tell me “${c.code}”. This page does not save choices or add outfits automatically.</p><h3>How to Wear It</h3><ol>${c.wearingNotes.map(n=>`<li>${esc(n)}</li>`).join('')}</ol><h3>Your Garments in This Look</h3><div class="pieces">${c.garments.map(g=>`<a class="piece" href="/${esc(g.asset)}" target="_blank" rel="noopener" aria-label="Open in a new tab:  ${g.code} garment cutout"><img src="/${esc(g.asset)}" alt="${esc(g.name)}" loading="lazy"><strong>${g.code}</strong>${esc(g.name)}<br><span>${slots[g.slot]||esc(g.slot)}</span></a>`).join('')}</div><p class="notice">AI outfit visualization, not an exact fit or size preview. Verify patterns and fabric details against the actual garments.</p></section>`;
  $('detail-body').querySelector('.detail-copy').insertAdjacentHTML('beforeend',assumptions(c)+suggestions(c)+comparison(c));
  if(!$('detail').open)$('detail').showModal();$('detail').scrollTop=0;$('close').focus();
}
function syncHash(){let code;try{code=decodeURIComponent(location.hash.slice(1));}catch{code='invalid';}if(code)openCandidate(code.toUpperCase());else if($('detail').open)$('detail').close();}
$('seasons').addEventListener('click',e=>{const b=e.target.closest('[data-season]');if(!b)return;season=b.dataset.season;style='all';render();$('seasons').querySelector('[aria-pressed=true]')?.focus();});
$('styles').addEventListener('click',e=>{const b=e.target.closest('[data-style]');if(!b)return;style=b.dataset.style;render();$('styles').querySelector('[aria-pressed=true]')?.focus();});
$('query').addEventListener('input',render);
$('grid').addEventListener('click',e=>{const b=e.target.closest('[data-code]');if(!b||b.disabled)return;trigger=b;location.hash=b.dataset.code;});
$('close').addEventListener('click',()=>$('detail').close());
$('detail').addEventListener('close',()=>{history.replaceState(null,'',location.pathname+location.search);trigger?.focus({preventScroll:true});});
window.addEventListener('hashchange',syncHash);
try{
  const response=await fetch('candidates.json',{cache:'no-store'});if(!response.ok)throw Error('HTTP '+response.status);
  const data=await response.json();if(!Number.isSafeInteger(expectedCount)||expectedCount<1||!Array.isArray(data.candidates)||data.candidates.length!==expectedCount)throw Error('Candidate list is incomplete');
  if(new Set(data.candidates.map(c=>c.code)).size!==expectedCount||data.candidates.some(c=>!/^HX\d{3,}$/.test(c.code)||!Array.isArray(c.garments)||!Array.isArray(c.wearingNotes)))throw Error('Invalid candidate code or content');
  for(const c of data.candidates){
    validateAssumedBasics(c.assumedBasics);validateSuggestedPieces(c.suggestedPieces);
    if(c.suggestedPieces?.some(p=>c.selection?.[p.slot]))throw Error('Suggested and owned pieces cannot occupy the same slot');
    if(c.comparison?.visualSrc&&!/^assets\/outfits\/[\w/-]+\.(png|jpg|webp)$/.test(c.comparison.visualSrc))throw Error('Invalid original outfit image path');
  }
  const held=data.withheldCandidates||[];
  if(!Array.isArray(held)||held.some(c=>!/^HX\d{3,}$/.test(c.code)||typeof c.reason!=='string'||!c.reason.trim()||data.candidates.some(active=>active.code===c.code))||new Set(held.map(c=>c.code)).size!==held.length)throw Error('Invalid withheld candidate');
  withheldCandidates=held;
  const removed=data.withdrawnCandidates||[];
  if(!Array.isArray(removed)||removed.some(c=>!/^HX\d{3,}$/.test(c.code)||typeof c.reason!=='string'||!c.reason.trim()||data.candidates.some(active=>active.code===c.code)||held.some(h=>h.code===c.code))||new Set(removed.map(c=>c.code)).size!==removed.length)throw Error('Invalid withdrawn candidate');
  withdrawnCandidates=removed;
  candidates=data.candidates;const complete=candidates.filter(ready).length;
  $('progress').textContent=`${complete} / ${expectedCount} reviewed images · ${outfitSeasons.map(s=>s.name+' '+candidates.filter(c=>c.season===s.id).length).join(' / ')}`;render();syncHash();
}catch(error){$('progress').textContent='Unable to Load Candidates';$('error').textContent='Candidates are unavailable. Reload the page to retry.';$('error').hidden=false;console.error(error);}
