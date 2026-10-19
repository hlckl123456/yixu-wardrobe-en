// A classic script starts independently of the module dependency graph.
(() => {
 const main=document.getElementById('main');let done=false;
 function fail(error){if(done)return;done=true;clearTimeout(timer);console.error('Wardrobe startup failed',error);main.replaceChildren();const box=document.createElement('div');box.className='error';const title=document.createElement('h2');title.textContent='Unable to Open Wardrobe';const note=document.createElement('p');note.textContent='Page resources did not finish loading. Retry, or open this address in your browser. Your wardrobe records have not changed.';const retry=document.createElement('button');retry.className='btn primary';retry.textContent='Reopen';retry.onclick=()=>location.reload();box.append(title,note,retry);main.append(box);}
 const timer=setTimeout(()=>fail(new Error('Startup exceeded 20 seconds')),20000);
 import('./workspace.js').then(()=>{if(done)return;done=true;clearTimeout(timer);}).catch(fail);
})();
