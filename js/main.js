import { CATEGORIES, QUESTIONS, PERSPECTIVES, FIGURES, RELIGIONS, answersFor, figureById, perspectiveById, questionById, sourceById } from '../content/content.js';
import { searchQuestions } from './search.js';

const app = document.querySelector('#app');
const live = document.querySelector('#live-region');
let activeCategory = 'all';
let searchValue = '';
let compareIds = [];
let debounceTimer;

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function setTitle(value) { document.title = `${value} · Awakening & Dispersion`; }
function announce(value) { live.textContent = ''; requestAnimationFrame(() => { live.textContent = value; }); }
function link(label, hash, className='') { const a=el('a',className,label); a.href=hash; return a; }

function shell(content, active='questions') {
  app.replaceChildren();
  const header=el('header','site-header');
  const nav=el('nav','nav-wrap'); nav.setAttribute('aria-label','Main navigation');
  nav.append(link('Awakening & Dispersion','#/questions','brand'));
  const links=el('div','nav-links');
  [['questions','Questions','#/questions'],['figures','Figures','#/figures'],['journeys','Journeys','journeys.html'],['about','About','#/about']].forEach(([id,label,href])=>{
    const item=link(label,href,id===active?'active':''); if(id===active)item.setAttribute('aria-current','page'); links.append(item);
  });
  nav.append(links); header.append(nav);
  const main=el('main','main'); main.id='main-content'; main.append(content);
  const footer=el('footer','site-footer'); footer.append(el('p','', 'A class project for comparing ideas—not personalized religious or professional advice.'));
  app.append(header,main,footer);
}

function questionCard(question, compact=false) {
  const card=el('a',`question-card${compact?' compact':''}`); card.href=`#/question/${question.id}`;
  card.append(el('span','eyebrow', CATEGORIES.find(c=>c.id===question.categoryId)?.name));
  card.append(el('h3','',question.title));
  if(!compact) card.append(el('p','',question.premise));
  card.append(el('span','card-action','Read 18 perspectives →'));
  return card;
}

function renderQuestions() {
  setTitle('Questions');
  const page=el('div','questions-page');
  const hero=el('section','hero');
  hero.append(el('p','kicker','Buddhism · Christianity · Islam'),el('h1','hero-title','One question. Many perspectives.'),el('p','hero-copy',"Explore life's difficult questions through three traditions."));
  const form=el('form','search-form'); form.setAttribute('role','search');
  const label=el('label','search-label',"What's on your mind?"); label.htmlFor='question-search';
  const row=el('div','search-row'); const input=el('input','search-input');
  input.id='question-search'; input.type='search'; input.maxLength=500; input.autocomplete='off'; input.placeholder='Try “my partner left me” or “I’m scared of failing.”'; input.value=searchValue;
  const clear=el('button','clear-button','Clear'); clear.type='button'; clear.hidden=!searchValue;
  row.append(input,clear); form.append(label,row,el('p','helper','Find a prepared question, then compare perspectives. Your search stays in this browser.'));
  hero.append(form); page.append(hero);

  const filters=el('div','filters'); filters.setAttribute('aria-label','Question categories');
  [{id:'all',name:'All questions'},...CATEGORIES].forEach(category=>{
    const button=el('button','filter-button',category.name); button.type='button'; button.dataset.category=category.id; button.setAttribute('aria-pressed',String(activeCategory===category.id)); filters.append(button);
  });
  page.append(filters);
  const resultsSection=el('section','results-section'); const heading=el('h2','section-heading',searchValue?'Matching questions':'Featured questions'); resultsSection.append(heading);
  const grid=el('div','question-grid'); resultsSection.append(grid); page.append(resultsSection);

  const update=()=>{
    searchValue=input.value;
    clear.hidden=!searchValue;
    const results=searchQuestions(searchValue,QUESTIONS,activeCategory);
    heading.textContent=searchValue.trim()?'Matching questions':activeCategory==='all'?'Featured questions':CATEGORIES.find(c=>c.id===activeCategory).name;
    grid.replaceChildren();
    if(!results.length) {
      const empty=el('div','empty-state'); empty.append(el('h3','',"We don't have a prepared question for that yet."),el('p','', 'Try a shorter phrase or browse the topics. Your text was not sent anywhere.')); grid.append(empty);
    } else results.forEach(q=>grid.append(questionCard(q)));
    announce(`${results.length} question${results.length===1?'':'s'} shown.`);
  };
  input.addEventListener('input',()=>{ clearTimeout(debounceTimer); debounceTimer=setTimeout(update,120); });
  form.addEventListener('submit',e=>e.preventDefault());
  clear.addEventListener('click',()=>{input.value='';searchValue='';update();input.focus();});
  filters.addEventListener('click',e=>{const button=e.target.closest('button[data-category]');if(!button)return;activeCategory=button.dataset.category;filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));update();});
  update();
  shell(page,'questions');
}

