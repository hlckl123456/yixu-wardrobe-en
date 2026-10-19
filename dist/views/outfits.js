import {esc,thumbnail,codeBadge,garmentImageBadge} from './shared.js';
import {displayCode} from '../communication-codes.js';
import {compactSelection} from '../data-schema.js';
import {ownedCard} from './owned.js';
import {roleNames} from '../garment-model.js';
import {outfitFilters,outfitListHref,outfitTitle,outfitSeasonName,outfitStyleNames} from '../outfit-model.js';
import {dataStatus} from './data-status.js';
import {basicName} from '../assumed-basics.js';

const visualLabel=outfit=>(outfit.visual.kind==='ai'?'AI outfit visualization':'Real outfit photo')+(outfit.assumedBasics?.length?' · Includes an assumed basic layer':'');
const visualDescription=outfit=>`${outfitTitle(outfit)}. ${outfit.wearingNotes?.[0]||visualLabel(outfit)}`;
function assumptionDetails(outfit){
  if(!outfit.assumedBasics?.length)return '';
  return `<div class="sources" data-assumed-basics><p>Assumed basic layer · Included with your permission; not counted as a verified wardrobe item.</p><ul>${outfit.assumedBasics.map(b=>`<li>${esc(basicName(b))}: ${esc(b.exposure)}; Only a narrow band is visible (up to ${b.maxVisibleBandCm} cm). </li>`).join('')}</ul></div>`;
}
function outfitHero(outfit,items,catalogStatus='ready'){
  if(outfit.visual)return `<button class="outfit-visual" data-owned-image="${esc(outfit.id)}" aria-label="Enlarge outfit: ${esc(outfitTitle(outfit))}"><img src="${esc(outfit.visual.src)}" alt="${esc(visualDescription(outfit))}" loading="lazy" width="1024" height="1536"><span>${visualLabel(outfit)}<b>Enlarge ↗</b></span></button>`;
  if(catalogStatus!=='ready')return dataStatus('catalog','Garment Records',catalogStatus);
  return `<div class="outfit-composition">${Object.entries(compactSelection(outfit.selection)).map(([slot,id])=>{const item=items.find(i=>i.id===id);return `<div class="outfit-piece"><span>${roleNames[slot]}</span>${item?`<img src="${esc(thumbnail(item))}" alt="${esc(item.name)}" loading="lazy">${garmentImageBadge(item)}`:`<p>Garments ${esc(id)} is not currently in the catalog</p>`}</div>`;}).join('')}</div><p class="outfit-caption">Your actual garments · Outfit visualization not yet available</p>`;
}
function garmentIds(outfit,items,catalogStatus='ready'){
  if(catalogStatus!=='ready')return `<p class="sources">${Object.values(compactSelection(outfit.selection)).map(esc).join(' · ')} · Records unavailable</p>`;
  return `<div class="outfit-id-list" aria-label="Garment codes in this outfit">${Object.entries(compactSelection(outfit.selection)).map(([slot,id])=>{const item=items.find(i=>i.id===id);return item?`<button class="outfit-id" data-detail="${esc(id)}" title="${esc(item.name)}" aria-label="${roleNames[slot]} ${esc(displayCode(item))}: ${esc(item.name)}">${roleNames[slot]} <b>${esc(displayCode(item))}</b></button>`:`<span class="outfit-id">${esc(id)} is not currently in the catalog</span>`;}).join('')}</div>`;
}
const categories=outfit=>[outfitSeasonName(outfit.season),...outfitStyleNames(outfit)].join(' · ');
function filters(outfits,state){
  const link=(href,label,count,active)=>`<a class="btn" href="${href}" ${active?'aria-current="page"':''}>${label}<span>${count} looks</span></a>`;
  return `<div class="outfit-filters"><nav class="wardrobe-tabs owned-layers" aria-label="Outfit season">${link('#outfits','All',outfits.length,state.season==='all')}${state.seasons.map(s=>link(outfitListHref({season:s.id}),s.name,s.count,state.season===s.id)).join('')}</nav><nav class="wardrobe-tabs subcategory-tabs" aria-label="Outfit style">${link(outfitListHref({season:state.season}),'All Styles',state.inSeason.length,state.style==='all')}${state.styles.map(s=>link(outfitListHref({season:state.season,style:s.id}),s.name,s.count,state.style===s.id)).join('')}</nav></div>`;
}
export function realOutfits({outfits=[],items=[],dataError=false,personalStatus='ready',catalogStatus='ready',referenceStatus='ready',resolveReference=()=>null,relationships=null,outfitId=null,outfitSeason='all',outfitStyle='all'}){
  if(personalStatus==='loading')return '<div class="intro"><h1>My Outfits</h1></div>'+dataStatus('personal','My Outfits','loading');
  const state=outfitFilters(outfits,{season:outfitSeason,style:outfitStyle});
  const selected=outfitId&&outfits.find(o=>o.id===outfitId||o.code===outfitId);
  if(outfitId&&!dataError)return selected?outfitDetail(selected,items,state,catalogStatus,resolveReference,referenceStatus,relationships):'<div class="intro"><div><h1>Outfit Not Found</h1><p>The record may not have synced yet. Existing outfits have not been changed.</p><a class="btn" href="#outfits">Back to My Outfits</a></div></div>';
  const query=outfitListHref(state).split('?')[1];
  return `<div class="intro lookbook-intro"><div><span class="eyebrow">MY OUTFIT LOOKBOOK</span><h1>My Outfits</h1><p>Browse looks built around your own clothes. Assumed basic layers are labeled separately.</p></div></div>
    ${!dataError?filters(outfits,state):''}<div class="outfit-page-tools"><span role="status">${dataError?'Unavailable':state.visible.length+' outfits'}</span><a class="text-button" href="#formulas/notes">Outfit Notes</a></div>
    <p class="lookbook-disclaimer">AI outfit visualization · Not a personal try-on. Check details and fit against the actual garments.</p>
    ${!dataError?dataStatus('catalog','Garment Records',catalogStatus):''}
    <div class="outfits-grid real-outfits">${dataError?'<p>Your outfits will appear here once records are available. This does not mean your wardrobe is empty.</p>':state.visible.map(o=>`<article class="real-outfit-card" data-outfit-id="${esc(o.id)}">${outfitHero(o,items,catalogStatus)}<div class="outfit-card-copy"><a class="code-link" href="#outfits/${encodeURIComponent(o.id)}${query?'?'+query:''}" aria-label="View outfit ${esc(o.code||o.id)}">${codeBadge(o)}</a><p class="outfit-category">${categories(o)}</p><h2><a href="#outfits/${encodeURIComponent(o.id)}${query?'?'+query:''}">${esc(outfitTitle(o))}</a></h2>${o.wearingNotes?.length?`<p class="outfit-wearing-cue">${esc(o.wearingNotes[0])}</p>`:''}${garmentIds(o,items,catalogStatus)}<a class="outfit-card-link text-button" href="#outfits/${encodeURIComponent(o.id)}${query?'?'+query:''}">Garments & Styling Notes ↗</a></div></article>`).join('')||`<section class="empty"><h2>${outfits.length?'No saved outfits for this season yet':'Save your first outfit using clothes you own'}</h2><p>In Codex, share a style you like or garment codes to check a combination and create an outfit image.</p><a class="btn" href="${outfits.length?'#outfits':'#closet'}">${outfits.length?'View All Outfits':'Browse My Clothes'}</a></section>`}</div>
    `;
}
function outfitDetail(outfit,items,state,catalogStatus,resolveReference,referenceStatus,relationships){
  const href=resolveReference(outfit.sourceReference||outfit.route);
  const hasReference=outfit.sourceReference||/^#(?:formulas|workbench|analysis)\/[^?/#]+/.test(outfit.route||'');
  const reference=href?`<a class="text-button" href="${esc(href)}">View original style reference ↗</a>`:hasReference?`<p class="sources">${referenceStatus!=='ready'?'The source reference is unavailable. You can still view this outfit.':'The original reference link is unavailable. This outfit is still saved.'}</p>`:'';
  const origin=relationships?.origins.find(r=>r.outfitId===outfit.id);
  const derived=outfit.derivedFromOutfitId?(origin?origin.available?`<p class="sources">Based on <a class="text-button" data-outfit-origin href="#outfits/${encodeURIComponent(origin.sourceId)}">${esc(origin.sourceCode||origin.sourceTitle)} variation ↗</a></p>`:'<p class="sources">The original outfit was removed. This outfit and its garment links are retained.</p>':'<p class="sources">The original outfit link is unavailable. This outfit is still saved.</p>'):'';
  const source=derived+reference;
  const garments=catalogStatus==='ready'?`<div class="flow-cards">${Object.entries(compactSelection(outfit.selection)).map(([slot,id])=>{const item=items.find(i=>i.id===id);return `<div><h3>${roleNames[slot]}</h3>${item?ownedCard(item):`<p class="empty">${esc(id)} is not currently in the catalog. The outfit link is retained.</p>`}</div>`;}).join('')}</div>`:dataStatus('catalog','Garment Records',catalogStatus);
  return `<div class="intro"><div><span class="eyebrow">${categories(outfit)}</span>${codeBadge(outfit)}<h1>${esc(outfitTitle(outfit))}</h1><p>Your clothes, your outfits. Click the image to enlarge it.</p></div><a class="btn" href="${outfitListHref(state)}">← My Outfits</a></div>
    <div class="outfit-detail-layout"><section class="outfit-detail-hero">${outfitHero(outfit,items,catalogStatus)}</section><section class="outfit-wearing"><h2>How to Wear It</h2>${outfit.wearingNotes?.length?`<ul>${outfit.wearingNotes.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:'<p>This outfit uses your selected garments. Dedicated styling notes have not been added yet.</p>'}${garmentIds(outfit,items,catalogStatus)}${source}<p class="sources">This AI image is not a personal try-on. Check texture, lettering and fit against the actual garments.</p></section></div>
    <section class="outfit-garments"><h2>Garments in This Outfit</h2>${assumptionDetails(outfit)}${garments}</section>`;
}
export function ownedImageDialog(outfit){
  return `<div class="dialog-head">${codeBadge(outfit)}<h2 id="outfit-image-title">${esc(outfitTitle(outfit))}</h2><button class="close-btn" data-close="outfit-image" aria-label="Close outfit image">×</button></div><img class="owned-lightbox-image" src="${esc(outfit.visual.src)}" alt="${esc(visualDescription(outfit))}"><p class="sources">${visualLabel(outfit)} · Check details and fit against the actual garments</p>${assumptionDetails(outfit)}`;
}
