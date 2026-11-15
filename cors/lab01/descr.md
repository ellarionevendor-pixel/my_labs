# Lab 1: CORS Vulnerability with Basic Origin Reflection

## Objective
The goal of this lab was to exploit an insecure CORS configuration that reflects arbitrary origins and allows credentialed cross-origin requests. The aim was to access the administrator's API key through the account details endpoint.

## Analysis
1. Origin reflection:
   - Tested the server using an arbitrary Origin header.
   - The server reflected the supplied origin in the Access-Control-Allow-Origin response header.
   - Result: Vulnerable.

2. Credentialed requests:
   - Checked the Access-Control-Allow-Credentials response header.
   - The server allowed credentials in cross-origin requests.
   - Result: Vulnerable.

## Exploitation
I created an HTML page containing JavaScript that sends an XMLHttpRequest to the target's `/accountDetails` endpoint.

The request uses `withCredentials = true` to include the browser's credentials. When the response is received, the script attempts to send the response body to the exploit server's `/log` endpoint using a `fetch` request.

The page also contains an image with an invalid source and an `onerror` handler that displays an alert. This serves as a basic test to confirm that JavaScript executes when the page is opened.

## Result
The exploit is designed to retrieve account details through a credentialed cross-origin request and forward the response to the exploit server. Successful retrieval depends on the target's CORS response headers and the browser's authentication context.

The lab's intended success condition is the successful submission of the administrator's API key.

## Lessons Learned
- Arbitrary origin reflection can allow untrusted websites to read sensitive responses.
- Allowing credentials in cross-origin requests increases the impact of an overly permissive CORS policy.
- Sensitive account information should only be accessible to appropriately authorized origins.
- JavaScript execution and successful cross-origin response access are separate things and should be tested independently.
