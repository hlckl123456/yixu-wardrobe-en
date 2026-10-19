// Category is a garment construction; collar and sleeve are independent facets.
// Legacy Chinese subtypes are mapped exactly here, never parsed with regexes.
export const garmentCategories=Object.fromEntries([
  ['cardigan','Cardigan'],['shirt-jacket','Overshirt'],['denim-jacket','Denim jacket'],['fleece','Fleece jacket'],
  ['shirt','Shirt'],['knit','Knitwear'],['sweatshirt','Sweatshirt'],['tee','T-shirt'],['vest','Sweater vest'],['polo','Polo shirt'],
  ['jeans','Jeans'],['trousers','Trousers'],['joggers','Track pants'],['shorts','Shorts'],
  ['blazer','Blazer'],['jacket','Jacket'],['coat','Coat'],['padded-jacket','Padded jacket'],['outer-vest','Outerwear vest'],
  ['leather-jacket','Leather jacket'],['cargo-trousers','Cargo pants'],['henley','Henley top'],
  ['lace-shoes','Lace-up shoes'],['backless-shoes','Mules'],['derby-shoes','Derby shoes'],['canvas-shoes','Canvas shoes'],['sneakers','Sneakers'],['glasses','Glasses'],['belt','Belt'],['bag','Bag'],['necklace','Necklace'],['scarf','Scarf'],['tie','Tie'],['unknown','Uncategorized']
]);
const pluralCategories=new Set(['knit','jeans','trousers','joggers','shorts','cargo-trousers','lace-shoes','backless-shoes','derby-shoes','canvas-shoes','sneakers','glasses','unknown']);
export function categoryLabel(id,plural=false){
  const name=garmentCategories[id]||'Uncategorized';
  return !plural||pluralCategories.has(id)?name:id==='scarf'?'Scarves':name+'s';
}
export const garmentFacets={
  neckline:{unknown:'Not confirmed',crew:'Crewneck',turtleneck:'Turtleneck',stand:'Stand collar',turn:'Fold-down collar',hood:'Hooded',v:'V-neck',polo:'Polo collar',henley:'Henley'},
  sleeve:{unknown:'Not confirmed',long:'Long sleeves',short:'Short sleeves',sleeveless:'Sleeveless'},
  closure:{unknown:'Not confirmed',pullover:'Pullover',zip:'Zipper',open:'Open front',halfzip:'Half zip'},
  silhouette:{unknown:'Not confirmed',wide:'Wide leg',straight:'Straight leg'},
  length:{unknown:'Not confirmed',short:'Cropped'}
};
const definitions=[
  ['cardigan','unknown','unknown','open',['Knit Cardigan','Short-sleeve Cardigan']],
  ['cardigan','unknown','unknown','zip',['Zip-front Knit Cardigan']],
  ['shirt-jacket','turn','unknown','open',['Overshirt']],['denim-jacket','unknown','unknown','unknown',['Denim Jacket']],['fleece','unknown','unknown','unknown',['Fleece Jacket']],
  ['shirt','turn','long','open',['Long-sleeve Shirt']],['shirt','turn','short','open',['Short-sleeve Shirt']],
  ['knit','crew','unknown','pullover',['Crewneck Sweater']],['knit','turn','unknown','unknown',['Collared Knit']],
  ['knit','turtleneck','unknown','pullover',['Turtleneck Sweater']],['knit','unknown','short','unknown',['Short-sleeve Knit']],
  ['knit','unknown','unknown','pullover',['Sweater','Knitwear']],['knit','unknown','unknown','zip',['Half-zip Knit']],
  ['sweatshirt','crew','unknown','pullover',['Crewneck Sweatshirt']],['sweatshirt','hood','unknown','pullover',['Pullover Hoodie','Hoodie']],
  ['sweatshirt','hood','unknown','zip',['Zip Hoodie','Zip-up Hoodie']],
  ['sweatshirt','polo','long','unknown',['Long-sleeve Polo Sweatshirt']],['sweatshirt','turn','unknown','unknown',['Collared Sweatshirt']],['sweatshirt','unknown','unknown','zip',['Half-zip Sweatshirt']],
  ['tee','unknown','long','pullover',['Long-sleeve Tee','Color-block Long-sleeve Tee']],['tee','unknown','short','pullover',['Short-sleeve Tee','Color-block Short-sleeve Tee']],['tee','unknown','sleeveless','pullover',['Sleeveless Tee']],
  ['vest','unknown','sleeveless','unknown',['Knit Vest','Sleeveless Knit']],['vest','v','sleeveless','unknown',['V-neck Vest']],
  ['polo','polo','unknown','unknown',['Polo Shirt']],['polo','polo','short','unknown',['Short-sleeve Polo','Short-sleeve Polo']],['polo','polo','long','unknown',['Long-sleeve Polo','Long-sleeve Polo']],
  ['jeans','unknown','unknown','unknown',['Wide-leg Jeans','Straight-leg Jeans','Jeans']],['trousers','unknown','unknown','unknown',['Casual Trousers','Wide-leg Casual Trousers','Wide-leg Trousers','Straight-leg Trousers']],['joggers','unknown','unknown','unknown',['Track Pants']],['shorts','unknown','unknown','unknown',['Wide-leg Shorts','Shorts']],
  ['blazer','unknown','unknown','open',['Blazer']],['jacket','turn','unknown','unknown',['Collared Jacket']],['jacket','hood','unknown','unknown',['Hooded Jacket']],['jacket','unknown','unknown','unknown',['Utility Jacket']],
  ['coat','unknown','unknown','open',['Coat','Wool Coat','Long Coat']],['padded-jacket','unknown','unknown','unknown',['Quilted Jacket','Down Jacket']],['outer-vest','unknown','sleeveless','unknown',['Quilted Vest','Down Vest']],
  ['backless-shoes','unknown','unknown','unknown',['Lace-up Mules','Buckle Mules']],['lace-shoes','unknown','unknown','unknown',['Low-top Lace-ups']],['glasses','unknown','unknown','unknown',['Glasses']],
  ['belt','unknown','unknown','unknown',['Belt','Belt']],['bag','unknown','unknown','unknown',['Crossbody Bag','Shoulder Bag','Backpack','Handbag']],['necklace','unknown','unknown','unknown',['Necklace']],['scarf','unknown','unknown','unknown',['Silk Scarf','Scarf']],['tie','unknown','unknown','unknown',['Tie']]
];
export const legacyGarmentTypes=Object.fromEntries(definitions.flatMap(([category,neckline,sleeve,closure,subtypes])=>subtypes.map(subtype=>[subtype,{category,neckline,sleeve,closure}])));
// Exact legacy labels are translated once at the data boundary. Rules, grouping
// and slot eligibility below consume canonical IDs, not display-name heuristics.
for(const [subtype,value] of Object.entries({
  'Henley Tee':{category:'henley',neckline:'henley'},'Henley Top':{category:'henley',neckline:'henley'},
  'Leather Jacket':{category:'leather-jacket'},'Jacket':{category:'jacket'},'Short Jacket':{category:'jacket',length:'short'},
  'Wide-leg Cargo Pants':{category:'cargo-trousers',silhouette:'wide'},'Derby Shoes':{category:'derby-shoes'},'Platform Derby Shoes':{category:'derby-shoes'},
  'Canvas Shoes':{category:'canvas-shoes'},'Sneakers':{category:'sneakers'},
  'Crewneck KnitVest':{category:'vest',neckline:'crew',sleeve:'sleeveless'},
  'Square Scarf':{category:'scarf'},'Neck Scarf':{category:'scarf'}
}))legacyGarmentTypes[subtype]=value;
for(const subtype of ['Wide-leg Jeans','Wide-leg Casual Trousers','Wide-leg Trousers','Wide-leg Shorts'])legacyGarmentTypes[subtype].silhouette='wide';
for(const subtype of ['Straight-leg Jeans','Straight-leg Trousers'])legacyGarmentTypes[subtype].silhouette='straight';
legacyGarmentTypes['Short-sleeve Cardigan'].sleeve='short';
for(const subtype of ['Half-zip Knit','Half-zip Sweatshirt'])legacyGarmentTypes[subtype].closure='halfzip';
// Format known type labels without changing stored subtypes or free-text names.
export function subtypeLabel(value){
  if(!Object.hasOwn(legacyGarmentTypes,value))return value||'Not confirmed';
  const label=value==='Crewneck KnitVest'?'Crewneck knit vest':value.charAt(0)+value.slice(1).toLowerCase();
  return label.replace(/\btee\b/g,'T-shirt');
}
export function validateClassification(value){
  if(!value||typeof value!=='object'||Array.isArray(value)||!Object.hasOwn(garmentCategories,value.category))throw Error('Invalid garment category ID');
  const result={category:value.category};
  for(const [key,choices] of Object.entries(garmentFacets)){
    const field=value[key]??'unknown';if(!Object.hasOwn(choices,field))throw Error('Invalid garment attribute: '+key);result[key]=field;
  }
  return result;
}
export function garmentClassification(item){
  return validateClassification(item.classification||legacyGarmentTypes[item.subtype]||{category:'unknown'});
}

