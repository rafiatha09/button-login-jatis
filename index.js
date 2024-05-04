// import React, { useState } from "react";
// import axios from "axios";

function ReverseString(str) {
  const reversedString = str.split("").reduce((acc, char) => char + acc, "");
  return reversedString;
}

// button.js
function JatisButton(options) {
  const button = document.createElement('button');
  button.textContent = options.text || 'Click me';

  if (options.onClick) {
      button.addEventListener('click', options.onClick);
  }

  if (options.style) {
      Object.assign(button.style, options.style);
  }

  return button;
}

// Check if there is a window object (to avoid issues in non-browser environments)
if (typeof window !== 'undefined') {
  window.JatisButton = JatisButton;
}

// module.exports = createButton;




// const ReactLoginButton = ({ AppID, RedirectURL, ConfigID }) => {
//   // Function to handle click event
//   const handleClick = () => {
//     // Construct the URL with the given parameters
//     const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${AppID}&redirect_uri=${RedirectURL}&scope=email&config_id=${ConfigID}`;
    
//     // Redirect to the constructed URL
//     window.location.href = url;
//   };

//   return <button onClick={handleClick}>Login with Facebook</button>;
// };


// const ReactLogoutButton = ({ initialText, onResponse }) => {
//     const handleClick = async () => {
//       try {
//         // POST request using Axios
//         const response = await axios.post("https://localhost:8080/logout", {
//           data: "Your data here", // Customize based on server requirements
//         });
  
//         // Call the onResponse callback with the response data if provided
//         if (onResponse && typeof onResponse === "function") {
//           onResponse(response.data);
//         }
//       } catch (error) {
//         // Error handling
//         console.error("Error posting message:", error);
//         if (onResponse && typeof onResponse === "function") {
//           onResponse(null);
//         }
//       }
//     };
  
//     return <button onClick={handleClick}>Login</button>;
//   };

module.exports = {
  ReverseString,
  JatisButton
  // ReactLoginButton,
  // ReactLogoutButton
};
