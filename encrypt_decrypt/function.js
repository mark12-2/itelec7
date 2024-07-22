const conversionChart = {
  A: '<>', B: '>^<', C: '>^^<', D: '>^^^<', E: '<^>', F: '^>',
  G: '^^>', H: '<^', I: '<^^>', J: '<^^', K: '<^>>', L: '<<^>',
  M: '<<<^>>', N: '<<^>>>', O: '<><>', P: '^>^', Q: '<^>^', R: '^<^>',
  S: '<^>^>', T: '<^<^>', U: '<>^<>', V: '^', W: '^^', X: '<<>>',
  Y: '<<>>>', Z: '<<<>>>', '0': '<0>', '1': '<1>', '2': '<2>',
  '3': '<3>', '4': '<4>', '5': '<5>', '6': '<6>', '7': '<7>',
  '8': '<8>', '9': '<9>'
};

const encryptInput = document.querySelector('.e');
const encryptOutput = document.querySelector('.encrypted-text');
const encryptBtn = document.getElementById('encrypt-btn');
const decryptInput = document.querySelector('.d');
const decryptOutput = document.querySelector('.decrypted-text');
const decryptBtn = document.getElementById('decrypt-btn');
const copyBtn = document.querySelector('.copy-btn');
const modeToggle = document.getElementById('mode-toggle');
const startSpeechRecognitionBtn = document.getElementById('start-speech-recognition');

const encrypt = (plaintext) => {
  let ciphertext = '';
  for (let i = 0; i < plaintext.length; i++) {
      const char = plaintext[i].toUpperCase();
      if (char === ' ') {
          ciphertext += ' / ';
      } else if (conversionChart[char]) {
          ciphertext += conversionChart[char] + ' ';
      }
  }
  return ciphertext.trim();
};

const decrypt = (ciphertext) => {
  let plaintext = '';
  const symbols = ciphertext.split(' ');
  for (let i = 0; i < symbols.length; i++) {
      if (symbols[i] === '/') {
          plaintext += ' ';
      } else {
          for (const [char, symbol] of Object.entries(conversionChart)) {
              if (symbol === symbols[i]) {
                  plaintext += char;
                  break;
              }
          }
      }
  }
  return plaintext;
};

encryptBtn.addEventListener('click', () => {
  const plaintext = encryptInput.value.trim();
  if (plaintext === '') {
      encryptOutput.textContent = 'Please type something to encrypt!';
      copyBtn.style.display = 'none';
  } else {
      const ciphertext = encrypt(plaintext);
      encryptOutput.textContent = ciphertext;
      copyBtn.style.display = 'inline-block';
  }
});

decryptBtn.addEventListener('click', () => {
  const ciphertext = decryptInput.value.trim();
  if (ciphertext === '') {
      decryptOutput.textContent = 'Please type something to decrypt!';
  } else {
      const plaintext = decrypt(ciphertext);
      decryptOutput.textContent = plaintext;
      const utterance = new SpeechSynthesisUtterance(plaintext);
      window.speechSynthesis.speak(utterance);
  }
});

copyBtn.addEventListener('click', () => {
  const encryptedText = document.querySelector(copyBtn.dataset.copyTarget).textContent;
  navigator.clipboard.writeText(encryptedText).then(() => {
      console.log('Copied to clipboard!');
  }).catch((error) => {
      console.error('Error copying to clipboard:', error);
  });
});

copyBtn.style.display = 'none';

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
});

startSpeechRecognitionBtn.addEventListener('click', () => {
  if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported');
      return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      encryptInput.value = speechResult;
      encryptBtn.click();
  };

  recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
  };

  recognition.start();
});