export function garmentSlots(item){
  const c=garmentClassification(item),slots=new Set([item.layer]);
  if(item.layer==='accessory')return c.category==='belt'||c.category==='bag'||c.category==='tie'?[c.category]:['accessory'];
  if(!['outer','inner'].includes(item.layer))return [...slots];
  if(c.category==='cardigan'){slots.add('outer');slots.add('middle');}
  if(c.category==='vest'||c.category==='outer-vest')slots.add('middle');
  if(c.category==='shirt'&&c.sleeve==='long')slots.add('outer');
  if(c.category==='knit'&&c.neckline!=='turtleneck'&&c.sleeve!=='short'&&(['crew','turn'].includes(c.neckline)||['pullover','halfzip','zip'].includes(c.closure)))slots.add('outer');
  if(c.category==='sweatshirt'){
    // A crew-neck sweatshirt can be the outer layer over a tee or shirt,
    // just like a crew-neck knit; its catalog layer remains unchanged.
    if(c.neckline==='crew'&&c.sleeve!=='short')slots.add('outer');
    if(c.neckline==='hood'){slots.add('outer');slots.add('inner');}
    if(['turn','polo'].includes(c.neckline)){slots.add('outer');slots.add('middle');}
    if(c.closure==='halfzip')slots.add('outer');
  }
  if(c.category==='polo'){slots.add('outer');if(c.sleeve==='long')slots.add('middle');}
  return [...slots];
}

