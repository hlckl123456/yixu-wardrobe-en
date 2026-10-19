import {library,selectReference} from '../reference-model.js';
import {referenceHref} from '../navigation-model.js';
import {referenceArticle} from './reference-reader.js';
import {matchingPanel} from './owned.js';
import {esc,codeBadge} from './shared.js';
import {dataStatus} from './data-status.js';

export function referenceLibrary({formulaRoute:r,studyFormula,items=[],seasonBackgroundOpen={},catalogStatus='ready'}){
  if(r.error)return `<div class="intro"><div><h1>Invalid Reference Link</h1><p>No alternative style has been selected.</p></div></div><section class="data-recovery" role="alert"><p>${esc(r.error)}</p><a class="btn" href="#formulas/library">Back to Style References</a></section>`;
  const season=library.seasons.find(s=>s.id===r.section);
  const entries=library.formulas.flatMap(formula=>formula.styles.map(style=>({formula,style})));
  const visible=entries.filter(e=>!season||e.style.seasons[0]===season.id);
  const current=studyFormula;
  return `<div class="formula-library reference-library"><div class="fl-heading"><div><span class="eyebrow">STYLE REFERENCES</span>${current?codeBadge(current.studyStyle):''}<h1>${current?esc(current.studyStyle.name):'Style References'}</h1><p>Start with a style you like, then explore your wardrobe. Reference images do not represent outfits you own.</p></div></div>
    <nav class="collection-seasons" aria-label="Reference seasons"><a href="#formulas/library" ${!season?'aria-current="page"':''}>All<span>${entries.length}</span></a>${library.seasons.map(s=>`<a href="#formulas/${s.id}" ${s.id===season?.id?'aria-current="page"':''}>${s.name}<span>${entries.filter(e=>e.style.seasons[0]===s.id).length}</span></a>`).join('')}</nav>
    ${r.notice?`<p class="note-block">${esc(r.notice)}</p>`:''}
    ${current?`<div class="reference-back"><a class="text-button" href="#formulas/${r.section}">← Back to ${esc(season?.name)} References</a><button class="btn" data-scroll-matches>My Clothes & Gaps ↓</button></div>${referenceArticle(current)}${catalogStatus==='ready'?matchingPanel(items,current):`<section id="owned-matches" tabindex="-1">${dataStatus('catalog','Garment Records',catalogStatus)}</section>`}`:
    `${season?background(season,visible,seasonBackgroundOpen[season.id]):''}<div class="reference-count"><h2>${season?season.name:'All'} Styles <small>${visible.length} looks</small></h2><p>Each look appears in one season. Switch colors and accessories in its details.</p></div><div class="collection-grid">${visible.map(({formula,style})=>{const selected=selectReference(formula,{style:style.id});return `<article class="collection-card" data-reference-card="${style.id}"><a class="collection-image" href="${referenceHref(formula,style)}"><img src="${selected.variant.src}" alt="${esc(style.name)}, AI styling illustration" loading="lazy" width="825" height="1100"><span>AI reference · Not my clothes</span></a><div class="collection-card-body"><a class="code-link" href="${referenceHref(formula,style)}" aria-label="View reference ${esc(style.code||style.id)}">${codeBadge(style)}</a><h2><a href="${referenceHref(formula,style)}">${esc(style.name)}</a></h2><p>${library.seasons.find(s=>s.id===style.seasons[0]).name} · ${style.variants.length} color options</p><a class="text-button" href="${referenceHref(formula,style)}">Styling & My Clothes →</a></div></article>`;}).join('')}</div>`}
    <div class="fl-foot"><button class="text-button" data-formula-sources="true">Sources & Seasons ↗</button><span>Category matching is not an actual try-on</span></div></div>`;
}
function background(season,entries,open){
  return `<details class="fl-season-background" data-season-background="${season.id}" ${open?'open':''}><summary><span>Seasonal Inspiration & Styling Principles</span><small>${entries.length} looks · ${season.principles.length} principles</small></summary><section class="fl-recent"><h2>Seasonal Inspiration</h2><div class="fl-recent-strip">${entries.map(({formula,style})=>`<a href="${referenceHref(formula,style)}"><img src="${style.variants[0].src}" alt="" loading="lazy"><span>${esc(style.code)} · ${esc(style.name)}</span></a>`).join('')}</div></section><section class="fl-principles"><h2>Styling Principles</h2><div class="fl-principle-grid">${season.principles.map(([title,text],i)=>`<details><summary><span>0${i+1}</span> ${esc(title)}</summary><p>${esc(text)}</p></details>`).join('')}</div></section></details>`;
}
