import { ANSWERS, FIGURES, PERSPECTIVES, QUESTIONS, SOURCES } from '../content/content.js';

const errors=[];
const assert=(condition,message)=>{if(!condition)errors.push(message);};
const unique=(items,label)=>assert(new Set(items).size===items.length,`${label} IDs must be unique`);
const words=value=>value.trim().split(/\s+/).filter(Boolean).length;

unique(QUESTIONS.map(x=>x.id),'Question');
unique(FIGURES.map(x=>x.id),'Figure');
unique(PERSPECTIVES.map(x=>x.id),'Perspective');
unique(ANSWERS.map(x=>x.id),'Answer');
unique(SOURCES.map(x=>x.id),'Source');
assert(QUESTIONS.length===18,`Expected 18 questions; got ${QUESTIONS.length}`);
assert(FIGURES.length===17,`Expected 17 identities; got ${FIGURES.length}`);
assert(PERSPECTIVES.length===18,`Expected 18 perspectives; got ${PERSPECTIVES.length}`);
assert(ANSWERS.length===324,`Expected 324 answers; got ${ANSWERS.length}`);
for(const [religion,count] of Object.entries({buddhism:5,christianity:6,islam:7})) assert(PERSPECTIVES.filter(p=>p.religion===religion).length===count,`${religion} must have ${count} perspectives`);
assert(PERSPECTIVES.filter(p=>p.figureId==='abraham').length===2,'Abraham must have two lenses');

for(const question of QUESTIONS){
  const answers=ANSWERS.filter(a=>a.questionId===question.id);
  assert(answers.length===18,`${question.id} must have 18 answers`);
  assert(new Set(answers.map(a=>a.perspectiveId)).size===18,`${question.id} has duplicate/missing perspective answers`);
}
for(const answer of ANSWERS){
  assert(QUESTIONS.some(q=>q.id===answer.questionId),`${answer.id} has unknown question`);
  assert(PERSPECTIVES.some(p=>p.id===answer.perspectiveId),`${answer.id} has unknown perspective`);
  assert(answer.reviewStatus!=='draft',`${answer.id} remains a draft`);
  assert(words(answer.body)>=50&&words(answer.body)<=100,`${answer.id} body is ${words(answer.body)} words (expected 50–100)`);
  assert(words(answer.thesis)>=3&&words(answer.thesis)<=16,`${answer.id} thesis is ${words(answer.thesis)} words`);
  assert(answer.sourceIds.length>0,`${answer.id} has no source`);
  for(const sourceId of answer.sourceIds)assert(SOURCES.some(s=>s.id===sourceId),`${answer.id} has missing source ${sourceId}`);
}
for(const source of SOURCES){
  let url; try{url=new URL(source.url);}catch{errors.push(`${source.id} URL is invalid`);}
  if(url)assert(url.protocol==='https:',`${source.id} must use HTTPS`);
  assert(Boolean(source.reference),`${source.id} needs a reference`);
}
const bodies=ANSWERS.map(a=>a.body);
assert(new Set(bodies).size===bodies.length,'Exact duplicate answer bodies detected');

if(errors.length){console.error(errors.map(e=>`• ${e}`).join('\n'));process.exit(1);}
console.log(`Validated ${QUESTIONS.length} questions, ${PERSPECTIVES.length} perspectives, ${FIGURES.length} identities, ${ANSWERS.length} answers, and ${SOURCES.length} sources.`);
