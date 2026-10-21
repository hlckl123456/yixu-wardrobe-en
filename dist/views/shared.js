import {thumbnails} from '../thumbnail-manifest.js';
import {isReconstructed,imageNotice} from '../garment-image.js';
export {countLabel,itemTerm,uiNames,seasonLabel} from '../ui-copy.js';

export const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

export const codeBadge=record=>record.code?`<span class="communication-code" data-code="${esc(record.code)}" aria-label="Code ${esc(record.code)}">${esc(record.code)}</span>`:'';
export const garmentImageBadge=item=>isReconstructed(item)?`<span class="garment-ai-badge" data-ai-garment-image title="${esc(imageNotice)}">AI-reconstructed image</span>`:'';

const paths = {
  layout: 'M3 3h7v18H3z M14 3h7v18h-7z M5 6h3 M16 6h3',
  shuffle: 'M3 7h3c5 0 7 10 12 10h3 M18 14l3 3-3 3 M3 17h3c2 0 4-2 6-5 M14 9c1-1 2-2 4-2h3 M18 4l3 3-3 3',
  hanger: 'M9 6a3 3 0 1 1 3 3v3 M12 12 3 17v3h18v-3z',
  shirt: 'm8 3-5 3-2 5 5 2v8h12v-8l5-2-2-5-5-3c0 4-8 4-8 0',
  coat: 'm8 3-5 3v15h7l2-15 2 15h7V6l-5-3-4 3z',
  pants: 'M5 3h14l2 18h-7l-2-12-2 12H3z',
  shoe: 'M3 9v11h18v-5l-8-2-4-6-3 3z M3 17h18 M12 10l-2 2 M15 12l-2 2',
  accessories: 'M2 10h6l1 7H3z M16 10h6l-1 7h-6z M8 11c2-2 6-2 8 0 M2 10 1 7 M22 10l1-3',
  belt: 'M3 8h18v8H3z M8 6h8v12H8z',
  book: 'M3 4h7l2 2 2-2h7v16h-7l-2 1-2-1H3z M12 6v15',
  inspiration: 'M4 4h16v16H4z M4 15l5-5 5 5 3-3 3 3 M15 8h1',
  chart: 'M4 20V11h4v9 M10 20V4h4v16 M16 20V8h4v12',
  trash: 'M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7',
  lock: 'M6 10h12v11H6z M8 10V6a4 4 0 0 1 8 0v4',
  device: 'M3 4h18v13H3z M8 21h8 M12 17v4',
  'arrow-right': 'M4 12h16 M14 6l6 6-6 6',
  'arrow-left': 'M20 12H4 M10 6l-6 6 6 6',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-left': 'M15 5l-7 7 7 7',
  'chevron-right': 'M9 5l7 7-7 7',
  expand: 'M8 3H3v5 M16 3h5v5 M21 16v5h-5 M8 21H3v-5',
  'external-link': 'M14 3h7v7 M21 3 10 14 M10 4H4v16h16v-6',
  close: 'M6 6l12 12 M18 6 6 18',
  check: 'M5 12l4 4L19 6',
  info: 'M12 8h.01 M12 11v6 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0'
};

export const icon = name => `<svg class="icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" data-symbol="${esc(name)}"><path d="${paths[name] || paths.shirt}"/></svg>`;
export const closeButton=(target,label)=>`<button type="button" class="close-btn" data-close="${esc(target)}" aria-label="${esc(label)}">${icon('close')}</button>`;
export const actionText=(label,name='arrow-right')=>name==='arrow-left'?`${icon(name)}${esc(label)}`:`${esc(label)}${icon(name)}`;

export function sources(ids, guides) {
  return ids.map(id => {
    const source = guides.sources.find(x => x.id === id);
    return source?.url
      ? `<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.title)} ${icon('external-link')}<span class="visually-hidden"> (opens in a new tab)</span></a>`
      : esc(source?.title || '');
  }).join(' · ');
}

export function intro(title, subtitle) {
  return `<section class="intro"><div><h1>${title}</h1><p>${subtitle}</p></div></section>`;
}

export const empty = () => '<div class="empty">Your wardrobe is empty.<br>Send photos of your clothes in Codex chat to add your first items.</div>';

// Derived thumbnails are optional; the reviewed cutout is the retained image.
const imageVersion=item=>/^[a-f0-9]{64}$/.test(item.provenance?.cutoutSha256||'')?item.provenance.cutoutSha256.slice(0,12):null;
export const cutoutImage=item=>item.assets.cutout+(imageVersion(item)?'?v='+imageVersion(item):'');
export function thumbnail(item){
  const cached=thumbnails[item.id],version=imageVersion(item);
  // The JS thumbnail manifest may predate a live catalog update. Never reuse an
  // old garment image just because the stable garment ID is unchanged.
  return cached&&version&&cached.endsWith('-'+version+'.webp')?cached:cutoutImage(item);
}