function answerCard(answer, perspective, question) {
  const card=el('article',`answer-card ${perspective.religion}`); card.dataset.perspective=perspective.id;
  const identity=el('div','answer-identity'); identity.append(el('span','tradition',RELIGIONS[perspective.religion].name),el('h3','',perspective.displayName),el('p','lens',perspective.lensLabel));
  card.append(identity,el('p','thesis',answer.thesis),el('p','answer-body',answer.body));
  const practice=el('div','practice'); practice.append(el('span','practice-label','Try this'),el('p','',answer.practice)); card.append(practice);
  const details=el('details','source-details'); const summary=el('summary','', 'Why this perspective?'); details.append(summary,el('p','',answer.rationale));
  const sources=el('ul','source-list'); answer.sourceIds.forEach(id=>{const s=sourceById(id);const li=el('li');const a=link(`${s.title} · ${s.reference}`,s.url);a.target='_blank';a.rel='noopener noreferrer';li.append(a);if(s.attributionNote)li.append(el('p','source-note',s.attributionNote));sources.append(li);});
  details.append(sources,el('p','interpretation-note',answer.attributionNote)); card.append(details);
  const compare=el('button','compare-button',compareIds.includes(perspective.id)?'Remove from comparison':'Compare'); compare.type='button'; compare.dataset.compare=perspective.id; compare.setAttribute('aria-pressed',String(compareIds.includes(perspective.id))); card.append(compare);
  return card;
}

