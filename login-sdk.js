const SESSION = "jatis-session"
const TOKEN = "jatis-token"

class JatisLogin {
    constructor({ clientId, host, redirectUrl, loopCount = 15, intervalSec = 5 }) {
        this.clientId = clientId;
        this.host = host;
        this.secret = "IAV0kBw4t0";
        this.loopCount = loopCount;
        this.interval = intervalSec;
        this.redirectUrl = redirectUrl;
    }

    async login() {
        const sessionCookie = this.getCookie(SESSION);
        const token = this.getCookie(TOKEN);
        if (sessionCookie != null && token != null) {
            console.log("Already logged in. Please logout first");
            return
        };

        const randomSession = this.generateRandomCookie(SESSION, 32);
        const loginUrl = `${this.host}/login?client_id=${this.clientId}&session=${randomSession}&redirect_url=${this.redirectUrl}`;
        window.open(loginUrl, '_blank');

        if (this.loopCount == 0) { return; }

        let counter = 0;
        const intervalId = setInterval(async () => {
            try {
                const token = await this.#fetchAccessToken(randomSession);
                if (token) {
                    console.log("login meta success");
                    clearInterval(intervalId);

                    return
                }

                throw new Error();

            } catch (error) {
                console.log("No access token found, continue processing...");
            }

            counter++;
            if (counter >= this.loopCount) {
                clearInterval(intervalId);
            }
        }, this.interval * 1000);
    }

    logout() {
        const sessionCookie = this.getCookie(SESSION);
        if (sessionCookie == null) {
            return;
        }

        this.deleteCookie(SESSION);
        this.deleteCookie(TOKEN);
        this.#fetchLogout(sessionCookie)
    }

    getAccessToken() {
        const currentToken = this.getCookie(TOKEN);
        if (currentToken != null) { return currentToken };

        const session = this.getCookie(SESSION);
        if (session != null) {
            this.#fetchAccessToken(session)
        }

        return null;
    }

    async #fetchAccessToken(sessionCookie) {
        try {
            let timestamp = new Date().getTime();
            let signature = await generateSignature(this.clientId, sessionCookie, this.secret, timestamp);

            const response = await fetch(`${this.host}/get-access-token?client_id=${this.clientId}&session=${sessionCookie}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Timestamp': timestamp,
                    'Signature': signature,
                }
            });
            if (!response.ok) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }

            const res = await response.json();
            if (res && res["token"] != null) {
                this.setCookie(TOKEN, res["token"], 32);

                return res["token"];
            }

            return null;

        } catch (error) {
            throw error;
        }
    }

    async #fetchLogout(sessionCookie) {
        try {
            let timestamp = new Date().getTime();
            let signature = await generateSignature(this.clientId, sessionCookie, this.secret, timestamp);

            const response = await fetch(`${this.host}/logout?client_id=${this.clientId}&session=${sessionCookie}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Timestamp': timestamp,
                    'Signature': signature,
                }
            });
            if (!response.ok) {
                throw new Error(`Logout failed with status: ${response.status}`);
            }

            console.log("Successfully logged out.");
            window.location.reload(); // Only reload the window after successful logout
        } catch (error) {
            return
        }
    }

    async generateSignature(clientId, session, secret, timestamp) {
        const formula = `${clientId}:${session}:${secret}:${timestamp}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(formula);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    getCookie(name) {
        const cookieArray = document.cookie.split("; ");
        for (let cookie of cookieArray) {
            const [cookieName, cookieValue] = cookie.split("=");
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    }

    setCookie(name, value, days, options = {}) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;

        let cookieOptions = `; ${expires}; path=${options.path || '/'}`;

        if (options.domain) {
            cookieOptions += `; domain=${options.domain}`;
        }

        if (options.secure) {
            cookieOptions += '; secure';
        }

        if (options.sameSite) {
            cookieOptions += `; SameSite=${options.sameSite}`;
        } else {
            cookieOptions += '; SameSite=Lax';
        }

        document.cookie = `${name}=${encodeURIComponent(value)}${cookieOptions}`;
    }

    generateRandomCookie(name, days) {
        const randomValue =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        this.setCookie(name, randomValue, days);
        return randomValue;
    }

    deleteCookie(name) {
        document.cookie = `${name}=; Max-Age=-99999999;`;
    }
}





module.exports = JatisLogin;