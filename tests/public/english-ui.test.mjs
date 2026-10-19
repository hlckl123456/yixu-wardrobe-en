import test from 'node:test';
import assert from 'node:assert/strict';
import {countLabel,seasonLabel,uiNames} from '../../dist/ui-copy.js';
import {basicName} from '../../dist/assumed-basics.js';
import {icon,closeButton,actionText,sources} from '../../dist/views/shared.js';
import {dataStatus} from '../../dist/views/data-status.js';
import {ownedCloset} from '../../dist/views/owned.js';
import {detailDialog,garmentOutfits} from '../../dist/views/dialogs.js';
import {realOutfits} from '../../dist/views/outfits.js';
import {referenceArticle,formulaImageDialog} from '../../dist/views/reference-reader.js';
import {garmentClassification,typeCriteria,subtypeLabel,categoryLabel} from '../../dist/data/garment-taxonomy.js';
import {classifySeason,seasonReason} from '../../dist/data/season-policy.js';

const item={id:'YW-0001',code:'SY01',name:'Synthetic blue shirt',collection:'owned',layer:'inner',subtype:'Long-sleeve Shirt',color:{name:'Blue',family:'blue',hex:'#446688'},fit:'Sample only',pattern:'Solid',uncertainties:[],assets:{cutout:'assets/items/synthetic/cutout.png'}};
const outfit={id:'synthetic-look',code:'DP01',title:'Synthetic outfit',selection:{inner:item.id},season:'transition',styleTags:['minimal'],visual:{kind:'ai',src:'assets/outfits/synthetic.png',alt:'Synthetic preview',garmentIds:[item.id]}};

