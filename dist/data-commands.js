import {normalizePreferences} from './data-schema.js';
import {fitsSlot} from './garment-model.js';
import {mergeBackup} from './backup-model.js';
import {assertCurrentCommand} from './compatibility/retired-commands.js';
import {isActiveGarment} from './garment-status.js';
import {assertLayeringSelection} from './layering-limits.js';

// Pure business operations: no DOM, navigation, storage, or view state.
export function applyCommand(previous, command, items = [], resolveReference) {
  assertCurrentCommand(command?.type);
  const data = normalizePreferences(previous);
  switch (command.type) {
    case 'upsert-owned-outfit':
    case 'upsert-planned-outfit': {
      const record=normalizePreferences({outfits:[command.record]}).outfits[0];
      if((command.type==='upsert-planned-outfit')!==(record.outfitKind==='planned'))throw Error('Choose the owned-outfit or planned-outfit command explicitly');
      if(record.sourceReference&&!resolveReference?.(record.sourceReference))throw Error('The style reference is invalid or unavailable; outfit not saved');
      const entries=Object.entries(record.selection);
      if(!entries.length||new Set(entries.map(([,id])=>id)).size!==entries.length)throw Error('An outfit must contain garments, with each garment used once');
      for(const [slot,id] of entries){
        const item=items.find(i=>i.id===id&&i.collection==='owned');
        if(!item||!fitsSlot(item,slot))throw Error('Garment missing or unsuitable for this slot: '+id);
        if(!isActiveGarment(item))throw Error('Garment is set aside; restore it before use: '+(item.code||id));
      }
      assertLayeringSelection(record.selection,items);
      const index=data.outfits.findIndex(o=>o.id===record.id);
      if(record.derivedFromOutfitId){
        const source=data.outfits.find(o=>o.id===record.derivedFromOutfitId);
        if(!source&&data.outfits[index]?.derivedFromOutfitId!==record.derivedFromOutfitId)throw Error('Original outfit missing; link not saved');
        const visited=new Set([record.id]);let current=source;
        while(current){if(visited.has(current.id))throw Error('Outfit derivation links cannot contain cycles');visited.add(current.id);current=data.outfits.find(o=>o.id===current.derivedFromOutfitId);}
      }
      if(index!==-1&&JSON.stringify(data.outfits[index])!==JSON.stringify(command.expected))throw Error('Outfit changed; reload before editing');
      if(index===-1&&command.expected)throw Error('Outfit to edit no longer exists');
      if(index!==-1&&data.outfits[index].code){
        if(record.code&&record.code!==data.outfits[index].code)throw Error('Assigned outfit codes cannot be changed');
        record.code=data.outfits[index].code;
      }
      if(index===-1)data.outfits.push(record);else data.outfits[index]=record;
      break;
    }
    case 'remove-owned-outfits': {
      // Codex maintenance only: exact IDs plus full stale-write guards, never
      // list positions or a wildcard. Validate the entire batch before removal.
      if(!Array.isArray(command.records)||!command.records.length||command.records.length>100)throw Error('Specify the exact outfits to remove');
      const ids=command.records.map(r=>r?.id);
      if(ids.some(id=>typeof id!=='string'||!id)||new Set(ids).size!==ids.length)throw Error('Removal contains invalid or duplicate outfit codes');
      for(const expected of command.records){
        const actual=data.outfits.find(o=>o.id===expected.id);
        if(!actual)throw Error('Outfit to remove no longer exists: '+expected.id);
        if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('Outfit changed; reload before removing: '+expected.id);
      }
      data.outfits=data.outfits.filter(o=>!ids.includes(o.id));
      break;
    }
    case 'save-note': {
      const index = data.saved.findIndex(x => x.id === command.record.id);
      if ((index!==-1||command.expected) && JSON.stringify(data.saved[index]) !== JSON.stringify(command.expected)) throw Error('Note changed; reload before editing');
      if (index === -1) data.saved.push(command.record);
      else data.saved[index] = command.record;
      break;
    }
    case 'import-backup': {
      if (command.expected && JSON.stringify(data) !== JSON.stringify(normalizePreferences(command.expected))) throw Error('Records changed elsewhere; select the backup again to review the latest preview');
      return mergeBackup(data, command.data, command.options);
    }
    default: throw Error('Unknown data operation');
  }
  return normalizePreferences(data);
}
