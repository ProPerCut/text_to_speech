const synth = window.speechSynthesis;
let voices = [];

const textInput = document.getElementById('text-input');
const speakBtn = document.getElementById('speak-btn');
const modal = document.getElementById('voice-modal');
const openModalBtn = document.getElementById('open-voice-modal');
const closeModalBtn = document.getElementById('close-modal');
const voiceList = document.getElementById('voice-list');
const charCount = document.getElementById('char-count');

let selectedVoiceObj = null;

// Character counter
textInput.addEventListener('input', () => {
  const count = textInput.value.length;
  charCount.innerText = `${count} / 5000 characters`;
});

// Load Voices
function loadVoices() {
  voices = synth.getVoices();
  voiceList.innerHTML = '';
  
  voices.forEach((voice) => {
    const item = document.createElement('div');
    item.className = 'voice-item';
    item.innerHTML = `
      <div>
        <strong>${voice.name}</strong>
        <p style="font-size:12px; color:#64748b;">Language: ${voice.lang}</p>
      </div>
      <button class="filter-btn" style="background:#0284c7; color:#fff;">Select</button>
    `;
    item.onclick = () => {
      selectedVoiceObj = voice;
      document.getElementById('selected-voice-name').innerText = voice.name;
      document.getElementById('selected-voice-desc').innerText = `Language: ${voice.lang}`;
      modal.style.display = 'none';
    };
    voiceList.appendChild(item);
  });
}

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}
loadVoices();

// Modal Events
openModalBtn.onclick = () => modal.style.display = 'flex';
closeModalBtn.onclick = () => modal.style.display = 'none';

// Text to Speech
speakBtn.onclick = () => {
  if (synth.speaking) synth.cancel();
  if (textInput.value !== '') {
    const utterThis = new SpeechSynthesisUtterance(textInput.value);
    if (selectedVoiceObj) utterThis.voice = selectedVoiceObj;
    utterThis.rate = document.getElementById('rate').value;
    synth.speak(utterThis);
  }
};

// Sliders linkage
document.getElementById('rate').oninput = (e) => document.getElementById('speed-val').innerText = e.target.value + 'x';
document.getElementById('stability').oninput = (e) => document.getElementById('stab-val').innerText = e.target.value + '%';
document.getElementById('similarity').oninput = (e) => document.getElementById('sim-val').innerText = e.target.value + '%';
