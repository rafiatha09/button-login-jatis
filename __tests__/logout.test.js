const fetch = require("jest-fetch-mock");
const JatisLogin = require("../login-sdk");

// import fetchMock from 'fetch-jest-mock';
// import { JatisLogin } from "../login-sdk"


const SESSION = "jatis-session"
const TOKEN = "jatis-token"

fetch.enableMocks();


describe("logout success", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
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



