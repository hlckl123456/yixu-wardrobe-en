import {esc,thumbnail,codeBadge,garmentImageBadge,countLabel,actionText,closeButton,uiNames} from './shared.js';
import {displayCode} from '../communication-codes.js';
import {compactSelection} from '../data-schema.js';
import {ownedCard} from './owned.js';
import {roleNames} from '../garment-model.js';
import {outfitFilters,outfitListHref,outfitTitle,outfitSeasonName,outfitStyleNames} from '../outfit-model.js';
import {dataStatus} from './data-status.js';
import {basicName} from '../assumed-basics.js';

const visualLabel=outfit=>(outfit.visual.kind==='ai'?'AI outfit preview':'Outfit photo')+(outfit.assumedBasics?.length?' · Unverified base layer':'');
const visualDescription=outfit=>`${outfitTitle(outfit)}. ${outfit.wearingNotes?.[0]||visualLabel(outfit)}`;
function assumptionDetails(outfit){
  if(!outfit.assumedBasics?.length)return '';
  return `<div class="sources" data-assumed-basics><p>Basic layer with no photo on file. Included as an assumption you approved, not counted as a wardrobe item.</p><ul>${outfit.assumedBasics.map(b=>`<li>${esc(basicName(b))}: ${esc(b.exposure)} Keep the visible edge to ${b.maxVisibleBandCm} cm or less.</li>`).join('')}</ul></div>`;
}
function outfitHero(outfit,items,catalogStatus='ready'){
  if(outfit.visual)return `<button type="button" class="outfit-visual" data-owned-image="${esc(outfit.id)}" aria-label="View larger image: ${esc(outfitTitle(outfit))}"><img src="${esc(outfit.visual.src)}" alt="${esc(visualDescription(outfit))}" loading="lazy" width="1024" height="1536"><span>${visualLabel(outfit)}<b>${actionText('View larger','expand')}</b></span></button>`;
  if(catalogStatus!=='ready')return dataStatus('catalog','Wardrobe items',catalogStatus);
  return `<div class="outfit-composition">${Object.entries(compactSelection(outfit.selection)).map(([slot,id])=>{const item=items.find(i=>i.id===id);return `<div class="outfit-piece"><span>${roleNames[slot]}</span>${item?`<img src="${esc(thumbnail(item))}" alt="${esc(item.name)}" loading="lazy">${garmentImageBadge(item)}`:`<p>Item ${esc(id)} is unavailable.</p>`}</div>`;}).join('')}</div><p class="outfit-caption">Items in this outfit · No preview image yet</p>`;
}
function garmentIds(outfit,items,catalogStatus='ready'){
  if(catalogStatus!=='ready')return `<p class="sources">${Object.values(compactSelection(outfit.selection)).map(esc).join(' · ')} · Records unavailable</p>`;
  return `<div class="outfit-id-list" aria-label="Items in this outfit">${Object.entries(compactSelection(outfit.selection)).map(([slot,id])=>{const item=items.find(i=>i.id===id);return item?`<button type="button" class="outfit-id" data-detail="${esc(id)}" title="${esc(item.name)}" aria-label="View ${roleNames[slot].toLowerCase()} ${esc(displayCode(item))}: ${esc(item.name)}">${roleNames[slot]} <b>${esc(displayCode(item))}</b></button>`:`<span class="outfit-id">Item ${esc(id)} is unavailable</span>`;}).join('')}</div>`;
}
const categories=outfit=>[outfitSeasonName(outfit.season),...outfitStyleNames(outfit)].join(' · ');
function filters(outfits,state){
  const link=(href,label,count,active)=>`<a class="btn" href="${href}" ${active?'aria-current="page"':''}>${label}<span>${countLabel(count,'outfit')}</span></a>`;
  return `<div class="outfit-filters"><nav class="wardrobe-tabs owned-layers" aria-label="Filter outfits by season">${link('#outfits','All',outfits.length,state.season==='all')}${state.seasons.map(s=>link(outfitListHref({season:s.id}),s.name,s.count,state.season===s.id)).join('')}</nav><nav class="wardrobe-tabs subcategory-tabs" aria-label="Filter outfits by style">${link(outfitListHref({season:state.season}),'All styles',state.inSeason.length,state.style==='all')}${state.styles.map(s=>link(outfitListHref({season:state.season,style:s.id}),s.name,s.count,state.style===s.id)).join('')}</nav></div>`;
}
export function realOutfits({outfits=[],items=[],dataError=false,personalStatus='ready',catalogStatus='ready',referenceStatus='ready',resolveReference=()=>null,relationships=null,outfitId=null,outfitSeason='all',outfitStyle='all'}){
  if(personalStatus==='loading')return `<div class="intro"><h1>${uiNames.outfits}</h1></div>`+dataStatus('personal',uiNames.outfits,'loading');
  const state=outfitFilters(outfits,{season:outfitSeason,style:outfitStyle});
  const selected=outfitId&&outfits.find(o=>o.id===outfitId||o.code===outfitId);
  if(outfitId&&!dataError)return selected?outfitDetail(selected,items,state,catalogStatus,resolveReference,referenceStatus,relationships):`<div class="intro"><div><h1>Outfit not found</h1><p>It may have been removed, or the link may be out of date.</p><a class="btn" href="#outfits">${actionText('Back to outfits','arrow-left')}</a></div></div>`;
  const query=outfitListHref(state).split('?')[1];
  return `<div class="intro lookbook-intro"><div><span class="eyebrow">YOUR SAVED LOOKS</span><h1>${uiNames.outfits}</h1><p>Outfits you’ve chosen, made with clothes you own. Any unverified basic layers are clearly labeled.</p></div></div>
    ${!dataError?filters(outfits,state):''}<div class="outfit-page-tools"><span role="status">${dataError?'Outfits unavailable':countLabel(state.visible.length,'outfit')}</span><a class="text-button" href="#formulas/notes">${uiNames.notes}</a></div>
    <p class="lookbook-disclaimer">AI previews show outfit ideas, not how clothes will fit you. Check the actual items before wearing.</p>
    ${!dataError?dataStatus('catalog','Wardrobe items',catalogStatus):''}
    <div class="outfits-grid real-outfits">${dataError?'<p>Your outfits will appear here when the connection is restored.</p>':state.visible.map(o=>`<article class="real-outfit-card" data-outfit-id="${esc(o.id)}">${outfitHero(o,items,catalogStatus)}<div class="outfit-card-copy"><a class="code-link" href="#outfits/${encodeURIComponent(o.id)}${query?'?'+query:''}" aria-label="View outfit ${esc(o.code||o.id)}">${codeBadge(o)}</a><p class="outfit-category">${categories(o)}</p><h2><a href="#outfits/${encodeURIComponent(o.id)}${query?'?'+query:''}">${esc(outfitTitle(o))}</a></h2>${o.wearingNotes?.length?`<p class="outfit-wearing-cue">${esc(o.wearingNotes[0])}</p>`:''}${garmentIds(o,items,catalogStatus)}<a class="outfit-card-link text-button" href="#outfits/${encodeURIComponent(o.id)}${query?'?'+query:''}" aria-label="View outfit ${esc(o.code||o.id)}: ${esc(outfitTitle(o))}">${actionText('View outfit')}</a></div></article>`).join('')||`<section class="empty"><h2>${outfits.length?'No outfits match these filters':'No saved outfits yet'}</h2><p>${outfits.length?'Try another season or style, or view all your outfits.':'Share your clothes and outfit ideas in Codex chat, then save the looks you want to keep.'}</p><a class="btn" href="${outfits.length?'#outfits':'#closet'}">${outfits.length?'View all outfits':'Browse my wardrobe'}</a></section>`}</div>
    `;
}
function outfitDetail(outfit,items,state,catalogStatus,resolveReference,referenceStatus,relationships){
  const href=resolveReference(outfit.sourceReference||outfit.route);
  const hasReference=outfit.sourceReference||/^#(?:formulas|workbench|analysis)\/[^?/#]+/.test(outfit.route||'');
  const reference=href?`<a class="text-button" href="${esc(href)}">${actionText('View the inspiration')}</a>`:hasReference?`<p class="sources">The inspiration link is unavailable. This outfit is still saved.</p>`:'';
  const origin=relationships?.origins.find(r=>r.outfitId===outfit.id);
  const derived=outfit.derivedFromOutfitId?(origin?origin.available?`<p class="sources">A variation of <a class="text-button" data-outfit-origin href="#outfits/${encodeURIComponent(origin.sourceId)}">${actionText(origin.sourceCode||origin.sourceTitle)}</a></p>`:'<p class="sources">The original outfit was removed. This version is still saved.</p>':'<p class="sources">The original outfit link is unavailable. This version is still saved.</p>'):'';
  const source=derived+reference;
  const garments=catalogStatus==='ready'?`<div class="flow-cards">${Object.entries(compactSelection(outfit.selection)).map(([slot,id])=>{const item=items.find(i=>i.id===id);return `<div><h3>${roleNames[slot]}</h3>${item?ownedCard(item):`<p class="empty">Item ${esc(id)} is unavailable. Its link to this outfit is kept.</p>`}</div>`;}).join('')}</div>`:dataStatus('catalog','Wardrobe items',catalogStatus);
  return `<div class="intro"><div><span class="eyebrow">${categories(outfit)}</span>${codeBadge(outfit)}<h1>${esc(outfitTitle(outfit))}</h1><p>Your chosen combination, with item details and styling notes.</p></div><a class="btn" href="${outfitListHref(state)}">${actionText('Back to outfits','arrow-left')}</a></div>
    <div class="outfit-detail-layout"><section class="outfit-detail-hero">${outfitHero(outfit,items,catalogStatus)}</section><section class="outfit-wearing"><h2>How to wear it</h2>${outfit.wearingNotes?.length?`<ul>${outfit.wearingNotes.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:'<p>No styling notes saved for this outfit yet.</p>'}${garmentIds(outfit,items,catalogStatus)}${source}<p class="sources">An AI preview isn’t a fit check. Use the actual items to confirm texture, details and fit.</p></section></div>
    <section class="outfit-garments"><h2>Items in this outfit</h2>${assumptionDetails(outfit)}${garments}</section>`;
}
export function ownedImageDialog(outfit){
  return `<div class="dialog-head">${codeBadge(outfit)}<h2 id="outfit-image-title">${esc(outfitTitle(outfit))}</h2>${closeButton('outfit-image','Close outfit image')}</div><img class="owned-lightbox-image" src="${esc(outfit.visual.src)}" alt="${esc(visualDescription(outfit))}"><p class="sources">${visualLabel(outfit)} · Check details and fit against your actual clothes.</p>${assumptionDetails(outfit)}`;
}
