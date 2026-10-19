// Explicit rejection is intentional: cached old tabs must not mutate retired state.
export const retiredCommands=['curate','choose','remove','clear-draft','restore-outfit','add-outfit','recover-backup'];
export const currentCommands=['upsert-owned-outfit','remove-owned-outfits','save-note','import-backup'];
export function assertCurrentCommand(type){
  if(retiredCommands.includes(type)){
    const error=Error('This legacy operation is retired. Reload the page. Existing records are unchanged; add outfits through Codex.');
    error.code='RETIRED_OPERATION';throw error;
  }
  if(!currentCommands.includes(type))throw Error('Unknown data operation');
}
