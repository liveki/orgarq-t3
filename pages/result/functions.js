function populateTable(classesStyle = []) {
  const tableEl = document.getElementById('table');
  tableEl.innerHTML = '';
  let tbodyEl = document.createElement('tbody');
  const titleEl = document.getElementById('title');

  const { sequenceBitsConfig } = getItem('cache');
  const { isDirectMapping } = sequenceBitsConfig;

  titleEl.innerHTML = `Cache (${isDirectMapping ? 'Mapeamento Direto' : 'Mapeamento Associativo'})`;

  let tr = document.createElement('tr');

  const { sequence } = getItem('cache');

  sequence.forEach((bit, index) => {
    const td = document.createElement('td');
    td.appendChild(document.createTextNode(bit));
    td.setAttribute('class', classesStyle[index] || '');

    tr.appendChild(td);

    if ((index + 1) % 4 === 0) {
      tbodyEl.appendChild(tr);
      tr = document.createElement('tr');;
    }
  });


  tbodyEl.appendChild(tr);
  tableEl.appendChild(tbodyEl);

  if (sequence.length < 36) {
    tbodyEl.style.overflowY = "visible";
  }

  makeCacheTable();
}

function makeCacheTable() {
  const tableEl = document.getElementById('cache-table');
  const cacheInfoEl = document.getElementById('cache-info');

  tableEl.innerHTML = '';
  cacheInfoEl.innerHTML = '';

  addTableHeader();
  addTableBody();

  makeCacheInfo();
}

function addTableHeader() {
  const tableEl = document.getElementById('cache-table');
  const tRowEl = document.createElement('tr');
  let tColumnEl = document.createElement('td');

  const { sequenceBitsConfig, cacheConfig } = getItem('cache');
  const { wordBits } = sequenceBitsConfig;
  const { wordsCache } = cacheConfig;

  tColumnEl.appendChild(document.createTextNode('linha'));
  tRowEl.appendChild(tColumnEl);

  tColumnEl = document.createElement('td');

  tColumnEl.appendChild(document.createTextNode('tag'));
  tRowEl.appendChild(tColumnEl);

  for (let i = 0; i < wordsCache; i++) {
    tColumnEl = document.createElement('td');

    const endWordInByte = i.toString(2).padStart(wordBits, '0');
    const labelEl = document.createElement('label');

    labelEl.innerHTML = `${endWordInByte}`;
    labelEl.setAttribute('class', 'end-byte');

    tColumnEl.appendChild(labelEl);
    tRowEl.appendChild(tColumnEl);
  }

  tableEl.appendChild(tRowEl);
}

function addTableBody() {
  const tableEl = document.getElementById('cache-table');
  let tRowEl = document.createElement('tr');
  let tColumnEl = document.createElement('td');

  const { sequenceBitsConfig, cacheConfig, cache } = getItem('cache');
  const { lineBits, isDirectMapping } = sequenceBitsConfig;
  const { wordsCache, cacheLine } = cacheConfig;

  for (let i = 0; i < cacheLine; i++) {
    const lineBytes = i.toString(2).padStart(lineBits, '0');
    tColumnEl.appendChild(document.createTextNode(lineBytes));
    tRowEl.appendChild(tColumnEl);

    const tagEl = document.createElement('td');

    if (isDirectMapping) {
      tagEl.appendChild(document.createTextNode(cache[lineBytes][0] || ''));
    } else {
      tagEl.appendChild(document.createTextNode(cache[i][0] || ''));
    }

    tRowEl.appendChild(tagEl);

    for (let j = 0; j < wordsCache; j++) {
      const wordEl = document.createElement('td');

      if (isDirectMapping) {
        wordEl.appendChild(document.createTextNode(cache[lineBytes][j + 1] || ''));
      } else {
        wordEl.appendChild(document.createTextNode(cache[i][j + 1] || ''));
      }

      tRowEl.appendChild(wordEl);
    }

    tableEl.appendChild(tRowEl);
    tRowEl = document.createElement('tr');
    tColumnEl = document.createElement('td');
  }
}

