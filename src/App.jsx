import React, { useState, useEffect } from 'react';
import './App.css';
import TextDisplay from './TextDisplay'; 
import AuthorizationButton from './Authorization';

function sendAuthorizationCode(code) {
  fetch('http://localhost:5000/receive_code', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
          'code': code
      })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text();
  })
  .then(data => {
      console.log('Response:', data);
      // Handle response as needed
  })
  .catch(error => {
      console.error('Error:', error);
      // Handle error as needed
  });
}

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [leftContent, setLeftContent] = useState('');

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

  const sendToZoom = () => {
    fetch('http://localhost:5000/send_to_zoom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'content': 'HELLOWORLD' }) 
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to send to Zoom');
      }
      return response.json();
    })
    .then(data => {
      if (data.error) {
        throw new Error(data.error);
      } else {
        console.log('Message sent to Zoom successfully');
      }
    })
    .catch(error => console.error('Error sending to Zoom:', error));
  };
  
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
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []); // Empty dependency array to ensure it runs only once when the component mounts

  if (window.location.href === 'https://zoomtest.vercel.app/') {
    return (
      <div className="App">
        <div className="header"></div>
        <div className="content">
          <AuthorizationButton showButton={true} />
        </div>
      </div>
    ); }
  else {
    const urlParts = window.location.href.split('=');
    sendAuthorizationCode(urlParts[urlParts.length - 1]);
  return (
    <div className="App">
      <div className="header">
        <button className="top-left-button" onClick={startRecording} disabled={isRecording}>Start Recording</button>
        <button className="top-left-button stop-button" onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
        <button className="top-left-button send-button" onClick={sendToZoom}>Send to Zoom</button>
      </div>
      <div className="content">
        <TextDisplay content={leftContent} side="left" funct={()=>setLeftContent}/>
      </div>
    </div>
    );
  }
}

export default App;
