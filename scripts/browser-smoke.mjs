import { spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const baseUrl=process.argv[2] || 'http://localhost:8000/Religion_web/';
const takeScreenshots=process.argv.includes('--screenshots');
const edge='C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profile=await mkdtemp(join(tmpdir(),'religion-web-smoke-'));
const port=10000+Math.floor(Math.random()*40000);
const browser=spawn(edge,['--headless=new','--disable-gpu','--disable-breakpad','--disable-crash-reporter','--no-first-run',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});

const delay=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
async function getJson(path) {
  for(let attempt=0;attempt<40;attempt++){
    try { const response=await fetch(`http://127.0.0.1:${port}${path}`); if(response.ok)return response.json(); } catch {}
    await delay(100);
  }
  throw new Error('Browser debugging endpoint did not start.');
}

let socket;
let nextId=0;
const pending=new Map();
const errors=[];

function send(method,params={}) {
  const id=++nextId;
  socket.send(JSON.stringify({id,method,params}));
  return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}));
}

async function evaluate(expression) {
  const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
  if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function waitFor(expression,message) {
  for(let attempt=0;attempt<50;attempt++){
    if(await evaluate(expression))return;
    await delay(100);
  }
  throw new Error(message);
}

function assert(condition,message){if(!condition)throw new Error(message);}

try {
  const targets=await getJson('/json/list');
  const pageTarget=targets.find(target=>target.type==='page');
  if(!pageTarget)throw new Error('Browser page target was not available.');
  socket=new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
  socket.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(message.id&&pending.has(message.id)){
      const request=pending.get(message.id);pending.delete(message.id);
      if(message.error)request.reject(new Error(message.error.message));else request.resolve(message.result);
    }
    if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text);
    if(message.method==='Log.entryAdded'&&message.params.entry.level==='error')errors.push(message.params.entry.text);
  });
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Log.enable');
  await send('Page.navigate',{url:baseUrl});
  await waitFor("document.readyState==='complete' && document.querySelectorAll('.question-card').length===6",'Homepage did not show six featured questions.');
  assert((await evaluate('document.body.innerText.trim().length'))>500,'Homepage was blank or incomplete.');

  await evaluate("document.querySelector('[data-category=\"success-worth\"]').click()");
  await waitFor("document.querySelectorAll('.question-card').length===3",'Category did not expose all three questions.');
  await evaluate("document.querySelector('[data-category=\"all\"]').click(); document.querySelector('.browse-all').click()");
  await waitFor("document.querySelectorAll('.question-card').length===18",'Browse all did not expose all 18 questions.');

  await evaluate("const input=document.querySelector('#question-search');input.value='my partner left me';input.dispatchEvent(new Event('input',{bubbles:true}))");
  await waitFor("document.querySelector('.question-card h3')?.textContent.includes('partner left me')",'Prepared-question matching failed.');

  await evaluate("location.hash='/question/q01-replaced'");
  await waitFor("document.querySelectorAll('.tradition-column').length===3",'Question route did not render three traditions.');
  assert(await evaluate("document.querySelectorAll('.tradition-column > .answer-card').length===3 && document.querySelectorAll('.more-answers[hidden]').length===3"),'Question route did not begin with three lead perspectives.');
  await evaluate("document.querySelector('.reveal-button').click();const leadButtons=document.querySelectorAll('.tradition-column > .answer-card .compare-button');leadButtons[0].click();leadButtons[1].click()");
  assert(await evaluate("document.querySelectorAll('.more-answers:not([hidden])').length===1"),'Selecting comparisons collapsed an expanded tradition.');
  await waitFor("Boolean(document.querySelector('.compare-bar .button-link'))",'Comparison link did not appear.');
  await evaluate("document.querySelector('.compare-bar .button-link').click()");
  await waitFor("document.querySelectorAll('.comparison-grid .answer-card').length===2",'Comparison route did not show two selections.');

  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await delay(150);
  assert(await evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'),'390px comparison view overflowed horizontally.');
  await evaluate("location.hash='/questions'");
  await waitFor("Boolean(document.querySelector('.questions-page'))",'Questions route failed after mobile emulation.');
  assert(await evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'),'390px homepage overflowed horizontally.');
  await send('Emulation.setDeviceMetricsOverride',{width:360,height:800,deviceScaleFactor:1,mobile:true});
  await delay(100);
  assert(await evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'),'360px homepage overflowed horizontally.');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  if(takeScreenshots){
    const capture=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    await writeFile(join(process.cwd(),'.browser-mobile.png'),Buffer.from(capture.data,'base64'));
  }
  await evaluate("document.querySelector('#skip-link').focus();document.querySelector('#skip-link').click()");
  assert(await evaluate("document.activeElement?.id==='main-content'"),'Skip link did not focus main content.');

  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  if(takeScreenshots){
    await evaluate("location.hash='/question/q01-replaced'");
    await waitFor("document.querySelectorAll('.tradition-column').length===3",'Desktop question view did not render.');
    const capture=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    await writeFile(join(process.cwd(),'.browser-desktop.png'),Buffer.from(capture.data,'base64'));
  }
  await evaluate("location.hash='/question/not-a-question'");
  await waitFor("document.querySelectorAll('.not-found-actions a').length===2",'Invalid route did not offer recovery actions.');

  await send('Page.navigate',{url:new URL('journeys.html',baseUrl).href});
  await waitFor("document.readyState==='complete' && document.body.innerText.includes('Journeys')",'Historical journeys page did not load.');
  assert(await evaluate("const rect=document.querySelector('#map').getBoundingClientRect();rect.width<=innerWidth && rect.height<=innerHeight"),'Historical map did not fit its fixed viewport.');

  const filteredErrors=errors.filter(error=>!error.includes('favicon'));
  assert(filteredErrors.length===0,`Browser errors: ${filteredErrors.join(' | ')}`);
  console.log('Browser smoke test passed: routes, search, all categories, comparison, skip link, mobile width, invalid-route recovery, and Journeys.');
} finally {
  if(socket){try{await send('Browser.close');}catch{}socket.close();}
  if(process.platform==='win32'){
    await new Promise(resolve=>spawn('taskkill',['/pid',String(browser.pid),'/T','/F'],{stdio:'ignore'}).once('exit',resolve));
  } else browser.kill();
  await Promise.race([new Promise(resolve=>browser.once('exit',resolve)),delay(1500)]);
  for(let attempt=0;attempt<20;attempt++){
    try { await rm(profile,{recursive:true,force:true}); break; }
    catch(error) { if(attempt===19)console.warn(`Temporary browser profile remains at ${profile}: ${error.code}`); await delay(500); }
  }
}
