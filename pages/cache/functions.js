function goBack() {
  window.location = "../sequence/sequence.html";
}

function saveCacheConfig() {
  const lineCacheInputEl = document.getElementById('cache-line');
  const wordsCacheInputEl = document.getElementById('cache-words');

  const cacheLine = Number(lineCacheInputEl.value);
  const wordsCache = Number(wordsCacheInputEl.value);

  const data = getItem('cache');
  const { sequenceBitsConfig } = data;
  const { lineBits, isDirectMapping } = sequenceBitsConfig;

  let cache = null;

  if (isDirectMapping) {
    cache = {};

    for (let i = 0; i < cacheLine; i++) {
      const lineBytes = i.toString(2).padStart(lineBits, '0');

      cache = {
        ...cache,
        [lineBytes]: [],
      }
    }
  } else {
    cache = [];

    for (let i = 0; i < cacheLine; i++) {
      cache.push([]);
    }
  }

  setItem('cache', {
    ...data,
    cacheConfig: {
      cacheLine,
      wordsCache,
    },
    cache,
  });

  window.location = "../result/result.html";
}

function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getItem(key) {
  return JSON.parse(localStorage.getItem(key));
}