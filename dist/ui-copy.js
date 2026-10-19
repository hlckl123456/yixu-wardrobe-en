// English display copy only. Never use these labels as database keys or IDs.
export const uiNames={outfits:'My outfits',closet:'My wardrobe',formulas:'Style inspiration',analysis:'Wardrobe overview',discard:'Ready to let go',notes:'Outfit notes'};
export const countLabel=(count,singular,plural=singular+'s')=>`${count} ${count===1?singular:plural}`;
const seasons={winter:'Winter',autumn:'Fall & winter',transition:'Spring & fall',summer:'Summer',unclassified:'Uncategorized'};
const styles={minimal:'Minimal',relaxed:'Relaxed casual',street:'Streetwear'};
export const seasonLabel=(id,fallback='Uncategorized')=>seasons[id]||fallback;
export const styleLabel=(id,fallback=id)=>styles[id]||fallback;
// Exact legacy display repairs; free-text descriptions and brand names stay intact.
export const itemTerm=value=>({'Crewneck KnitVest':'Crewneck knit vest','Unconfirmed':'Not confirmed','Unknown':'Not confirmed'})[value]||value||'Not confirmed';
