import { config } from "./config/default.js";

export function login(clientId) {
  const sessionCookie = getCookie("session");
  if (sessionCookie == null) {
    const randomSession = generateRandomCookie("session", 32);
    console.log(config.HOST);
    const loginUrl = `${config.HOST}/login-bento?client_id=${clientId}&session=${randomSession}`;
    window.open(loginUrl, "_blank");

    let isTimeOut = true;
    let attempts = 0;
    const maxAttempts = 15;

    const interval = setInterval(() => {
      console.log("pooling access token, please wait....");
      if (attempts < maxAttempts) {
        fetchAccessToken(clientId, randomSession)
          .then((tokenReceived) => {
            if (tokenReceived) {
              if (tokenReceived["token"] != null) {
                clearInterval(interval);
                setCookie("token", tokenReceived["token"], 32);
                isTimeOut = false;
                console.log(
                  "Access token fetched successfully. your token is: " +
                    tokenReceived["token"]
                );
              }
              attempts++;
            }
          })
          .catch((error) => {
            console.error("Error fetching access token:", error);
            attempts++;
          });
      } else {
        clearInterval(interval);
        console.error("Failed to fetch access token after maximum attempts.");
      }
    }, 4000); // pooling every 4s

    // Set a timeout to stop the fetch process after 60 seconds
    setTimeout(() => {
      clearInterval(interval);
      if (isTimeOut) {
        console.error("Process timed out after 30 seconds.");
      }
    }, 60000);
  }
}

async function fetchAccessToken(clientId, session) {
  try {
    const response = await fetch(
      `${config.HOST}/get-access-token?client_id=${clientId}&session=${session}`
    );
    if (!response.ok) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null; // Return null or handle error as needed
  }
}
export async function logout(clientId) {
  const sessionCookie = getCookie("session");
  if (sessionCookie == null) {
    console.log("No session cookie found.");
    return; // Exits the function early if no session cookie is found.
  }

  deleteCookie("session");
  deleteCookie("token");

  // Fetch call to log out from the server using the session cookie
  fetch(`${config.HOST}/logout?client_id=${clientId}&session=${sessionCookie}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Logout failed with status: ${response.status}`);
      }
      console.log("Successfully logged out.");
      window.location.reload(); // Only reload the window after successful logout
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
}

// Additional utility functions...

function getCookie(name) {
  const cookieArray = document.cookie.split(";");
  for (let cookie of cookieArray) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName.trim() === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
}

function generateRandomCookie(name, days) {
  const randomValue =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  setCookie(name, randomValue, days);
  return randomValue;
}

function deleteCookie(name) {
  document.cookie = `${name}=; Max-Age=-99999999;`;
}
