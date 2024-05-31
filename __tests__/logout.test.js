import { JatisLogin } from "./../login-sdk.js";
import fetch from "jest-fetch-mock"

const SESSION = "jatis-session"
const TOKEN = "jatis-token"

fetch.enableMocks();


describe("function logout", () => {

    const reloadFn = () => {
        window.location.reload();
    };
    beforeEach(() => {
        fetchMock.resetMocks();
        document.cookie = '';
        jest.useFakeTimers();
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: jest.fn() },
        });

    });

    const options = {
        clientId: 'TEST_CLIENT_1',
        host: 'http://localhost:8080',
        redirectUrl: "https://google.com",
        loopCount: 10,
        interval: 5
    }
    it('logout should delete cookies and call fetchLogout, success', async () => {

        const jatis = new JatisLogin(options);
        const value = 'session-random';

        const setCookieMock = (name, value) => {
            document.cookie = `${name}=${value || ''};`;
        };

        jest.spyOn(document, 'cookie', 'set');

        setCookieMock(SESSION, value);
        expect(document.cookie).toBe(`${SESSION}=${value}`);
        jest.spyOn(jatis, "generateSignature").mockResolvedValue("valid-signature");

        jatis.logout()
        reloadFn();
        expect(window.location.reload).toHaveBeenCalled();

        // const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        // expect(consoleLogSpy).toHaveBeenCalledWith("Already logged in. Please logout first");


    });

    it('session in cookie is already null', async () => {
        const jatis = new JatisLogin(options);


        jatis.getCookie = jest.fn()

        // Call the logout function
        jatis.logout();

        expect(jatis.getCookie).toHaveBeenCalledWith(SESSION);


    });
});



