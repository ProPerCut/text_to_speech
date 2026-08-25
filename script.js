document.getElementById('generateBtn').addEventListener('click', async () => {
    const textInput = document.getElementById('textInput').value;
    const statusText = document.getElementById('status');
    const audioPlayer = document.getElementById('audioPlayer');

    if (!textInput.trim()) {
        alert('অনুগ্রহ করে কিছু টেক্সট লিখুন!');
        return;
    }

    statusText.innerText = 'ভয়েস জেনারেট হচ্ছে, অপেক্ষা করুন...';

    try {
        const response = await fetch('https://5000-m-s-kkb-usc1a0-uya2icvlwgba-a.us-central1-0.prod.colab.dev/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: textInput })
        });

        if (!response.ok) {
            throw new Error('ভয়েস তৈরি করতে ব্যর্থ হয়েছে।');
        }

        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        
        audioPlayer.src = audioUrl;
        audioPlayer.style.display = 'block';
        audioPlayer.play();

        statusText.innerText = 'ভয়েস সফলভাবে তৈরি হয়েছে!';
    } catch (error) {
        console.error(error);
        statusText.innerText = 'ত্রুটি ঘটেছে: Colab সার্ভারটি চালু আছে কিনা নিশ্চিত করুন।';
    }
});
