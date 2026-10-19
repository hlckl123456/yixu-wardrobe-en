import {seasonLabel} from '../ui-copy.js';
// Personal browsing taxonomy, not a warmth or temperature prediction.
export const seasonOrder = ['winter','autumn','transition','summer'];
export const seasonRules = [
  [seasonLabel('winter'),'A coat or down jacket is the outermost layer, paired with full-length trousers.'],
  [seasonLabel('summer'),'No winter outerwear; short sleeves, or a light shirt with shorts.'],
  [seasonLabel('autumn'),'Neither rule above applies; substantial knitwear, jackets or insulating layers dominate.'],
  [seasonLabel('transition'),'Other confirmed lightweight long-sleeve looks, including hoodies with shorts.']
];
export function classifySeason(traits) {
  if(!traits || !['none','coat','down'].includes(traits.winterShell))throw Error('Winter outer layer must be specified');
  if(!['long','short','layered-long'].includes(traits.sleeves))throw Error('Sleeve length must be specified');
  if(!['long','short'].includes(traits.bottom))throw Error('Trouser length must be specified');
  if(!['light','substantial'].includes(traits.weight))throw Error('Layering weight must be specified');
  if(traits.winterShell!=='none') {
    if(traits.bottom!=='long')throw Error('Winter references require full-length trousers');
    return 'winter';
  }
  if(traits.sleeves==='short'||(traits.bottom==='short'&&traits.weight==='light'&&traits.upper==='shirt'))return 'summer';
  if(traits.weight==='substantial')return 'autumn';
  return 'transition';
}
export function seasonReason(traits){return seasonRules.find(([name])=>name===seasonLabel(classifySeason(traits)))[1];}
