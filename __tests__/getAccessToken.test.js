const fetch = require("jest-fetch-mock");
const JatisLogin = require("../login-sdk");

// import fetchMock from 'fetch-jest-mock';
// import { JatisLogin } from "../login-sdk"


const SESSION = "jatis-session"
const TOKEN = "jatis-token"

fetch.enableMocks();



describe("getAccessToken", () => {

    beforeEach(() => {
        fetchMock.resetMocks();
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

    });

    it('token is not in cookie, session != null', async () => {

        const jatis = new JatisLogin(options);

        // Spy on the getCookie function
        const getCookieSpy = jest.spyOn(jatis, 'getCookie');

        // Mock the implementation of getCookie
        getCookieSpy.mockImplementation((name) => {
            if (name === SESSION) return 'session-random';
            if (name === TOKEN) return null;
            return null;
        });

        fetchMock.mockResponseOnce(JSON.stringify({ token: 'new-token' }));

        await jatis.getAccessToken();


        jatis.setCookie = jest.fn()
        jatis.generateSignature = jest.fn()

        jatis.setCookie.mockReturnValue()
        await jatis.generateSignature.mockReturnValue('valid-signature')
        // Assertions
        expect(getCookieSpy).toHaveBeenCalledWith(TOKEN);
        expect(getCookieSpy).toHaveBeenCalledWith(SESSION);
        expect(getCookieSpy.mock.results[1].value).toBe('session-random');

        // expect(fetchMock).toHaveBeenCalledTimes(1);
        // expect(fetchMock).toHaveBeenCalledWith(`${options.host}/get-access-token?client_id=${options.clientId}&session=session-random`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-Timestamp': expect.any(Number),
        //         'Signature': expect.any(String),
        //     }
        // });

    });


})