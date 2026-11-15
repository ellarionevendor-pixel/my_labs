# Lab 3: CORS Vulnerability with Trusted Insecure Protocols

## Objective
The goal of this lab was to investigate a CORS misconfiguration where subdomains are trusted regardless of protocol, and determine whether this trust could be abused to access sensitive account information.

## Analysis
1. Arbitrary origin testing:
   - Changed the Origin header to an unrelated domain.
   - Result: Not trusted.

2. Null origin testing:
   - Tested a request with a `null` origin.
   - Result: Not trusted.

3. Subdomain testing:
   - Tested an origin associated with the target's subdomain.
   - Result: Trusted.

4. Origin validation testing:
   - Investigated how the application handled origins containing additional text before a trusted domain.
   - This helped examine the possibility of insufficiently strict origin validation.

5. Stock-check subdomain discovery:
   - Identified the `stock` subdomain used by the stock-check functionality.
   - This provided a potential entry point for further testing.

## Exploitation
I created an HTML page that redirects the browser to the stock-check subdomain and passes a JavaScript payload through the `productId` parameter.

The payload attempts to execute in the context of the stock-check subdomain, send a credentialed XMLHttpRequest to the main application's `/accountDetails` endpoint, and forward the response to the exploit server.

## Result
The exploit tests whether the trust relationship between the main application and its subdomain can be abused to access sensitive account information. The intended lab objective is to retrieve and submit the administrator's API key.

## Lessons Learned
- CORS policies should validate the complete origin, including its protocol and hostname.
- Trusting subdomains without considering their security can introduce additional attack paths.
- User-controlled URL parameters should be handled safely to prevent script injection.
- Related subdomains should be included when assessing an application's security boundaries.
