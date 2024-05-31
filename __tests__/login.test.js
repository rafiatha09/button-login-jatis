import { JatisLogin } from "./../login-sdk.js";
import fetch from "jest-fetch-mock"

const SESSION = "jatis-session";
const TOKEN = "jatis-token";

fetch.enableMocks();

describe("getAccessToken", () => {
    let cookies;

    beforeEach(() => {
        fetch.resetMocks();
        cookies = {}; // Reset cookies object

        Object.defineProperty(document, "cookie", {
            get: jest.fn(() => {
                return Object.entries(cookies)
                    .map(([name, value]) => `${name}=${value}`)
                    .join("; ");
            }),
            set: jest.fn((cookie) => {
                const [nameValue, ...rest] = cookie.split("; ");
                const [name, value] = nameValue.split("=");
                cookies[name.trim()] = value.trim();
            }),
            configurable: true,
        });

        jest.clearAllMocks();
        global.open = jest.fn();
        jest.useFakeTimers();

    });

    const options = {
        clientId: "TEST_CLIENT_1",
        host: "http://localhost:8080",
        redirectUrl: "https://google.com",
        loopCount: 2,
        interval: 1,
    };
    it("token not found in server", async () => {

        const jatis = new JatisLogin(options);

        jatis.login();

        expect(global.open).toHaveBeenCalled();
        jest.runOnlyPendingTimers();

    });


    it("success Login, token found", async () => {
        const jatis = new JatisLogin(options);

        // Set up mock response for fetch
        fetch.mockResponseOnce(JSON.stringify({ token: "new-token" }), { status: 200 });
        jest.spyOn(jatis, "generateSignature").mockResolvedValue("valid-signature");

        jatis.login();
        expect(global.open).toHaveBeenCalled();
        jest.runOnlyPendingTimers();

    });


    it("already login", async () => {
        const jatis = new JatisLogin(options);
        jest.spyOn(jatis, 'getCookie').mockImplementation((name) => {
            if (name === SESSION) return 'session-random';
            if (name === TOKEN) return 'token-random';
            return null;
        });

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        await jatis.login();

        expect(consoleLogSpy).toHaveBeenCalledWith("Already logged in. Please logout first");

        // Clean up
        consoleLogSpy.mockRestore();
    });



});

// describe('Function generateSignature', () => {
//     const options = {
//         clientId: "TEST_CLIENT_1",
//         host: "http://localhost:8080",
//         redirectUrl: "https://google.com",
//         loopCount: 2,
//         interval: 1,
//     };
//     it('should generate a valid signature', async () => {

//         const jatis = new JatisLogin(options);
//         const timestamp = Date.now();
//         const signature = await jatis.generateSignature(options.clientId, options.session, options.secret, timestamp);

//         expect(signature).toMatch(/^[0-9a-f]{64}$/);
//     });

// });