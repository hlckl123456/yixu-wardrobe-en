import {seasonLabel} from '../ui-copy.js';
// Generic empty library; private editorial data is projected by the server.
export default {
  schemaVersion:1,codeRegistry:{},formulas:[],
  seasons:['winter','autumn','transition','summer'].map(id=>({id,name:seasonLabel(id),english:id.toUpperCase(),mood:'Start with your wardrobe',intro:'No inspiration saved yet.',range:'Grouped by complete look',formulaIds:[],weather:[],principles:[],note:''}))
};
