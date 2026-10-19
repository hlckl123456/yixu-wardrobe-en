// Ownership and availability are separate: a planned discard is still an
// owned record, with its original ID, assets and historical relationships.
export const garmentStatuses=['active','pending-discard'];
export function garmentStatus(item){return item.wardrobeStatus===undefined?'active':item.wardrobeStatus;}
export function validateGarmentStatus(item){
  if(!garmentStatuses.includes(garmentStatus(item)))throw Error('Invalid garment status');
  if(item.wardrobeStatusChangedAt!==undefined&&(typeof item.wardrobeStatusChangedAt!=='string'||!Number.isFinite(Date.parse(item.wardrobeStatusChangedAt))))throw Error('Invalid garment status timestamp');
}
export function isActiveGarment(item){return item.collection==='owned'&&garmentStatus(item)==='active';}
export function isPendingDiscard(item){return item.collection==='owned'&&garmentStatus(item)==='pending-discard';}
