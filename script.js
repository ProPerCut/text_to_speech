const textInput = document.getElementById('text-input');
const speakBtn = document.getElementById('speak-btn');
const downloadBtn = document.getElementById('download-btn');
const audioPlayer = document.getElementById('audio-player');
const modal = document.getElementById('voice-modal');
const openModalBtn = document.getElementById('open-voice-modal');
const closeModalBtn = document.getElementById('close-modal');
const charCount = document.getElementById('char-count');

let selectedVoiceId = "21m00Tcm4TlvDq8ikWAM"; // Default Rachel Voice ID

// Character counter
textInput.addEventListener('input', () => {
  charCount.innerText = `${textInput.value.length} / 5000 characters`;
});

// Modal Actions
openModalBtn.onclick = () => modal.style.display = 'flex';
closeModalBtn.onclick = () => modal.style.display = 'none';

function selectVoice(id, name, desc) {
  selectedVoiceId = id;
  document.getElementById('selected-voice-name').innerText = name;
  document.getElementById('selected-voice-desc').innerText = desc;
  modal.style.display = 'none';
}

// Generate Voice using Vercel Serverless Function (ElevenLabs API)
speakBtn.onclick = async () => {
  const text = textInput.value.trim();
  if (!text) {
    alert("Please enter some text first.");
    return;
  }

  const stabilityVal = document.getElementById('stability').value / 100;
  const similarityVal = document.getElementById('similarity').value / 100;

  speakBtn.disabled = true;
  speakBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

  try {
    const response = await fetch('/api/generate-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: text, 
        voiceId: selectedVoiceId,
        stability: stabilityVal,
        similarity: similarityVal
      })
    });

    const data = await response.clone().json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error || 'Failed to generate audio. Check API Key.');
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);

    // Set Audio Player and Download Button
    audioPlayer.src = audioUrl;
    audioPlayer.style.display = 'block';
    audioPlayer.play();

    downloadBtn.href = audioUrl;
    downloadBtn.style.display = 'inline-flex';

  } catch (error) {
    alert("Error: " + error.message);
  } finally {
    speakBtn.disabled = false;
    speakBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate AI Voice';
  }
};

// Menu Tab Switcher
function switchTab(tab, element) {
  document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
  if (element) element.classList.add('active');

  const ttsSection = document.getElementById('section-tts');
  const otherSection = document.getElementById('section-other');
  const pageTitle = document.getElementById('page-title');
  const otherTitle = document.getElementById('other-title');

  if (tab === 'tts') {
    ttsSection.style.display = 'flex';
    otherSection.style.display = 'none';
    pageTitle.innerText = 'Speech Synthesis';
  } else {
    ttsSection.style.display = 'none';
    otherSection.style.display = 'block';
    if (tab === 'cloning') { pageTitle.innerText = 'Voice Cloning'; otherTitle.innerText = 'Voice Cloning Studio'; }
    if (tab === 'effects') { pageTitle.innerText = 'Sound Effects'; otherTitle.innerText = 'Sound Effects Generator'; }
    if (tab === 'music') { pageTitle.innerText = 'Music Generator'; otherTitle.innerText = 'AI Music Generator'; }
  }
}

// Slider Display Updates
document.getElementById('rate').oninput = (e) => {
  document.getElementById('speed-val').innerText = e.target.value + 'x';
  audioPlayer.playbackRate = parseFloat(e.target.value);
};
document.getElementById('stability').oninput = (e) => document.getElementById('stab-val').innerText = e.target.value + '%';
document.getElementById('similarity').oninput = (e) => document.getElementById('sim-val').innerText = e.target.value + '%';
