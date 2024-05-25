import React, { useState, useEffect } from 'react';
import './App.css';
import TextDisplay from './TextDisplay'; // Import the TextDisplay component

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [leftContent, setLeftContent] = useState('');
  const [rightContent, setRightContent] = useState('');

  // Function to fetch data from the server and update the state
  const fetchData = () => {
    fetch('http://localhost:5000/get_processed_audio')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch processed audio');
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          if (data.error === 'No processed audio available') {
            // Handle the case when no processed audio is available
            // For example, display a message or do nothing
            console.log('No processed audio available');
          } else {
            throw new Error(data.error);
          }
        } else {
          // Update the state with the fetched data
          setLeftContent(data.leftContent);
          setRightContent(data.rightContent);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  };
  

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []); // Empty dependency array to ensure it runs only once when the component mounts

  const startRecording = () => {
    setIsRecording(true);
    import('./record_send.js').then(module => {
      module.startRecording();
    }).catch(error => {
      console.error('Failed to load record_send.js:', error);
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    import('./record_send.js').then(module => {
      module.stopRecording();
    }).catch(error => {
      console.error('Failed to load record_send.js:', error);
    });
  };

  return (
    <div className="App">
      <div className="header">
        <button className="top-left-button" onClick={startRecording} disabled={isRecording}>Start Recording</button>
        <button className="top-left-button stop-button" onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
      </div>
      <div className="content">
        <TextDisplay content={leftContent} side="left" />
        <TextDisplay content={rightContent} side="right" />
      </div>
    </div>
  );
}

export default App;
