import {validateTypeCriteria,matchGarmentType} from './data/garment-taxonomy.js';

export const layerOrder=['outer','middle','inner'];
export function validateLayeringLimits(item){
  const value=item.layeringLimits;if(value===undefined)return;
  if(!value||value.source!=='owner-confirmed'||typeof value.reason!=='string'||!value.reason.trim()||value.reason.length>300)throw Error('Layering limit lacks user confirmation');
  validateTypeCriteria(value.disallowUnderTypes);
}
export function canLayerOver(upper,lower){
  validateLayeringLimits(upper);
  return !upper.layeringLimits||matchGarmentType(lower,upper.layeringLimits.disallowUnderTypes).state!=='matched';
}
export function assertLayeringSelection(selection,items){
  const layers=layerOrder.map(slot=>items.find(g=>g.id===selection[slot]));
  for(let i=0;i<layers.length;i++)for(let j=i+1;j<layers.length;j++){
    if(layers[i]&&layers[j]&&!canLayerOver(layers[i],layers[j]))throw Error(`${layers[i].code||layers[i].id} Cannot be layered over ${layers[j].code||layers[j].id} outside: ${layers[i].layeringLimits.reason}`);
  }
}
