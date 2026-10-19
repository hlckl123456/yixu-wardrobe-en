import {categoryLabel,garmentClassification,garmentSlots} from './data/garment-taxonomy.js';
export {garmentClassification} from './data/garment-taxonomy.js';
export const layers = [
  { id: 'outer', name: 'Outerwear', hint: 'Start with silhouette and main color', icon: 'coat' },
  { id: 'inner', name: 'Tops', hint: 'Choose a top and build your layers', icon: 'shirt' },
  { id: 'bottom', name: 'Bottoms', hint: 'Balance proportions with the trouser shape', icon: 'pants' },
  { id: 'shoes', name: 'Shoes', hint: 'Connect the hem and footwear', icon: 'shoe' },
  { id: 'accessory', name: 'Accessories', hint: 'Add the finishing touches', icon: 'accessories' }
];
export const roleNames={outer:'Outerwear',middle:'Midlayer',inner:'Top',bottom:'Bottoms',shoes:'Shoes',belt:'Belt',bag:'Bag',accessory:'Accessories',tie:'Tie'};
export function fitsSlot(item,slot) {
  return garmentSlots(item).includes(slot);
}
export function inventory(catalog) {
  return catalog.items.filter(item => item.collection === 'owned');
}
export function statistics(items, layer) {
  const selected = items.filter(x => x.layer === layer);
  const colors = new Map();
  for (const item of selected) {
    const key = item.color.name;
    const entry = colors.get(key) || {name:key,hex:item.color.hex,count:0};
    entry.count++; colors.set(key,entry);
  }
  return { total: selected.length, colors: [...colors.values()].sort((a,b)=>b.count-a.count) };
}
export function describeSelection(items,selection={}){return Object.keys(roleNames).map(role=>items.find(i=>i.id===selection[role])).filter(Boolean).map(i=>i.color.name+' '+i.subtype).join(' + ');}
export function garmentGroup(item){
  const {category}=garmentClassification(item);return {id:category,name:categoryLabel(category,true)};
}
export function canonicalGarmentGroup(id){
  if(['long-tee','short-tee'].includes(id))return 'tee';
  if(id?.startsWith('subtype:'))return garmentGroup({subtype:id.slice(8)}).id;
  return id;
}
export function groupedGarments(items){
  const result=new Map();
  for(const item of items){const group=garmentGroup(item);if(!result.has(group.id))result.set(group.id,{...group,items:[]});result.get(group.id).items.push(item);}
  return [...result.values()];
}
export function wardrobeStructure(items,layer){
  return groupedGarments(items.filter(i=>i.layer===layer)).map(group=>({...group,colors:statistics(group.items,layer).colors}));
}
