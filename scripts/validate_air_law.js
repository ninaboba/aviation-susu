const fs = require('fs');
const path = require('path');

const airLawFile = path.join(__dirname, '..', 'data', 'subjects', 'air_law.json');
const airLaw = JSON.parse(fs.readFileSync(airLawFile, 'utf8'));

console.log('Total questions in air_law.json:', airLaw.length);

const ids = new Set();
const duplicateIds = [];
const errors = [];
const topics = new Map();
let hasExplanation = 0;
let hasQuickExplanation = 0;
let hasLO = 0;
let hasDifficulty = 0;

airLaw.forEach((q, idx) => {
  const qNum = idx + 1;
  if (q.id === undefined) errors.push(`Q#${qNum}: missing id`);
  if (ids.has(q.id)) duplicateIds.push(q.id);
  ids.add(q.id);

  if (!q.question || typeof q.question !== 'string' || !q.question.trim()) {
    errors.push(`Q#${qNum} (id ${q.id}): missing or empty question`);
  }

  if (!Array.isArray(q.options) || q.options.length < 2) {
    errors.push(`Q#${qNum} (id ${q.id}): invalid options array (len: ${q.options ? q.options.length : 0})`);
  } else {
    q.options.forEach((opt, oIdx) => {
      if (opt === undefined || opt === null || (typeof opt === 'string' && !opt.trim())) {
        errors.push(`Q#${qNum} (id ${q.id}): option[${oIdx}] is empty`);
      }
    });
  }

  if (typeof q.answer !== 'number' || q.answer < 0 || (q.options && q.answer >= q.options.length)) {
    errors.push(`Q#${qNum} (id ${q.id}): invalid answer index ${q.answer}`);
  }

  if (q.options && q.answer !== undefined && q.options[q.answer] !== q.correct) {
    errors.push(`Q#${qNum} (id ${q.id}): mismatch: correct='${q.correct}' vs options[${q.answer}]='${q.options[q.answer]}'`);
  }

  if (!q.topic) errors.push(`Q#${qNum} (id ${q.id}): missing topic`);
  if (!q.topicName) errors.push(`Q#${qNum} (id ${q.id}): missing topicName`);

  if (q.explanation && q.explanation.trim()) hasExplanation++;
  if (q.explanation_quick && q.explanation_quick.trim()) hasQuickExplanation++;
  if (q.LO && q.LO.trim()) hasLO++;
  if (q.difficulty && q.difficulty.trim()) hasDifficulty++;

  const tKey = `${q.topic || 'Unknown'} - ${q.topicName || 'Unknown'}`;
  topics.set(tKey, (topics.get(tKey) || 0) + 1);
});

console.log('Duplicate IDs count:', duplicateIds.length);
if (duplicateIds.length > 0) console.log('Duplicate IDs sample:', duplicateIds.slice(0, 10));

console.log('Validation errors count:', errors.length);
if (errors.length > 0) {
  console.log('Errors sample (first 10):');
  errors.slice(0, 10).forEach(e => console.log(' -', e));
} else {
  console.log('>>> All questions PASSED structural validation!');
}

console.log('\nMetadata completeness:');
console.log(`- Explanations: ${hasExplanation} / ${airLaw.length} (${(hasExplanation/airLaw.length*100).toFixed(1)}%)`);
console.log(`- Quick Explanations: ${hasQuickExplanation} / ${airLaw.length} (${(hasQuickExplanation/airLaw.length*100).toFixed(1)}%)`);
console.log(`- Learning Objectives (LO): ${hasLO} / ${airLaw.length} (${(hasLO/airLaw.length*100).toFixed(1)}%)`);
console.log(`- Difficulty: ${hasDifficulty} / ${airLaw.length} (${(hasDifficulty/airLaw.length*100).toFixed(1)}%)`);

console.log('\nTopics breakdown (' + topics.size + ' topics):');
for (const [t, c] of topics.entries()) {
  console.log(`  ${t}: ${c} questions`);
}
