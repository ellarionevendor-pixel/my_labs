# Lab 2: CORS Vulnerability with Trusted Null Origin

## Objective
The goal of this lab was to investigate a CORS misconfiguration where the server trusts requests with a `null` origin and determine whether sensitive account information could be accessed.

## Analysis
1. Changed the Origin header to an arbitrary value.
   - Result: Not trusted.
2. Tested a request with a `null` origin.
   - Result: Vulnerable. The server trusted the null origin.

## Exploitation
I created an HTML page with a hidden sandboxed iframe using `sandbox="allow-scripts"`. This gives the iframe an opaque origin, which is serialized as `null` in cross-origin requests.

Inside the iframe, JavaScript sends a credentialed XMLHttpRequest to the target's `/accountDetails` endpoint. When the response is received, the script attempts to forward the response data to the exploit server.

## Result
The exploit tests whether trusting a `null` origin allows sensitive account information to be read through a cross-origin request. The intended lab objective is to retrieve and submit the administrator's API key.

## Lessons Learned
- A `null` origin is not inherently trustworthy.
- Sandboxed documents can have opaque origins.
- Credentialed CORS access should be restricted to explicitly trusted origins.
- CORS policies should be tested with different origin values.
