// Image evidence and ownership are separate: an owned item may have an AI
// reconstruction, which must never be presented as an untouched product photo.
export const isReconstructed=item=>item.provenance?.processingMethod==='ai-reconstruction';
export function validateImageEvidence(item){
  if(isReconstructed(item)&&item.provenance?.review?.reconstructionAuthorized!==true)throw Error('AI image reconstruction requires user authorization');
  if(item.userConfirmedDetails!==undefined&&(!Array.isArray(item.userConfirmedDetails)||item.userConfirmedDetails.some(t=>typeof t!=='string'||!t.trim()||t.length>300)))throw Error('Invalid user-confirmed details');
}
export const imageNotice='AI redraw based on garment photos, with obscured areas reconstructed. Texture, hardware, seams and proportions may differ from the actual item.';
