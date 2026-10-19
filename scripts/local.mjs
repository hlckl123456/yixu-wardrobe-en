import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {projectRoot, localPort, rootTag, healthPath} from './local-server.mjs';
import {dataDirectory} from './data-paths.mjs';
import crypto from 'node:crypto';

const action = process.argv[2] || 'start';
const port = process.argv[3] === undefined ? localPort : Number(process.argv[3]);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('Invalid local port');
const origin = `http://127.0.0.1:${port}`;
const runDir = path.join(dataDirectory(),'run');
const stateFile = path.join(runDir,`${port}.json`);
const logFile = path.join(runDir,`${port}.log`);

async function health() {
  return new Promise((resolve,reject) => {
    const request = http.get(origin + healthPath, {timeout:1500},response => {
      let body = '';
      response.on('data',chunk => {body += chunk; if(body.length > 10000) request.destroy(Error('Port is occupied by another service'));});
      response.on('end',() => {
        try {
          const data = JSON.parse(body);
          if (response.statusCode !== 200 || data.app !== 'yixu-local' || data.rootTag !== rootTag || data.origin !== origin) throw Error();
          resolve(data);
        } catch {reject(Error(`Port ${port} is occupied by another service; no process was stopped.`));}
      });
    });
    request.on('timeout',() => request.destroy(Error('The local service is not responding; no process was stopped.')));
    request.on('error',error => error.code === 'ECONNREFUSED' ? resolve(null) : reject(error));
  });
}

try {
  if (!['start','stop','status'].includes(action)) throw Error('Usage: node scripts/local.mjs start|stop|status');
  let current = await health();
  if (action === 'start') {
    if(current?.version>=3&&current.dataTag!==crypto.createHash('sha256').update(path.resolve(dataDirectory())).digest('hex').slice(0,16))throw Error('This port is using another data directory. Nothing was switched or overwritten. Check and stop that service first.');
    if (!current) {
      fs.mkdirSync(runDir,{recursive:true,mode:0o700});
      const log = fs.openSync(logFile,'a',0o600);
      const child = spawn(process.execPath,[path.join(projectRoot,'scripts/local-server.mjs'),String(port)],{
        cwd:projectRoot, detached:true, stdio:['ignore',log,log]
      });
      let startError;
      child.on('error',error => {startError=error;});
      child.unref(); fs.closeSync(log);
      for (let i=0;i<40&&!current;i++) {if(startError)throw startError; await delay(100); current=await health();}
      if (!current) throw Error(`Unable to start. Check ${logFile}`);
      fs.writeFileSync(stateFile,JSON.stringify(current,null,2),{mode:0o600});
    }
    console.log(`English wardrobe is running locally: ${origin}/#outfits\nListening on 127.0.0.1 only. Closing this window will not stop the service.\nTo stop: npm stop (outfits and notes will be kept).`);
  } else if (action === 'status') {
    console.log(current ? `Running: ${origin}/#outfits (PID ${current.pid})` : 'The local wardrobe is not running.');
    if (!current) process.exitCode=1;
  } else {
    if (!current) console.log('The local wardrobe is already stopped.');
    else {
      const recorded = JSON.parse(fs.readFileSync(current.version<3?path.join(projectRoot,'.local-run',`${port}.json`):stateFile,'utf8'));
      if (recorded.pid !== current.pid || recorded.rootTag !== rootTag) throw Error('Unable to verify the service owner; no process was stopped.');
      process.kill(current.pid,'SIGTERM');
      for (let i=0;i<40;i++) {await delay(100); if(!await health()){current=null;break;}}
      if (current) throw Error('The service has not stopped yet. Check its status again shortly.');
      console.log('The local wardrobe has stopped. Outfits, notes and garment records were kept.');
    }
  }
} catch (error) {console.error(error.message);process.exitCode=1;}
