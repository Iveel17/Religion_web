const STOP_WORDS = new Set(['the','a','an','is','are','of','to','and','with']);

export function normalize(value='') {
  return value.normalize('NFKC').toLowerCase().replace(/[‘’]/g,"'").replace(/[^\p{L}\p{N}']+/gu,' ').replace(/\s+/g,' ').trim();
}

function tokens(value) {
  return [...new Set(normalize(value).split(' ').filter(word => word && !STOP_WORDS.has(word)))];
}

export function searchQuestions(query, questions, categoryId='all') {
  const normalized = normalize(query);
  const queryTokens = tokens(query);
  const candidates = categoryId === 'all' ? questions : questions.filter(q => q.categoryId === categoryId);
  if (!normalized) {
    if (categoryId !== 'all') return candidates;
    const featuredOrder=['q01-replaced','q04-suffering','q03-forgive','q06-good-without-religion','q07-parents','q09-envy'];
    return candidates.filter(q => q.featured).sort((a,b)=>featuredOrder.indexOf(a.id)-featuredOrder.indexOf(b.id));
  }

  return candidates.map((question, index) => {
    const title = normalize(question.title);
    const aliases = question.aliases.map(normalize);
    const titleTokens = new Set(tokens(question.title));
    const aliasTokens = new Set(question.aliases.flatMap(tokens));
    const keywordTokens = new Set(question.keywords.flatMap(tokens));
    let score = 0;
    let strong = false;

    if (title === normalized || aliases.includes(normalized)) { score += 100; strong = true; }
    for (const phrase of [title, ...aliases]) {
      if ((phrase.split(' ').length >= 2 || phrase.length >= 8) && normalized.includes(phrase)) {
        score += 30; strong = true; break;
      }
    }
    let contentMatches = 0;
    for (const token of queryTokens) {
      if (token.length < 3) continue;
      if (titleTokens.has(token)) { score += 4; contentMatches++; continue; }
      if (aliasTokens.has(token)) { score += 3; contentMatches++; continue; }
      if (keywordTokens.has(token)) { score += 2; contentMatches++; }
    }
    return { question, score, strong, contentMatches, index };
  }).filter(item => item.strong || item.contentMatches > 0)
    .sort((a,b) => b.score-a.score || a.index-b.index)
    .slice(0,5)
    .map(item => item.question);
}
