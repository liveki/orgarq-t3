function clearInput() {
  let inputEl = document.getElementById("sequence-bits");
  inputEl.value = '';
}

function convertSequence() {
  const inputEl = document.getElementById("sequence-bits");
  const valuesInArray = inputEl.value.trim().split(',');

  const parsedValues = valuesInArray.map(hex => convertHexToBinary(hex));

  setItem('cache', { sequence: parsedValues });

  window.location = "pages/sequence/sequence.html";
}

function convertHexToBinary(hex) {
  return parseInt(hex, 16).toString(2).padStart(16, '0');
}

function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getItem(key) {
  return JSON.parse(localStorage.getItem(key));
}
