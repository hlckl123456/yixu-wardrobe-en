// Generic empty library; private editorial data is projected by the server.
export default {
  schemaVersion:1,codeRegistry:{},formulas:[],
  seasons:[['winter','Winter'],['autumn','Fall / Winter'],['transition','Spring / Fall'],['summer','Summer']].map(([id,name])=>({id,name,english:id.toUpperCase(),mood:'Start with Your Wardrobe',intro:'No style references yet.',range:'Organized by Complete Looks',formulaIds:[],weather:[],principles:[],note:''}))
};
