import {esc,thumbnail,intro,icon,codeBadge,garmentImageBadge} from './shared.js';
import {layers} from '../garment-model.js';
import {groupedGarments,garmentGroup,canonicalGarmentGroup} from '../garment-model.js';
import {wardrobeMatches} from '../matching-model.js';
import {isActiveGarment,isPendingDiscard} from '../garment-status.js';

export function ownedCard(item,{pending=[],usageCount=null}={}){
  return `<article class="garment owned-card"><button class="garment-image-button" data-detail="${esc(item.id)}" aria-label="View ${esc(item.name)} details"><img class="garment-image" src="${esc(thumbnail(item))}" alt="${esc(item.name)}" loading="lazy"></button><div class="garment-info">${codeBadge(item)}${garmentImageBadge(item)}<h3><button class="card-title-button" data-detail="${esc(item.id)}">${esc(item.name)}</button></h3><p>${esc(item.subtype)} · ${esc(item.color?.name)}</p>${usageCount!==null?`<p class="usage-count">Used in ${usageCount} saved outfits</p>`:''}<small>${pending.length?' · '+esc(pending.join('; ')):''}</small><button class="text-button" data-detail="${esc(item.id)}">View Garment</button></div></article>`;
}
export function ownedCloset({items,closetLayer='outer',closetGroup='all',closetUsage='all',usageCounts=null,personalStatus='ready'}){
  return garmentCollection({items:items.filter(isActiveGarment),closetLayer,closetGroup,closetUsage,usageCounts,personalStatus,route:'closet',title:'My Wardrobe',description:'Clothes you plan to keep wearing. Use the code on a card to refer to a garment in Codex.'});
}
export function pendingDiscardCloset({items,closetLayer='all',closetGroup='all'}){
  return garmentCollection({items:items.filter(isPendingDiscard),closetLayer,closetGroup,route:'discard',title:'Ready to Let Go',description:'Set aside from your everyday wardrobe and excluded from new outfits and reference matching. Records, images and codes are kept. Use the code in Codex to restore a garment.',includeAll:true});
}
function garmentCollection({items,closetLayer,closetGroup,route,title,description,includeAll=false,closetUsage='all',usageCounts=null,personalStatus='ready'}){
  closetGroup=canonicalGarmentGroup(closetGroup);
  const options=includeAll?[{id:'all',name:'All',icon:'shirt'},...layers]:layers;
  const layer=options.find(l=>l.id===closetLayer)||options[0];
  const candidates=items.filter(i=>layer.id==='all'||i.layer===layer.id),groups=groupedGarments(candidates);
  const active=groups.some(g=>g.id===closetGroup)?closetGroup:'all';
  const inGroup=active==='all'?candidates:candidates.filter(i=>garmentGroup(i).id===active);
  const usage=route==='closet'&&['unused','low'].includes(closetUsage)?closetUsage:'all';
  const count=item=>usageCounts?.get(item.id)||0;
  const matches=(item,filter)=>filter==='all'||(filter==='unused'?count(item)===0:count(item)>=1&&count(item)<=2);
  const visible=inGroup.filter(i=>usage==='all'||usageCounts&&matches(i,usage));
  const href=(layerId=layer.id,groupId='all',filter=usage)=>`#${route}?${new URLSearchParams({layer:layerId,...(groupId!=='all'?{group:groupId}:{}),...(filter!=='all'?{usage:filter}:{})})}`;
  const usageFilters=route==='closet'?`<nav class="wardrobe-tabs usage-filters" aria-label="Use in saved outfits">${[['all','All Garments'],['unused','Not Used'],['low','Used in 1–2 Outfits']].map(([id,label])=>`<a class="btn" href="${href(layer.id,active,id)}" ${usage===id?'aria-current="page"':''}>${label}<span>${id==='all'?inGroup.length:usageCounts?inGroup.filter(i=>matches(i,id)).length:'—'} items</span></a>`).join('')}</nav><p class="sources">Counts saved outfit links in this category, not how often a garment was worn.</p>`:'';
  return intro(title,description)+
  `<nav class="wardrobe-tabs owned-layers" aria-label="Garment categories">${options.map(l=>`<a class="btn" href="${href(l.id)}" ${layer.id===l.id?'aria-current="page"':''}>${icon(l.icon)}${l.name}<span>${items.filter(i=>l.id==='all'||i.layer===l.id).length} items</span></a>`).join('')}</nav>
  <section class="flow-picker"><div class="flow-picker-head"><h2>${layer.name}</h2><span aria-live="polite">${usage!=='all'&&!usageCounts?'—':visible.length} items</span></div><nav class="wardrobe-tabs subcategory-tabs" aria-label="Garment types"><a class="btn" href="${href()}" ${active==='all'?'aria-current="page"':''}>All · ${candidates.length}</a>${groups.map(g=>`<a class="btn" href="${href(layer.id,g.id)}" ${active===g.id?'aria-current="page"':''}>${esc(g.name)} · ${g.items.length}</a>`).join('')}</nav>${usageFilters}${usage!=='all'&&!usageCounts?`<p role="status">${personalStatus==='loading'?'Loading outfit links…':'Outfit links are unavailable, so unused garments cannot be determined.'}</p><button class="text-button" data-resource-retry="personal">Retry</button>`:`<div class="flow-cards">${visible.map(i=>ownedCard(i,{usageCount:usageCounts?count(i):null})).join('')}</div>${!visible.length?`<p class="empty">${usage!=='all'?'No garments in this category match this usage filter.':route==='discard'?'No garments are currently set aside.':'No garments recorded here yet. Send photos of your clothes in Codex to add them.'}</p>`:''}`}</section>`;
}
export function matchingPanel(items,formula){
  const result=wardrobeMatches(items,formula);
  const summary=result.missing.length?`${result.missing.length} required slots have no recorded match`:result.uncertain.length?`${result.uncertain.length} required slots need confirmation`:result.sharedConflict?'Some garments match multiple slots; each layer needs a separate item.':'All required slots have category matches. Fit and styling still need checking.';
  return `<section id="owned-matches" class="owned-matches" tabindex="-1"><header><span class="eyebrow">FROM YOUR WARDROBE</span><h2>Try This Style with My Clothes</h2><p class="match-summary" role="status">${summary}</p><p>Matches recorded garment types, patterns and explicit color requirements. Switching image palettes does not automatically exclude clothes. Check size, thickness, layering room and actual colors.</p></header>
    ${result.groups.map(g=>`<section class="match-group" data-match-group="${g.id}"><h3>${g.name}${g.id==='inner'?' / Mid Layer':''}</h3>${!g.rows.length?`<p class="match-empty">${g.id==='outer'?'This style does not need outerwear.':g.id==='accessory'?'No accessory is specified; it is not counted as a gap.':'This layer is not specified and is not counted as a gap.'}</p>`:g.rows.map(r=>`<div class="match-rule" data-match-state="${r.state}"><div class="match-rule-heading"><h4>${esc(r.label)}</h4><span>${r.optional?'Optional · ':''}${r.matches.length?'Category matches '+r.matches.length+' items':r.uncertain.length?'Unconfirmed':r.optional?'No records':'No match'}</span></div>
    ${r.subtypes?.length?`<p class="match-criteria">Type: ${esc(r.subtypes.join(' / '))}${r.pattern==='solid'?' · Solid':''}${r.patternTag?' · '+esc(r.patternTag):''}</p>`:''}
    ${r.matches.length?`<div class="match-cards">${r.matches.map(c=>ownedCard(c.item)).join('')}</div>`:''}
    ${r.uncertain.length?`<h5>Unconfirmed · Not yet a confirmed match</h5><div class="match-cards">${r.uncertain.map(c=>ownedCard(c.item,{pending:c.pending})).join('')}</div>`:''}
    ${!r.matches.length&&!r.uncertain.length?`<p class="match-empty">${r.optional?'Optional; no purchase is needed.':'No recorded item matches these conditions. Check your records before changing the style or buying an item.'}</p>`:''}
    ${r.excluded?`<p class="match-excluded">Another ${r.excluded} items in this category do not match recorded pattern, color or layering requirements.</p>`:''}</div>`).join('')}</section>`).join('')}
    <p class="note-block">To use this look, share reference code ${esc(formula.studyStyle?.code||'')} and your garment codes in Codex. The combination can be checked and saved to My Outfits, with an outfit visualization if needed. No purchases are placed automatically.</p></section>`;
}
