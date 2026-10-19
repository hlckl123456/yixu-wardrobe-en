import {esc} from './shared.js';
export function dataStatus(resource,label,status='loading'){
  if(status==='ready')return '';
  const failed=status==='error';
  return `<section class="data-status" data-resource-state="${resource}:${status}" role="${failed?'alert':'status'}"><h2>${esc(label)}${failed?' unavailable':'Loading '}</h2><p>${failed?`This does not mean the content is empty${resource==='catalog'?', or that garments are missing':''}. Your files and records have not been changed.`:'Content will appear when loading completes. No page refresh is needed.'}</p>${failed?`<button class="btn" data-resource-retry="${resource}">${resource==='references'?'Reload Page':'Retry '+esc(label)}</button>`:''}</section>`;
}
