// Persisted selections contain occupied slots only; UI placeholders are projections.
import {legacyOutfitLink,normalizeHistoricalCuration} from './compatibility/personal-history.js';
import {outfitSeasons,outfitStyles} from './outfit-model.js';
import {validCode} from './communication-codes.js';
import {normalizeAssumedBasics} from './assumed-basics.js';
export const selectionSlots = ['outer', 'middle', 'inner', 'tie', 'bottom', 'shoes', 'belt', 'bag', 'accessory'];
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
export const emptyPreferences = () => ({selections: {owned: {}}, outfits: [], saved: []});

export function compactSelection(value = {}) {
  if (!object(value)) throw Error('Invalid outfit garment data');
  const entries = Object.entries(value).filter(([, id]) => id != null);
  if (entries.some(([slot, id]) => !selectionSlots.includes(slot) || typeof id !== 'string' || !id)) throw Error('Invalid garment slot or code in outfit');
  return Object.fromEntries(selectionSlots.filter(slot => value[slot] != null).map(slot => [slot, value[slot]]));
}

function records(value, kind, repairDuplicates) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw Error(`Invalid ${kind} format`);
  const seen = new Set(), reserved = new Set(value.map(x => x?.id));
  return value.map(record => {
    if (!object(record) || typeof record.id !== 'string' || !record.id || typeof record.title !== 'string') throw Error(`Invalid ${kind} record`);
    let id = record.id;
    if (seen.has(id)) {
      if (!repairDuplicates) throw Error(`Duplicate ${kind} code: ${id}`);
      let n = 2;
      while (reserved.has(`${id}~${n}`) || seen.has(`${id}~${n}`)) n++;
      id = `${id}~${n}`;
    }
    seen.add(id);
    if (kind === 'note') {
      if (typeof record.text !== 'string') throw Error('Invalid note content');
      return {id, title: record.title, text: record.text};
    }
    if (!object(record.selection)) throw Error('Invalid outfit garment data');
    return {
      id, title: record.title, selection: compactSelection(record.selection),
      ...legacyOutfitLink(record),
      createdAt: typeof record.createdAt === 'string' ? record.createdAt : '',
      ...outfitPresentation(record)
    };
  });
}

function outfitPresentation(record){
  const result={};
  if(record.suggestedPieces!==undefined&&(!Array.isArray(record.suggestedPieces)||record.suggestedPieces.length))throw Error('A concept with unowned items cannot be saved as an owned outfit; confirm actual garments first');
  if(record.code!==undefined){
    if(!validCode(record.code,'DP'))throw Error('Invalid outfit code');
    result.code=record.code;
  }
  if(record.displayTitle!==undefined){
    if(typeof record.displayTitle!=='string'||!record.displayTitle.trim()||record.displayTitle.length>120)throw Error('Invalid outfit display title');
    result.displayTitle=record.displayTitle;
  }
  if(record.season!==undefined){
    if(!outfitSeasons.some(s=>s.id===record.season))throw Error('Invalid outfit season');
    result.season=record.season;
  }
  if(record.styleTags!==undefined){
    if(!Array.isArray(record.styleTags)||!record.styleTags.length||new Set(record.styleTags).size!==record.styleTags.length||record.styleTags.some(id=>!outfitStyles.some(s=>s.id===id)))throw Error('Invalid outfit style tags');
    result.styleTags=[...record.styleTags];
  }
  if(record.wearingNotes!==undefined){
    if(!Array.isArray(record.wearingNotes)||record.wearingNotes.some(t=>typeof t!=='string'||t.length>3000))throw Error('Invalid styling notes');
    result.wearingNotes=[...record.wearingNotes];
  }
  if(record.assumedBasics!==undefined)result.assumedBasics=normalizeAssumedBasics(record.assumedBasics);
  if(record.derivedFromOutfitId!==undefined){
    if(typeof record.derivedFromOutfitId!=='string'||!record.derivedFromOutfitId.trim()||record.derivedFromOutfitId.length>200||record.derivedFromOutfitId===record.id)throw Error('Invalid original outfit link');
    result.derivedFromOutfitId=record.derivedFromOutfitId;
  }
  if(record.sourceReference!==undefined){
    if(typeof record.sourceReference!=='string'||!/^#formulas\/[a-z-]+\/[a-z-]+(?:\?[^\s]*)?$/.test(record.sourceReference))throw Error('Invalid style reference link');
    result.sourceReference=record.sourceReference;
  }
  if(record.visual!==undefined){
    const v=record.visual;
    if(!object(v)||!['ai','photo'].includes(v.kind)||typeof v.src!=='string'||!/^assets\/outfits\/[\w/-]+\.(png|jpg|jpeg|webp)$/.test(v.src)||v.src.includes('..')||typeof v.alt!=='string'||!v.alt.trim())throw Error('Outfit visuals must use registered local outfit images and record provenance');
    const ids=Object.values(compactSelection(record.selection)).sort();
    if(!Array.isArray(v.garmentIds)||v.garmentIds.some(id=>typeof id!=='string')||JSON.stringify([...v.garmentIds].sort())!==JSON.stringify(ids))throw Error('Image garment IDs must match the outfit');
    result.visual={src:v.src,alt:v.alt,kind:v.kind,garmentIds:[...v.garmentIds]};
  }
  return result;
}

export function normalizePreferences(data, {repairDuplicates = false} = {}) {
  if (!object(data) || (data.schemaVersion !== undefined && ![1, 2, 3].includes(data.schemaVersion))) throw Error('Unsupported local data version; retain a backup and update the page');
  return {
    selections: {owned: compactSelection(data.selections?.owned ?? {})},
    outfits: records(data.outfits, 'outfit', repairDuplicates),
    saved: records(data.saved, 'note', repairDuplicates),
    ...(data.curation !== undefined ? {curation:normalizeHistoricalCuration(data.curation)} : {})
  };
}

export function validateBackup(data) {
  if (!object(data) || data.format !== 'yixu-backup' || ![1, 2, 3].includes(data.version) || !Array.isArray(data.outfits) || (data.version===3&&!Array.isArray(data.curation))) throw Error('Unsupported Yixu backup file');
  if (data.version >= 2 && (!object(data.selections) || !object(data.selections.owned))) throw Error('Backup is missing outfit drafts');
  const {outfits, saved, selections, curation} = normalizePreferences(data);
  return {outfits, saved, ...(data.version >= 2 ? {selections} : {}), ...(data.version===3?{curation}:{})};
}
