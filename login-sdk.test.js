const fetch = require("jest-fetch-mock");
const JatisLogin = require("./login-sdk");

// jest.mock('./utils', () => ({
//     getCookie: jest.fn(),
//     deleteCookie: jest.fn(),
// }));

const SESSION = "jatis-session"
const TOKEN = "jatis-token"

fetchMock.enableMocks();


describe("logout success", () => {
    beforeEach(() => {
        fetch.resetMocks();
        document.cookie = '';
    });

    const options = {
        clientId: 'TEST_CLIENT_1',
        host: 'http://localhost:8080',
        redirectUrl: "https://google.com",
        loopCount: 10,
        interval: 5
    }
    it('logout should delete cookies and call fetchLogout', async () => {
        const value = 'session-random';

        const setCookieMock = (name, value) => {
            document.cookie = `${name}=${value || ''};`;
        };

        jest.spyOn(document, 'cookie', 'set');

        setCookieMock(SESSION, value);

        expect(document.cookie).toBe(`${SESSION}=${value}`);

        const jatis = new JatisLogin(options);


        await jatis.logout();

    });

    it('logout should delete cookies and call fetchLogout', async () => {
        const jatis = new JatisLogin(options);


        jatis.getCookie = jest.fn()
        jatis.deleteCookie = jest.fn();

        // Call the logout function
        await jatis.logout();

        expect(jatis.getCookie).toHaveBeenCalledWith(SESSION);


    });
});


describe("getAccessToken", () => {

    beforeEach(() => {
        fetch.resetMocks();
        cookies = {}; // Reset cookies object

        Object.defineProperty(document, 'cookie', {
            get: jest.fn(() => {
                return Object.entries(cookies).map(([name, value]) => `${name}=${value}`).join('; ');
            }),
            set: jest.fn((cookie) => {
                const [nameValue, ...rest] = cookie.split('; ');
                const [name, value] = nameValue.split('=');
                cookies[name.trim()] = value.trim();
            }),
            configurable: true
        });

        jest.clearAllMocks();
    });

    const options = {
        clientId: 'TEST_CLIENT_1',
        host: 'http://localhost:8080',
        redirectUrl: "https://google.com",
        loopCount: 10,
        interval: 5
    }
    it('token is in cookie', async () => {
        const jatis = new JatisLogin(options);
        const tokenInSession = 'token-random';

        const setCookieMock = (name, value) => {
            document.cookie = `${name}=${value || ''};`;
        };

        jest.spyOn(document, 'cookie', 'set');

        setCookieMock(TOKEN, tokenInSession);



        // Call the logout function
        await jatis.getAccessToken();

        console.log('cookie after test 1', document.cookie);



    });

    it('token is not in cookie', async () => {
        console.log('cookie before test 2', document.cookie);
        const jatis = new JatisLogin(options);

        const value = 'session-random';
        const setCookieMock = (name, value) => {
            document.cookie = `${name}=${value || ''};`;
        };

        jest.spyOn(document, 'cookie', 'set');

        setCookieMock(SESSION, value);


        expect(document.cookie).toBe(`${SESSION}=${value}`);

        // Call the logout function
        await jatis.getAccessToken();



        // Assert deleteCookie calls

        expect(getCookie).toHaveBeenCalledWith(TOKEN);
        expect(getCookie).toHaveBeenCalledWith(SESSION);

    });


})
