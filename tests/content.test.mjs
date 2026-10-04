import test from 'node:test';
import assert from 'node:assert/strict';
import { ANSWERS, FIGURES, PERSPECTIVES, QUESTIONS } from '../content/content.js';

test('launch matrix is complete',()=>{
  assert.equal(QUESTIONS.length,18);
  assert.equal(PERSPECTIVES.length,18);
  assert.equal(FIGURES.length,17);
  assert.equal(ANSWERS.length,324);
  for(const question of QUESTIONS)assert.equal(ANSWERS.filter(a=>a.questionId===question.id).length,18);
});

test('Abraham has one identity and two lenses',()=>{
  assert.equal(FIGURES.filter(f=>f.id==='abraham').length,1);
  assert.deepEqual(PERSPECTIVES.filter(p=>p.figureId==='abraham').map(p=>p.id),['christianity-abraham','islam-ibrahim']);
});
