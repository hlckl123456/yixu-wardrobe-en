// A classic script starts independently of the module dependency graph.
(() => {
 const main=document.getElementById('main');let done=false;
 function fail(error){if(done)return;done=true;clearTimeout(timer);console.error('Wardrobe startup failed',error);main.replaceChildren();const box=document.createElement('div');box.className='error';const title=document.createElement('h2');title.textContent='Couldn’t open your wardrobe';const note=document.createElement('p');note.textContent='Some page files didn’t load. Reload the page to try again. Your saved data hasn’t changed.';const retry=document.createElement('button');retry.type='button';retry.className='btn primary';retry.textContent='Reload page';retry.onclick=()=>location.reload();box.append(title,note,retry);main.append(box);}
 const timer=setTimeout(()=>fail(new Error('Startup exceeded 20 seconds')),20000);
 import('./workspace.js').then(()=>{if(done)return;done=true;clearTimeout(timer);}).catch(fail);
})();
