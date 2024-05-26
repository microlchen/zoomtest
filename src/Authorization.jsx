import React from "react";
import './App.css';

const REDIRECT_URI = 'http://localhost:5173/'
const CLIENT_ID = 'WEubvnyBSjeCq7wKY2UVMw'
class AuthorizationButton extends React.Component {
    handleClick = () => {
      // Replace 'your-authorization-link' with the actual authorization link
      window.location.href = 'https://zoom.us/oauth/authorize?response_type=code&client_id='+CLIENT_ID+'&redirect_uri='+REDIRECT_URI;
    }
  
    render() {
      return (
        <div>
        <button className="top-left-button" onClick={this.handleClick}>
          Authorize
        </button>
        </div>
      );
    }
  }
  
  export default AuthorizationButton;