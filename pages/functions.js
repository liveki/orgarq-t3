function goBack() {
  window.location = "../index.html"
}

function disableLineBits() {
  let labelEl = document.getElementById('label-line-bits');
  let inputEl = document.getElementById('line-bits');

  labelEl.setAttribute('class', 'disabled');
  inputEl.setAttribute('disabled', 'true');
}

function enableLineBits() {
  let labelEl = document.getElementById('label-line-bits');
  let inputEl = document.getElementById('line-bits');

  labelEl.removeAttribute('class', 'disabled');
  inputEl.removeAttribute('disabled', 'true');
}

function saveSequenceBitsConfig() {
  const tagInputEl = document.getElementById('tag-bits');
  const wordInputEl = document.getElementById('word-bits');
  const radioInputEl = document.getElementById('direct-memmory');
  const lineInputEl = document.getElementById('line-bits');

  const tagBits = Number(tagInputEl.value);
  const wordBits = Number(wordInputEl.value);
  const isDirectMapping = radioInputEl.checked;
  const lineBits = Number(lineInputEl.value);

  console.log('tagBits', tagBits);
  console.log('wordBits', wordBits);
  console.log('isDirectMemmory', isDirectMapping);
  console.log('lineBits', lineBits);

  const data = getItem('cache');

  setItem('cache', {
    ...data,
    sequenceBitsConfig: {
      tagBits,
      wordBits,
      isDirectMapping,
      lineBits: lineBits || null,
    }
  });
}

function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getItem(key) {
  return JSON.parse(localStorage.getItem(key));
}