import {classifySeason,seasonOrder} from './data/season-policy.js';
import {validateTypeCriteria} from './data/garment-taxonomy.js';
import {validateRecordCodes} from './communication-codes.js';

const roles=new Set(['outer','middle','inner','bottom','shoes','belt','bag','accessory']);
export function validateReferenceCatalog(data){
  if(data.codeRegistry)validateRecordCodes(data.formulas.flatMap(f=>f.styles),data.codeRegistry);
  if(data.schemaVersion!==1)throw Error('Unsupported reference catalog version');
  if(JSON.stringify(data.seasons.map(s=>s.id))!==JSON.stringify(seasonOrder))throw Error('Invalid season order');
  const formulaIds=new Set(),styleIds=new Set();
  for(const f of data.formulas){
    if(formulaIds.has(f.id)||!f.styles?.length)throw Error('Duplicate reference or missing styles');formulaIds.add(f.id);
    if(f.seasons.length!==1||f.seasons[0]!==classifySeason(f.traits))throw Error('Season does not match reference structure');
    for(const s of f.styles){
      if(styleIds.has(s.id)||s.formula!==f.id)throw Error('Duplicate style or incorrect parent');styleIds.add(s.id);
      if(JSON.stringify(s.seasons)!==JSON.stringify(f.seasons)||classifySeason(s.traits)!==f.seasons[0])throw Error('A style cannot be repeated across seasons');
      if(!s.requirements?.length||!s.tips?.length)throw Error('Style rules or notes missing');
      for(const r of [...s.requirements,...(s.accessories||[]).flatMap(a=>a.requirement?[a.requirement]:[])]){
        if(!roles.has(r.slot)||!(r.layers||[r.layer]).every(l=>['outer','inner','bottom','shoes','accessory'].includes(l)))throw Error('Invalid garment role');
        if(r.subtypes?.includes('Tie'))throw Error('Tie styles are no longer supported');
        if(r.subtypes)validateTypeCriteria(r.types);
      }
      for(const variants of [s.variants,...(s.accessories||[]).map(a=>a.variants)]){
        if(!variants?.length||new Set(variants.map(v=>v.id)).size!==variants.length)throw Error('Empty or duplicate palettes');
        for(const v of variants)if(!/^\/?assets\/formulas\/[\w/-]+\.(jpg|png|webp)$/.test(v.src)||!v.palette?.length)throw Error('Invalid reference image or palette: '+v.id);
      }
      if(s.accessories&&(new Set(s.accessories.map(a=>a.id)).size!==s.accessories.length||!s.accessories.some(a=>a.id===s.defaultAccessory)))throw Error('Invalid accessory options or default');
    }
  }
  const indexed=data.seasons.flatMap(s=>s.formulaIds);
  if(indexed.length!==formulaIds.size||new Set(indexed).size!==indexed.length||indexed.some(id=>!formulaIds.has(id)))throw Error('Season index and references differ');
  for(const season of data.seasons)if(season.formulaIds.some(id=>data.formulas.find(f=>f.id===id).seasons[0]!==season.id))throw Error('Invalid season index');
  return data;
}


// Pure reference selection. No routes, personal preferences, draft or storage.
export function selectReference(formula,selection={}){
  const specified=value=>value!==undefined&&value!==null;
  const base=specified(selection.style)?formula.styles.find(s=>s.id===selection.style):formula.styles[0];
  if(!base)throw Error('Requested style does not exist');
  const option=specified(selection.accessory)?base.accessories?.find(a=>a.id===selection.accessory):base.accessories?.find(a=>a.id===base.defaultAccessory);
  if(specified(selection.accessory)&&!option)throw Error('Requested accessory version does not exist');
  const style=option?{...base,variants:option.variants,requirements:[...base.requirements,...(option.requirement?[option.requirement]:[])]}:base;
  const variant=specified(selection.palette)?style.variants.find(v=>v.id===selection.palette):style.variants[0];
  if(!variant)throw Error('Requested palette does not exist');
  return {season:base.seasons[0],style,variant,accessory:option?.id};
}
