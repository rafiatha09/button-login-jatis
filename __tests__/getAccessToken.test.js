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
  });

  const options = {
    clientId: "TEST_CLIENT_1",
    host: "http://localhost:8080",
    redirectUrl: "https://google.com",
    loopCount: 10,
    interval: 5,
  };

  it("token is in cookie", async () => {
    const jatis = new JatisLogin(options);
    const tokenInSession = "token-random";

    document.cookie = `${TOKEN}=${tokenInSession}`;

    const token = await jatis.getAccessToken();

    expect(token).toBe(tokenInSession);
  });

  it("token is not in cookie, session != null", async () => {
    const jatis = new JatisLogin(options);

    // Mock the implementation of getCookie
    jest.spyOn(jatis, "getCookie").mockImplementation((name) => {
      if (name === SESSION) return "session-random";
      if (name === TOKEN) return null;
      return null;
    });

    fetch.mockResponseOnce(JSON.stringify({ token: "new-token" }));

    // Mock setCookie and generateSignature
    jest.spyOn(jatis, "setCookie").mockImplementation((name, value) => {
      document.cookie = `${name}=${value}`;
    });
    jest.spyOn(jatis, "generateSignature").mockResolvedValue("valid-signature");

    const token = await jatis.getAccessToken();

    // Assertions
    expect(jatis.getCookie).toHaveBeenCalledWith(TOKEN);
    expect(jatis.getCookie).toHaveBeenCalledWith(SESSION);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${options.host}/get-access-token?client_id=${options.clientId}&session=session-random`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Timestamp': expect.any(Number),
          'Signature': "valid-signature",
        },
      }
    );

    expect(token).toBe("new-token");
    expect(jatis.setCookie).toHaveBeenCalledWith(TOKEN, "new-token");
  });
});