function groupAnswers(question, answers, religion) {
  const section=el('section','tradition-column'); section.dataset.religion=religion;
  const header=el('div','tradition-header'); header.append(el('p','eyebrow',RELIGIONS[religion].name),el('p','count',`${RELIGIONS[religion].count} perspectives`)); section.append(header);
  const relevant=answers.filter(a=>perspectiveById(a.perspectiveId).religion===religion);
  section.append(answerCard(relevant[0],perspectiveById(relevant[0].perspectiveId),question));
  const rest=el('div','more-answers'); rest.hidden=true; relevant.slice(1).forEach(a=>rest.append(answerCard(a,perspectiveById(a.perspectiveId),question))); section.append(rest);
  const toggle=el('button','reveal-button',`Show all ${relevant.length} perspectives`); toggle.type='button'; toggle.setAttribute('aria-expanded','false'); toggle.addEventListener('click',()=>{const open=rest.hidden;rest.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Show lead perspective':`Show all ${relevant.length} perspectives`;}); section.append(toggle);
  return section;
}

function compareBar(question) {
  const bar=el('aside','compare-bar'); bar.setAttribute('aria-label','Comparison selection');
  const names=compareIds.map(id=>perspectiveById(id)?.displayName).filter(Boolean);
  bar.append(el('p','',names.length?`Compare: ${names.join(' · ')}`:'Select 2–3 perspectives to compare.'));
  const actions=el('div','compare-actions');
  if(compareIds.length>=2) actions.append(link('Open comparison',`#/question/${question.id}?compare=${compareIds.join(',')}`,'button-link'));
  if(compareIds.length) {const clear=el('button','text-button','Clear');clear.type='button';clear.addEventListener('click',()=>{compareIds=[];renderQuestion(question.id);});actions.append(clear);}
  bar.append(actions); return bar;
}

function parseCompare(questionId) {
  const route=location.hash.slice(1); const query=route.split('?')[1]||''; const ids=(new URLSearchParams(query).get('compare')||'').split(',').filter(Boolean);
  return [...new Set(ids)].filter(id=>PERSPECTIVES.some(p=>p.id===id)).slice(0,3);
}

function renderComparison(question, selected) {
  const page=el('div','comparison-page'); page.append(link('← Back to all perspectives',`#/question/${question.id}`,'back-link'),el('p','eyebrow','Comparison'),el('h1','page-title',question.title),el('p','disclaimer','Modern interpretations inspired by these figures and their traditions—not quotations or personal replies.'));
  const grid=el('div','comparison-grid'); const all=answersFor(question.id);
  selected.forEach(id=>{const p=perspectiveById(id);const a=all.find(item=>item.perspectiveId===id);if(a)grid.append(answerCard(a,p,question));}); page.append(grid); shell(page,'questions');
}

function renderQuestion(id, preserveSelection=false) {
  const question=questionById(id); if(!question)return renderNotFound();
  setTitle(question.title); if(!preserveSelection) compareIds=parseCompare(id);
  if(compareIds.length>=2 && location.hash.includes('?compare=')) return renderComparison(question,compareIds);
  const answers=answersFor(id); const page=el('div','question-page');
  page.append(link('← Change question','#/questions','back-link'),el('p','eyebrow',CATEGORIES.find(c=>c.id===question.categoryId).name),el('h1','page-title',question.title),el('p','premise',question.premise),el('p','disclaimer','Modern interpretations inspired by these figures and their traditions—not quotations or personal replies.'));
  page.append(compareBar(question));
  const columns=el('div','tradition-grid'); ['buddhism','christianity','islam'].forEach(r=>columns.append(groupAnswers(question,answers,r))); page.append(columns);
  const expand=el('button','expand-all','Expand all 18 perspectives'); expand.type='button'; expand.addEventListener('click',()=>{page.querySelectorAll('.more-answers').forEach(node=>node.hidden=false);page.querySelectorAll('.reveal-button').forEach(node=>{node.setAttribute('aria-expanded','true');node.textContent='Show lead perspective';});expand.hidden=true;});page.append(expand);
  const reflection=el('section','reflection'); reflection.append(el('h2','', 'Where these readings meet'),el('p','',`Across their differences, these readings refuse to let ${question.shortProblem} become the whole truth about a person. They direct attention toward honest self-knowledge, the consequences of conduct, and a next step that does not deepen avoidable harm.`),el('h2','', 'Where they differ'),el('p','',`They do not offer one theory of the good life. Buddhist readings emphasize suffering, attachment, and disciplined awareness; Christian readings foreground grace, love, and responsibility before God; Islamic readings foreground devotion, intention, justice, and accountability to God. Individual figures also disagree within those broad families.`)); page.append(reflection);
  page.addEventListener('click',e=>{const button=e.target.closest('[data-compare]');if(!button)return;const pid=button.dataset.compare;if(compareIds.includes(pid))compareIds=compareIds.filter(x=>x!==pid);else if(compareIds.length<3)compareIds.push(pid);else{announce('You can compare up to three perspectives. Remove one before adding another.');return;}renderQuestion(id,true);});
  shell(page,'questions'); requestAnimationFrame(()=>page.querySelector('h1')?.focus?.());
}

function renderFigures() {
  setTitle('Figures'); const page=el('div','directory-page');page.append(el('p','kicker','17 people · 18 interpretive lenses'),el('h1','page-title','Figures and perspectives'),el('p','intro','The project uses “figures” because these people hold different roles. Abraham appears through separate Christian and Islamic readings.'));
  const grid=el('div','figure-grid');FIGURES.forEach(f=>{const card=el('article','figure-card');card.append(el('h2','',f.name),el('p','',f.bio));const lenses=el('div','lens-links');f.perspectiveIds.forEach(id=>lenses.append(link(perspectiveById(id).lensLabel,`#/figure/${id}`,'chip-link')));card.append(lenses);grid.append(card);});page.append(grid);shell(page,'figures');
}

function renderFigure(id) {
  const p=perspectiveById(id); if(!p)return renderNotFound(); const f=figureById(p.figureId);setTitle(p.displayName);const page=el('div','profile-page');page.append(link('← All figures','#/figures','back-link'),el('p','eyebrow',`${RELIGIONS[p.religion].name} · ${p.lensLabel}`),el('h1','page-title',p.displayName),el('p','intro',f.bio),el('h2','section-heading','Lens used in this project'),el('p','',p.lensDescription),el('p','disclaimer','This profile identifies an editorial lens. It does not claim that one figure represents an entire tradition or would personally endorse these modern applications.'));
  if(f.perspectiveIds.length>1){const sibling=f.perspectiveIds.find(x=>x!==id);page.append(el('h2','section-heading','Shared figure, another lens'),link(`See ${perspectiveById(sibling).lensLabel}`,`#/figure/${sibling}`,'button-link'));}
  const refs=el('section','profile-sources');refs.append(el('h2','section-heading','Research starting points'));p.sourceIds.forEach(sid=>{const s=sourceById(sid);const a=link(`${s.title} — ${s.reference}`,s.url,'source-link');a.target='_blank';a.rel='noopener noreferrer';refs.append(a);});page.append(refs);shell(page,'figures');
}

function renderAbout(){setTitle('About');const page=el('article','about-page');page.append(el('p','kicker','About the project'),el('h1','page-title','A library of prepared perspectives'),el('p','lead','Awakening & Dispersion is a class project for comparing how selected Buddhist, Christian, and Islamic figures can inform difficult questions.'));
  [['What the answers are','Every answer is a modern editorial interpretation based on cited material. It is not a historical quotation, revelation, personal reply, or claim that all members of a religion agree.'],['How search works','Search runs entirely in this browser against titles, aliases, and keywords for 18 prepared questions. It does not call an AI model and cannot answer an unprepared question.'],['Privacy and cost','Your search text is not stored, placed in the URL, or sent to an AI service. The hosting provider still receives ordinary page and asset requests, and external source links and the map use the network.'],['Limits','The selected figures do not represent every school or believer. This project is educational reflection, not religious authority, therapy, legal advice, medical advice, or crisis support.']].forEach(([h,p])=>page.append(el('h2','section-heading',h),el('p','',p)));shell(page,'about');}

function renderNotFound(){setTitle('Not found');const page=el('div','empty-state');page.append(el('h1','page-title','That page is not in this library.'),el('p','', 'Choose one of the prepared questions or browse the figures.'),link('Browse questions','#/questions','button-link'));shell(page);}

function route(){window.scrollTo(0,0);const path=location.hash.slice(1).split('?')[0]||'/questions';const parts=path.split('/').filter(Boolean);if(parts[0]==='questions'&&!parts[1])return renderQuestions();if(parts[0]==='question'&&parts[1])return renderQuestion(parts[1]);if(parts[0]==='figures'&&!parts[1])return renderFigures();if(parts[0]==='figure'&&parts[1])return renderFigure(parts[1]);if(parts[0]==='about')return renderAbout();return renderNotFound();}

window.addEventListener('hashchange',route);
route();
