// Frozen legacy payload contracts. These records are retained, never used as UI state.
export function legacyOutfitLink(record){
  return typeof record.route==='string'&&/^#workbench(?:\/[^?#]+)?(?:\?.*)?$/.test(record.route)?{route:record.route}:{};
}
export function normalizeHistoricalCuration(value){
  if(!Array.isArray(value))throw Error('Invalid historical curation format');
  const seen=new Set();
  return value.map(record=>{
    if(!record||typeof record!=='object'||typeof record.styleId!=='string'||!record.styleId||seen.has(record.styleId)||
      !['available','selected','hidden'].includes(record.state)||!['winter','autumn','transition','summer'].includes(record.season)||
      !Number.isSafeInteger(record.position)||record.position<0)throw Error('Invalid or duplicate historical curation record');
    seen.add(record.styleId);
    return {styleId:record.styleId,state:record.state,season:record.season,position:record.position};
  });
}
