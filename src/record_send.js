let mediaRecorder;
let mediaStream;

export function startRecording() {
  console.log("Recording started");
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaStream = stream;
      mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorder.addEventListener('dataavailable', event => {
        const audioData = event.data;
        console.log('Bytes recorded:', audioData.size);
        // No need to send the audio chunk here, maybe in future, but this is mock
      });
      mediaRecorder.start();
    })
    .catch(error => {
      console.error('Error starting recording:', error);
    });
}

export function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    mediaStream.getTracks().forEach(track => track.stop());
    console.log("Recording stopped");

    // Send the recorded audio chunk
    if (mediaRecorder.state === 'inactive') {
      mediaRecorder.ondataavailable = event => {
        const audioData = event.data;
        console.log('Bytes recorded:', audioData.size);
        sendAudioChunk(audioData);
      };
    }
  }
}

function sendAudioChunk(chunk) {
  fetch('http://localhost:5000/upload', {
    method: 'POST',
    body: chunk
  })
  .then(response => {
    if (response.ok) {
      console.log('Audio chunk sent successfully');
    } else {
      console.error('Failed to send audio chunk:', response.statusText);
    }
  })
  .catch(error => {
    console.error('Error sending audio chunk:', error);
  });
}
