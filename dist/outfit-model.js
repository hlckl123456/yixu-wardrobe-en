import {seasonOrder} from './data/season-policy.js';

// Owned looks are independent of reference membership; no title-based classification.
export const outfitSeasons=seasonOrder.map(id=>({id,name:({winter:'Winter',autumn:'Fall / Winter',transition:'Spring / Fall',summer:'Summer'})[id]}));
export const outfitStyles=[{id:'minimal',name:'Clean & Minimal'},{id:'relaxed',name:'Relaxed Casual'},{id:'street',name:'Streetwear Layers'}];
export const outfitSeasonName=id=>outfitSeasons.find(s=>s.id===id)?.name||'Uncategorized';
export const outfitStyleNames=outfit=>(outfit.styleTags||[]).map(id=>outfitStyles.find(s=>s.id===id)?.name).filter(Boolean);
export const outfitTitle=outfit=>outfit.displayTitle||outfit.title;
export function outfitListHref({season='all',style='all'}={}){
  const q=new URLSearchParams();if(season!=='all')q.set('season',season);if(style!=='all')q.set('style',style);
  return '#outfits'+(q.size?'?'+q:'');
}
export function outfitFilters(outfits,{season='all',style='all'}={}){
  const seasons=[...outfitSeasons];
  if(outfits.some(o=>!o.season))seasons.push({id:'unclassified',name:'Uncategorized'});
  const selectedSeason=seasons.some(s=>s.id===season)?season:'all';
  const inSeason=outfits.filter(o=>selectedSeason==='all'||(o.season||'unclassified')===selectedSeason);
  const styles=outfitStyles.map(s=>({...s,count:inSeason.filter(o=>o.styleTags?.includes(s.id)).length})).filter(s=>s.count);
  const selectedStyle=styles.some(s=>s.id===style)?style:'all';
  return {season:selectedSeason,style:selectedStyle,inSeason,seasons:seasons.map(s=>({...s,count:outfits.filter(o=>(o.season||'unclassified')===s.id).length})),styles,visible:inSeason.filter(o=>selectedStyle==='all'||o.styleTags?.includes(selectedStyle))};
}