test('English counts use singular and plural nouns consistently',()=>{
 for(const noun of ['item','outfit','look','color option','saved outfit']){
  assert.equal(countLabel(1,noun),'1 '+noun);
  assert.equal(countLabel(0,noun),'0 '+noun+'s');
  assert.equal(countLabel(2,noun),'2 '+noun+'s');
 }
});
test('basic layer names have natural word order and spacing',()=>{
 assert.equal(basicName({color:{name:'Cream'},sleeve:'long'}),'Cream long-sleeve crewneck T-shirt');
 assert.equal(basicName({color:{name:'Dusty blue'},sleeve:'short'}),'Dusty blue short-sleeve crewneck T-shirt');
});
test('display terms do not change category IDs or recorded subtype matching',()=>{
 assert.equal(uiNames.closet,'My wardrobe');
 assert.equal(garmentClassification(item).category,'shirt');
 assert.equal(typeCriteria(['Long-sleeve Shirt'])[0].sleeve,'long');
 assert.equal(subtypeLabel('Long-sleeve Shirt'),'Long-sleeve shirt');
 assert.equal(subtypeLabel('Crewneck KnitVest'),'Crewneck knit vest');
 assert.equal(subtypeLabel('Handmade BRAND top'),'Handmade BRAND top');
 assert.equal(categoryLabel('shirt',true),'Shirts');assert.equal(categoryLabel('tee',true),'T-shirts');
 assert.equal(categoryLabel('glasses',true),'Glasses');assert.equal(categoryLabel('scarf',true),'Scarves');
 assert.equal(seasonLabel('transition'),'Spring & fall');
 for(const [traits,expected]of [[{winterShell:'coat',sleeves:'long',bottom:'long',weight:'substantial'},'winter'],[{winterShell:'none',sleeves:'short',bottom:'short',weight:'light'},'summer'],[{winterShell:'none',sleeves:'long',bottom:'long',weight:'substantial'},'autumn'],[{winterShell:'none',sleeves:'long',bottom:'long',weight:'light'},'transition']]){
  assert.equal(classifySeason(traits),expected);assert(seasonReason(traits).length>0);
 }
});
test('all shared SVG icons are decorative, consistent, and non-focusable',()=>{
 for(const name of ['layout','hanger','shirt','coat','pants','shoe','accessories','inspiration','chart','trash','device','expand','close','arrow-right','arrow-left','external-link','info']){
  assert.match(icon(name),/viewBox="0 0 24 24"/);assert.match(icon(name),/aria-hidden="true"/);assert.match(icon(name),/focusable="false"/);
 }
 assert.match(closeButton('detail','Close item details'),/aria-label="Close item details"/);
 assert.match(actionText('Back to outfits','arrow-left'),/^<svg/);
 assert.match(actionText('View outfit'),/data-symbol="arrow-right"/);
});
test('new-tab hints are reserved for links that actually open a new tab',()=>{
 const html=sources(['sample'],{sources:[{id:'sample',url:'https://example.com',title:'Synthetic source'}]});
 assert.match(html,/target="_blank"/);assert.match(html,/opens in a new tab/);assert.match(html,/data-symbol="external-link"/);
});
test('loading and failure messages read naturally and retain recovery controls',()=>{
 const loading=dataStatus('catalog','Wardrobe items','loading'),failed=dataStatus('catalog','Wardrobe items','error');
 assert.match(loading,/Loading wardrobe items…/);assert.doesNotMatch(loading,/itemsLoading/);
 assert.match(failed,/Couldn’t load wardrobe items/);assert.match(failed,/data-resource-retry="catalog"/);assert.match(failed,/Try again/);
});
test('wardrobe filters describe saved outfit use rather than wear history',()=>{
 const html=ownedCloset({items:[item],closetLayer:'inner',usageCounts:new Map([[item.id,1]])});
 assert.match(html,/>Tops</);assert.match(html,/Not in any outfits/);assert.match(html,/In 1–2 outfits/);assert.match(html,/In 1 saved outfit/);
 assert.doesNotMatch(html,/\b1 items\b|\b1 saved outfits\b|Base Layer|Not Used/);
});
test('shoe and accessory details omit collar and sleeve fields',()=>{
 for(const [layer,subtype]of [['shoes','Sneakers'],['accessory','Glasses']]){
  const html=detailDialog({...item,layer,subtype},{outfits:[],status:'ready'});
  assert.doesNotMatch(html,/<dt>Neckline<|<dt>Sleeves</);
  assert.match(html,/Owned item/);assert.match(html,/Record details/);
 }
 assert.match(detailDialog(item,{outfits:[],status:'ready'}),/<dt>Neckline</);
});
test('saved outfit relationships preserve codes and handle one outfit correctly',()=>{
 const html=garmentOutfits([outfit]);assert.match(html,/1 saved outfit/);assert.doesNotMatch(html,/1 saved outfits/);
 assert.match(html,/#outfits\/synthetic-look/);assert.match(html,/data-related-outfit/);assert.match(html,/DP01/);
});
test('outfit cards distinguish internal navigation from image enlargement',()=>{
 const html=realOutfits({outfits:[outfit],items:[item]});
 assert.match(html,/View outfit/);assert.match(html,/data-symbol="arrow-right"/);assert.match(html,/data-symbol="expand"/);
 assert.match(html,/AI outfit preview/);assert.match(html,/1 outfit/);assert.doesNotMatch(html,/↗|1 outfits/);
});
test('reference controls explain matching and label their image actions',()=>{
 const variant={id:'synthetic-palette',title:'Synthetic colors',alt:'Synthetic illustration',kind:'ai',src:'assets/synthetic.png',palette:[['Blue','#446688']]};
 const formula={title:'Synthetic idea',studyStyle:{id:'synthetic-style',name:'Synthetic style',variants:[variant],tips:[]},studyVariant:variant};
 assert.match(referenceArticle(formula),/See options from my wardrobe/);
 const html=formulaImageDialog(formula,[variant],0);
 assert.match(html,/aria-label="Previous image"/);assert.match(html,/aria-label="Next image"/);assert.match(html,/Image 1 of 1/);assert.doesNotMatch(html,/↗/);
});
test('display rendering never edits the supplied garment or outfit records',()=>{
 const before=JSON.stringify([item,outfit]);
 detailDialog(item,{outfits:[outfit],status:'ready'});realOutfits({outfits:[outfit],items:[item]});
 assert.equal(JSON.stringify([item,outfit]),before);
});
