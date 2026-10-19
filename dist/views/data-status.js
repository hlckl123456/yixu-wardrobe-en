import {esc} from './shared.js';
export function dataStatus(resource,label,status='loading'){
  if(status==='ready')return '';
  const failed=status==='error';
  const subject=label.replace(/^my /i,'').toLowerCase();
  return `<section class="data-status" data-resource-state="${resource}:${status}" role="${failed?'alert':'status'}"><h2>${failed?'Couldn’t load ':'Loading '}${esc(subject)}${failed?'':'…'}</h2><p>${failed?'Your saved data hasn’t changed. Check that the local server is running, then try again.':'Please wait a moment.'}</p>${failed?`<button type="button" class="btn" data-resource-retry="${resource}">${resource==='references'?'Reload page':'Try again'}</button>`:''}</section>`;
}
