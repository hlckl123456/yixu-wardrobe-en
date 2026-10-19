// Shopping concepts are not owner inventory or authorized assumed basics.
export function validateSuggestedPieces(value=[]){
  if(!Array.isArray(value)||value.length>1)throw Error('At most one proposed purchase per look');
  for(const p of value){
    if(!p||typeof p!=='object'||!['inner','outer'].includes(p.slot)||p.provenance!=='shopping-concept')throw Error('Invalid shopping concept provenance');
    if(['id','code','asset','garmentId'].some(k=>k in p))throw Error('Shopping concepts cannot be represented as owned clothes');
    for(const k of ['name','reason','specification'])if(typeof p[k]!=='string'||!p[k].trim()||p[k].length>1000)throw Error('Invalid shopping concept description');
    if(typeof p.color?.name!=='string'||!p.color.name.trim()||!/^#[a-f\d]{6}$/i.test(p.color.hex))throw Error('Invalid suggested palette');
  }
  return value;
}
