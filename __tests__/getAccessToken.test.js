const fetch = require("jest-fetch-mock");
const JatisLogin = require("../login-sdk");

const SESSION = "jatis-session"
const TOKEN = "jatis-token"

fetchMock.enableMocks();



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

    // it('token is not in cookie, session != null', async () => {

    //     const jatis = new JatisLogin(options);

    //     const value = 'session-random';
    //     const setCookieMock = (name, value) => {
    //         document.cookie = `${name}=${value || ''};`;
    //     };

    //     jest.spyOn(document, 'cookie', 'set');

    //     setCookieMock(SESSION, value);

    //     expect(document.cookie).toBe(`${SESSION}=${value};`);

    //     jatis.getCookie = jest.fn();

    //     fetchMock.mockResponseOnce(JSON.stringify({ token: 'new-token' }));

    //     await jatis.getAccessToken();

    //     expect(jatis.getCookie(SESSION)).not.toBeNull();
    //     expect(jatis.getCookie).toHaveBeenCalledWith(TOKEN);
    //     expect(jatis.getCookie).toHaveBeenCalledWith(SESSION);
    //     expect(fetchMock).toHaveBeenCalledWith(`${options.host}/get-access-token?client_id=${options.clientId}&session=session-random`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-Timestamp': expect.any(Number),
    //             'Signature': expect.any(String),
    //         }
    //     });

    // });


})