import {esc,actionText,uiNames} from './shared.js';
import {dataStatus} from './data-status.js';
export function notes({guides,saved=[],dataError=false,personalStatus=dataError?'error':'ready',guidesStatus='ready'}){
  const personal=personalStatus==='ready'?saved.map(n=>`<article class="formula-card"><h3>${esc(n.title)}</h3><div class="formula-text">${esc(n.text)}</div></article>`).join('')||'<p class="empty">No notes yet. Add a note in Codex chat to keep it here.</p>':dataStatus('personal','My notes',personalStatus);
  const reference=guidesStatus==='ready'?(guides?.formulas||[]).map(n=>`<article class="formula-card"><h3>${esc(n.title)}</h3><div class="formula-text">${esc(n.text)}</div><p>${esc(n.note)}</p></article>`).join('')||'<p class="empty">No styling tips saved yet.</p>':dataStatus('guides','Styling tips',guidesStatus);
  return `<div class="intro"><div><h1>${uiNames.notes}</h1><p>Keep the styling details you want to remember. Add or edit notes in Codex chat.</p></div><a class="btn" href="#outfits">${actionText('Back to outfits','arrow-left')}</a></div><h2>My notes</h2><div class="formula-grid">${personal}</div><h2>Styling tips</h2><div class="formula-grid">${reference}</div>`;
}
