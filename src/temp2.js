import React, { useState, useEffect } from 'react';
import './App.css';
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

  if (window.location.href === 'http://localhost:5173/') {
    return (
      <div className="App">
        <div className="header"></div>
        <div className="content">
          <AuthorizationButton showButton={true} />
        </div>
      </div>
    );
  } else {
    const handleClick = () => {
      const urlParts = window.location.href.split('=');
      sendAuthorizationCode(urlParts[urlParts.length - 1]);
    }
    return (
      <div className="App">
        <div className="header">
        <button className="top-left-button" onClick={handleClick}>Send Token</button>
          </div>
        <div className="content">
        </div>
      </div>
    );
  }
}

export default App;