function makeCacheInfo() {
  const cacheInfoEl = document.getElementById('cache-info');

  const { cacheConfig, sequenceBitsConfig } = getItem('cache');
  const { wordsCache } = cacheConfig;
  const { isDirectMapping, lineBits, tagBits, wordBits } = sequenceBitsConfig;

  const tagBitsEl = document.createElement('span');
  const wordBitsEl = document.createElement('span');
  const selectionBitsEl = document.createElement('span');
  const wordsPerLineEl = document.createElement('span');

  tagBitsEl.innerHTML = `Tags: ${tagBits}bits`;
  wordBitsEl.innerHTML = `Palavra: ${wordBits}bits`;
  selectionBitsEl.innerHTML = 'Seleç. palavra: 1bit';
  wordsPerLineEl.innerHTML = `Palavras por linha: ${wordsCache}`;

  cacheInfoEl.appendChild(tagBitsEl);

  if (isDirectMapping) {
    const cacheLineEl = document.createElement('span');
    cacheLineEl.innerHTML = `Linha: ${lineBits}bits`;
    cacheInfoEl.appendChild(cacheLineEl);
  }

  cacheInfoEl.appendChild(wordBitsEl);
  cacheInfoEl.appendChild(selectionBitsEl);
  cacheInfoEl.appendChild(wordsPerLineEl);
}

function startCache() {
  const { sequenceBitsConfig } = getItem('cache');
  const { isDirectMapping } = sequenceBitsConfig;

  if (isDirectMapping) {
    startDirectMapping();
  } else {
    startAssociativeMapping();
  }
}

function startDirectMapping() {
  const { sequenceBitsConfig, cache, sequence, cacheConfig } = getItem('cache');
  const { lineBits, tagBits } = sequenceBitsConfig;
  const { wordsCache } = cacheConfig;

  let newCache = cache;
  let hits = 0;
  let misses = 0;
  let classesStyle = [];

  sequence.forEach((bits) => {
    const line = bits.substring(tagBits, (tagBits + lineBits));
    const tag = bits.substring(0, tagBits);

    const isNotInCache = newCache[line].length === 0;
    const isNotSameInCache = newCache[line][0] !== tag;

    if (isNotInCache || isNotSameInCache) {
      classesStyle.push('miss');
      misses++;
      const wordSequence = createWordsSequence((line + tag), wordsCache);

      newCache = {
        ...newCache,
        [line]: [tag, ...wordSequence],
      }
    } else {
      classesStyle.push('hit');
      hits++;
    }
  });

  setItem('cache', {
    ...getItem('cache'),
    cache: newCache,
  });

  const divEl = document.getElementsByClassName('result-bits')[0];
  const accuracyEl = document.createElement('strong');
  accuracyEl.innerHTML = `Taxa de acerto: ${Math.trunc((hits / (hits + misses)) * 100)}%`;

  const hitLabelEl = document.getElementById('hits');
  const missLabelEl = document.getElementById('misses');

  hitLabelEl.innerHTML = `Hits: ${hits}`;
  missLabelEl.innerHTML = `Misses: ${misses}`;

  divEl.appendChild(accuracyEl);

  makeCacheTable();
  populateTable(classesStyle);
}

function startAssociativeMapping() {
  const { sequenceBitsConfig, cache, sequence, cacheConfig } = getItem('cache');

  const { lineBits, tagBits } = sequenceBitsConfig;
  const { wordsCache } = cacheConfig;

  let currentLine = 0;
  let hits = 0;
  let misses = 0;
  let newCache = cache;
  let classesStyle = [];

  sequence.forEach((bits) => {
    const tag = bits.substring(0, tagBits);
    const hasInCache = newCache.some((line) => line.length > 0 && line[0] === tag);

    if (hasInCache) {
      classesStyle.push('hit');
      hits++;
    } else {
      misses++;
      const wordSequence = createWordsSequence(tag, wordsCache);
      newCache[currentLine] = [tag, ...wordSequence];
      currentLine++;
      classesStyle.push('miss');
    }

    if (currentLine === cache.length) {
      currentLine = 0;
    }
  });

  setItem('cache', {
    ...getItem('cache'),
    cache: newCache,
  });

  const divEl = document.getElementsByClassName('result-bits')[0];
  const accuracyEl = document.createElement('strong');
  accuracyEl.innerHTML = `Taxa de acerto: ${Math.trunc((hits / (hits + misses)) * 100)}%`;

  const hitLabelEl = document.getElementById('hits');
  const missLabelEl = document.getElementById('misses');

  hitLabelEl.innerHTML = `Hits: ${hits}`;
  missLabelEl.innerHTML = `Misses: ${misses}`;

  divEl.appendChild(accuracyEl);

  makeCacheTable();
  populateTable(classesStyle);
}

function createWordsSequence(initialWord, wordsCache) {
  const { sequenceBitsConfig } = getItem('cache');
  const { wordBits } = sequenceBitsConfig;

  let wordsSequence = [];

  for (let i = 0; i < wordsCache; i++) {
    const endWord = i.toString(2).padStart(wordBits + 1, '0').replace(/[0-9]/g, "X");
    wordsSequence.push(initialWord + endWord);
  }

  return wordsSequence;
}

function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getItem(key) {
  return JSON.parse(localStorage.getItem(key));
}