import React, { useState, useEffect } from 'react';

async function fetchProcessedAudio() {
  const response = await fetch('http://localhost:5000/get_processed_audio');
  if (!response.ok) {
    throw new Error('Failed to fetch processed audio');
  }
  const data = await response.json();
  return data.processed_audio;
}

function TextDisplay({ content, side}) {
  const [processedAudio, setProcessedAudio] = useState('Live Transcription: ');
  const [processedAudioRight, setProcessedAudioRight] = useState(content | 'just here for aesthetics');

  useEffect(() => {
    if (side === 'left') {
      const fetchData = () => {
        fetchProcessedAudio()
          .then(audio => {
            if (audio !== null) {
              setProcessedAudio(prevAudio => prevAudio + audio + ' ');
            }
          })
          .catch(error => console.error('Error fetching processed audio:', error));
      };

      // Fetch data initially when the component mounts
      fetchData();

      // Fetch data every 10 seconds
      const intervalId = setInterval(fetchData, 5000);

      // Clean up the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [side]);

  const handleClearClick = () => {
    setProcessedAudio('Live Transcription: ');
    setProcessedAudioRight('');
  };

  return (
    <div className={`text-display ${side}`}>
      <p>{content}</p>
      {side === 'left' && processedAudio && <p>{processedAudio}</p>}
      {side === 'right' && (
        <div>
          {/* Placeholder template or other content for the right side */}
          <p>{processedAudioRight}</p>
        </div>
      )}
      <button onClick={handleClearClick}>Clear</button>
    </div>
  );
}

export default TextDisplay;