export function typeCriteria(subtypes){
  return subtypes.map(label=>{
    if(!legacyGarmentTypes[label])throw Error('Unregistered garment type: '+label);
    return Object.fromEntries(Object.entries(garmentClassification({subtype:label})).filter(([,value])=>value!=='unknown'));
  });
}
export function validateTypeCriteria(types){
  if(!Array.isArray(types)||!types.length)throw Error('Reference is missing garment type criteria');
  for(const type of types){
    validateClassification(type);
    if(type.category==='unknown'||Object.keys(type).some(key=>key!=='category'&&!Object.hasOwn(garmentFacets,key)))throw Error('Invalid garment type criteria');
  }
  return types;
}
export function matchGarmentType(item,types){
  if(!types)return {state:'matched',pending:[]};
  const c=garmentClassification(item);let uncertain=null;
  for(const type of types){
    const pending=[];let mismatch=false;
    for(const [key,expected] of Object.entries(type)){
      if(expected==='unknown')continue;
      if(c[key]==='unknown')pending.push((key==='category'?'Item type':({neckline:'Neckline',sleeve:'Sleeve length',closure:'Closure',silhouette:'Leg shape',length:'Length'})[key])+' not confirmed');
      else if(c[key]!==expected)mismatch=true;
    }
    if(!mismatch&&!pending.length)return {state:'matched',pending:[]};
    if(!mismatch&&(!uncertain||pending.length<uncertain.length))uncertain=pending;
  }
  return uncertain?{state:'uncertain',pending:uncertain}:{state:'excluded',pending:[]};
}
