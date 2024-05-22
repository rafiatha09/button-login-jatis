# Widget Button Jatis

A simple, customizable JavaScript button component that provides login and logout functionality.

## Installation

Follow these steps to install and use the Widget Button Jatis in your project:

### Step 1: Install the Package

Install the package using npm by running the following command in your project directory:

```bash
npm i login-button-jatis
```

### Step 2: Set Up Your HTML

Add a script with the type of module to your HTML. You will also need to include buttons with specific IDs that the script will interact with.

Here's how you can set up your HTML:

<body>

    <button id="loginButton">Login</button>
    <button id="logoutButton">Logout</button>

    <script type="module">
        import { login, logout } from './node_modules/login-button-jatis/index.js';

        document.addEventListener('DOMContentLoaded', () => {
            const loginButton = document.getElementById('loginButton');
            const logoutButton = document.getElementById('logoutButton');

            loginButton.addEventListener('click', () => login('client_id'));
            logoutButton.addEventListener('click', () => logout('client_id'));
        });
    </script>

</body>

### Step 3: Import the Modules

Inside your module script, import the login and logout functions from the package. This setup is shown in the script section of the HTML example above.

### Step 4: Initialize the Buttons

Once the DOM content is fully loaded, attach event listeners to the loginButton and logoutButton. These listeners will trigger the imported login and logout functions, respectively.

- Features
Customizable Buttons: Easily modify the button labels and styles to fit the look and feel of your website.
Easy Integration: With just a few lines of code, integrate the login and logout functionality into any web application.

- Requirements
The project must be set up with an HTML file that can import JavaScript modules.
The backend or server-side must handle authentication requests that these buttons trigger.
