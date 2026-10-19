import {esc,thumbnail,intro,icon,codeBadge,garmentImageBadge,countLabel,actionText,uiNames} from './shared.js';
import {layers} from '../garment-model.js';
import {groupedGarments,garmentGroup,canonicalGarmentGroup} from '../garment-model.js';
import {wardrobeMatches} from '../matching-model.js';
import {isActiveGarment,isPendingDiscard} from '../garment-status.js';
import {subtypeLabel} from '../data/garment-taxonomy.js';

export function ownedCard(item,{pending=[],usageCount=null}={}){
  return `<article class="garment owned-card"><button type="button" class="garment-image-button" data-detail="${esc(item.id)}" aria-label="View details: ${esc(item.name)}"><img class="garment-image" src="${esc(thumbnail(item))}" alt="${esc(item.name)}" loading="lazy"></button><div class="garment-info">${codeBadge(item)}${garmentImageBadge(item)}<h3><button type="button" class="card-title-button" data-detail="${esc(item.id)}">${esc(item.name)}</button></h3><p>${esc(subtypeLabel(item.subtype))} · ${esc(item.color?.name)}</p>${usageCount!==null?`<p class="usage-count">${usageCount?'In '+countLabel(usageCount,'saved outfit'):'Not in any saved outfits'}</p>`:''}${pending.length?`<small>${esc(pending.join('; '))}</small>`:''}<button type="button" class="text-button" data-detail="${esc(item.id)}" aria-label="View details: ${esc(item.name)}">${actionText('View details')}</button></div></article>`;
}
export function ownedCloset({items,closetLayer='outer',closetGroup='all',closetUsage='all',usageCounts=null,personalStatus='ready'}){
  return garmentCollection({items:items.filter(isActiveGarment),closetLayer,closetGroup,closetUsage,usageCounts,personalStatus,route:'closet',title:uiNames.closet,description:'Your everyday wardrobe. Use an item’s code in Codex chat to update it or plan an outfit.'});
}
export function pendingDiscardCloset({items,closetLayer='all',closetGroup='all'}){
  return garmentCollection({items:items.filter(isPendingDiscard),closetLayer,closetGroup,route:'discard',title:uiNames.discard,description:'Items you’ve set aside, not deleted. They won’t be suggested for new outfits. To bring one back, share its code in Codex chat.',includeAll:true});
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
  const usageFilters=route==='closet'?`<nav class="wardrobe-tabs usage-filters" aria-label="Filter by saved outfits">${[['all','All items'],['unused','Not in any outfits'],['low','In 1–2 outfits']].map(([id,label])=>{const n=id==='all'?inGroup.length:usageCounts?inGroup.filter(i=>matches(i,id)).length:null;return `<a class="btn" href="${href(layer.id,active,id)}" ${usage===id?'aria-current="page"':''}>${label}<span>${n===null?'—':countLabel(n,'item')}</span></a>`;}).join('')}</nav><p class="sources">Counts saved outfits, not how often you’ve worn each item.</p>`:'';
  return intro(title,description)+
  `<nav class="wardrobe-tabs owned-layers" aria-label="Item categories">${options.map(l=>`<a class="btn" href="${href(l.id)}" ${layer.id===l.id?'aria-current="page"':''}>${icon(l.icon)}${l.name}<span>${countLabel(items.filter(i=>l.id==='all'||i.layer===l.id).length,'item')}</span></a>`).join('')}</nav>
  <section class="flow-picker"><div class="flow-picker-head"><h2>${layer.name}</h2><span aria-live="polite">${usage!=='all'&&!usageCounts?'Loading…':countLabel(visible.length,'item')}</span></div><nav class="wardrobe-tabs subcategory-tabs" aria-label="Item types"><a class="btn" href="${href()}" ${active==='all'?'aria-current="page"':''}>All · ${candidates.length}</a>${groups.map(g=>`<a class="btn" href="${href(layer.id,g.id)}" ${active===g.id?'aria-current="page"':''}>${esc(g.name)} · ${g.items.length}</a>`).join('')}</nav>${usageFilters}${usage!=='all'&&!usageCounts?`<p role="status">${personalStatus==='loading'?'Checking saved outfits…':'Couldn’t check outfit use. Your items are still here.'}</p><button type="button" class="text-button" data-resource-retry="personal">Try again</button>`:`<div class="flow-cards">${visible.map(i=>ownedCard(i,{usageCount:usageCounts?count(i):null})).join('')}</div>${!visible.length?`<p class="empty">${usage!=='all'?'No items match this filter. Try All items or another category.':route==='discard'?'No items set aside. Your everyday wardrobe is unchanged.':'No items in this category yet. Send photos in Codex chat to add some.'}</p>`:''}`}</section>`;
}
export function matchingPanel(items,formula){
  const result=wardrobeMatches(items,formula);
  const summary=result.missing.length?`${countLabel(result.missing.length,'part')} of this look ${result.missing.length===1?'has':'have'} no matching item yet.`:result.uncertain.length?`${countLabel(result.uncertain.length,'part')} of this look ${result.uncertain.length===1?'needs':'need'} a closer check.`:result.sharedConflict?'One item matches more than one layer. You’ll need a different item for each layer.':'Your wardrobe has options for every part of this look. Check fit and layering before wearing it.';
  return `<section id="owned-matches" class="owned-matches" tabindex="-1"><header><span class="eyebrow">FROM YOUR WARDROBE</span><h2>Build this look with your clothes</h2><p class="match-summary" role="status">${summary}</p><p>Suggestions use recorded item types, patterns and required colors. Changing the preview palette doesn’t change this list. Check the actual colors, fit and room for layering.</p></header>
    ${result.groups.map(g=>`<section class="match-group" data-match-group="${g.id}"><h3>${g.name}</h3>${!g.rows.length?`<p class="match-empty">${g.id==='outer'?'No outerwear needed for this look.':g.id==='accessory'?'No accessories needed for this look.':'This look doesn’t need this layer.'}</p>`:g.rows.map(r=>`<div class="match-rule" data-match-state="${r.state}"><div class="match-rule-heading"><h4>${esc(r.label)}</h4><span>${r.optional?'Optional · ':''}${r.matches.length?countLabel(r.matches.length,'matching item'):r.uncertain.length?'Needs a closer check':r.optional?'No items recorded':'No matching items'}</span></div>
    ${r.subtypes?.length?`<p class="match-criteria">Type: ${esc(r.subtypes.map(subtypeLabel).join(' / '))}${r.pattern==='solid'?' · Solid color':''}${r.patternTag?' · '+esc(r.patternTag):''}</p>`:''}
    ${r.matches.length?`<div class="match-cards">${r.matches.map(c=>ownedCard(c.item)).join('')}</div>`:''}
    ${r.uncertain.length?`<h5>Check these items</h5><div class="match-cards">${r.uncertain.map(c=>ownedCard(c.item,{pending:c.pending})).join('')}</div>`:''}
    ${!r.matches.length&&!r.uncertain.length?`<p class="match-empty">${r.optional?'This item is optional. You don’t need to buy it.':'Nothing in your records matches yet. Check that your wardrobe is up to date before deciding to buy anything.'}</p>`:''}
    ${r.excluded?`<p class="match-excluded">${countLabel(r.excluded,'other item')} in this category ${r.excluded===1?'doesn’t':'don’t'} match the recorded pattern, color or layering requirements.</p>`:''}</div>`).join('')}</section>`).join('')}
    <p class="note-block">Want to try this look? Share ${esc(formula.studyStyle?.code||'this inspiration code')} and your item codes in Codex chat. Confirm the combination there before saving it to My outfits. Nothing is added or purchased from this page.</p></section>`;
}
