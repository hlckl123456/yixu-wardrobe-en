import {esc} from './shared.js';
import {dataStatus} from './data-status.js';
export function notes({guides,saved=[],dataError=false,personalStatus=dataError?'error':'ready',guidesStatus='ready'}){
  const personal=personalStatus==='ready'?saved.map(n=>`<article class="formula-card"><h3>${esc(n.title)}</h3><div class="formula-text">${esc(n.text)}</div></article>`).join('')||'<p class="empty">No personal notes yet.</p>':dataStatus('personal','My Notes',personalStatus);
  const reference=guidesStatus==='ready'?(guides?.formulas||[]).map(n=>`<article class="formula-card"><h3>${esc(n.title)}</h3><div class="formula-text">${esc(n.text)}</div><p>${esc(n.note)}</p></article>`).join('')||'<p class="empty">No reference notes yet.</p>':dataStatus('guides','Reference Notes',guidesStatus);
  return `<div class="intro"><div><h1>Outfit Notes</h1><p>Your existing notes are retained. Add or edit notes in Codex.</p></div><a class="btn" href="#outfits">← My Outfits</a></div><h2>My Notes</h2><div class="formula-grid">${personal}</div><h2>Reference Notes</h2><div class="formula-grid">${reference}</div>`;
}
