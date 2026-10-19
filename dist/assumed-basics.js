// Shared by candidate previews and persisted outfits. Assumptions are not
// photographed inventory and never carry a garment ID or affect closet counts.
export function validateAssumedBasics(value=[]){
  if(!Array.isArray(value)||value.length>1)throw Error('At most one assumed basic layer is allowed');
  for(const b of value){
    if(!b||b.kind!=='basic-tee'||!['short','long'].includes(b.sleeve)||b.neckline!=='crew'||b.provenance!=='user-authorized-assumption')throw Error('Only user-authorized basic crewneck tees are allowed');
    if(typeof b.color?.name!=='string'||!b.color.name.trim()||b.color.name.length>80||!/^#[a-f\d]{6}$/i.test(b.color.hex))throw Error('Invalid basic-layer color');
    if(!Number.isFinite(b.maxVisibleBandCm)||b.maxVisibleBandCm<=0||b.maxVisibleBandCm>3||typeof b.exposure!=='string'||!b.exposure.trim()||b.exposure.length>500)throw Error('The basic layer may show only a narrow band');
    if(['id','code','asset','assets','garmentId'].some(key=>key in b))throw Error('An assumed basic cannot be represented as a verified garment');
  }
  return value;
}
export function normalizeAssumedBasics(value){
  return validateAssumedBasics(value).map(b=>({kind:b.kind,sleeve:b.sleeve,neckline:b.neckline,color:{name:b.color.name,hex:b.color.hex},maxVisibleBandCm:b.maxVisibleBandCm,exposure:b.exposure,provenance:b.provenance}));
}
export const basicName=b=>`${b.color.name}Crewneck${b.sleeve==='long'?'Long Sleeves Tee':'Short Sleeves Tee'}`;
