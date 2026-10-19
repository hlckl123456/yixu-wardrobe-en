// Short human-facing aliases. Internal IDs remain the relationship keys.
export const garmentPrefixes={outer:'WT',inner:'SY',bottom:'KZ',shoes:'XZ',accessory:'PS'};
const prefixes=['WT','SY','KZ','XZ','PS','DP','CK'];
export function validCode(code,prefix){
  if(typeof code!=='string'||!/^([A-Z]{2})(\d{2,})$/.test(code))return false;
  const head=code.slice(0,2),n=Number(code.slice(2));
  return prefixes.includes(head)&&(!prefix||head===prefix)&&Number.isSafeInteger(n)&&n>0&&code===head+String(n).padStart(2,'0');
}
export function validateRegistry(registry){
  if(!registry||typeof registry!=='object'||Array.isArray(registry))throw Error('Invalid code registry');
  const values=Object.values(registry);
  if(values.some(c=>!validCode(c))||new Set(values).size!==values.length)throw Error('Invalid or duplicate code');
  return registry;
}
// Retain all issued aliases, including deleted records. Never derive a code
// from the current list order, filter or count. Reclassification keeps its alias.
export function assignCodes(records,previous={},prefixFor,{importing=false}={}){
  const registry={...validateRegistry(previous)},used=new Set(Object.values(registry));
  const seen=new Set();
  const reserve=(id,code)=>{Object.defineProperty(registry,id,{value:code,enumerable:true,configurable:true,writable:true});used.add(code);};
  // Reserve explicit existing aliases before filling gaps in a mixed old/new
  // import. A preceding unnumbered row must not steal a later row's alias.
  for(const record of records){
    if(!record.id||seen.has(record.id))throw Error('Internal IDs are missing or duplicated in the code registry');
    seen.add(record.id);
    const prefix=prefixFor(record);
    if(!prefixes.includes(prefix))throw Error('Unknown code category');
    const code=Object.hasOwn(registry,record.id)?registry[record.id]:null;
    if(record.code!==undefined&&!validCode(record.code))throw Error('Invalid code format');
    if(code&&record.code&&record.code!==code&&!importing)throw Error('Assigned codes cannot be changed');
    if(!code&&record.code){
      if(!used.has(record.code)&&validCode(record.code,prefix))reserve(record.id,record.code);
      else if(!importing)throw Error('Code already used or category mismatch');
    }
  }
  const numbered=records.map(record=>{
    let code=Object.hasOwn(registry,record.id)?registry[record.id]:null;
    if(!code){
      const prefix=prefixFor(record);
      const max=Math.max(0,...[...used].filter(c=>c.startsWith(prefix)).map(c=>Number(c.slice(2))));
      code=prefix+String(max+1).padStart(2,'0');
      if(!validCode(code,prefix))throw Error('Code range exhausted');
      reserve(record.id,code);
    }
    return {...record,code};
  });
  return {records:numbered,registry};
}
export function validateRecordCodes(records,registry){
  validateRegistry(registry);
  if(records.some(r=>!Object.hasOwn(registry,r.id)||registry[r.id]!==r.code))throw Error('Record and code registry mismatch');
  if(new Set(records.map(r=>r.code)).size!==records.length)throw Error('Duplicate record code');
}
export const displayCode=record=>record.code||record.id;
export function resolveCode(records,value){
  const matches=records.filter(r=>r.id===value||r.code===String(value).toUpperCase());
  if(matches.length!==1)throw Error('Codenot found or not unique: '+value);
  return matches[0];
}
