const fs=require('fs');
const filename=process.argv[2];
const html=fs.readFileSync(filename,'utf8');
const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const E=new Function('window','globalThis',scripts[0]+';return globalThis.EcoEngine;')(undefined,{});
const ui=scripts[1];
const init=ui.slice(ui.indexOf('    state.timeHours = 8;',ui.indexOf('function loadLongLifePreset')),ui.indexOf('    state.events = [{',ui.indexOf('function loadLongLifePreset')));
const state=new Function('E','let state=E.createState(2606);'+init+';return state;')(E);
const records=[];
let minO2=Infinity,maxO2=-Infinity,firstFishLoss=null;
for(let k=0;k<180*24*4;k++){
 E.step(state,.25);
 const o2=E.mean(state.fields.o2);
 minO2=Math.min(minO2,o2);maxO2=Math.max(maxO2,o2);
 if(firstFishLoss===null && !state.animals.some(a=>a.kind==='fish'))firstFishLoss=(state.timeHours-8)/24;
 if([30*24*4,90*24*4,180*24*4].includes(k+1))records.push({elapsedDays:(k+1)/96,...E.summaries(state)});
}
console.log(JSON.stringify({filename,minO2,maxO2,firstFishLoss,records},null,2));
