# Lab 1: Reflected XSS into HTML Context with Nothing Encoded

## Objective
The goal of this lab was to identify and exploit a reflected XSS vulnerability in the website's search functionality by injecting JavaScript into the search field.

## Analysis
1. Search input testing:
   - Entered a basic XSS payload into the search field: `<script>alert(1)</script>`.
   - Observed that the input was reflected directly into the page without HTML encoding.
   - Result: Vulnerable.

2. Payload execution:
   - The browser interpreted the injected script as part of the HTML document and executed it.
   - Result: Successful. The alert function was triggered and the lab was solved.

## Exploitation
I used the search parameter in the URL to submit a JavaScript payload:

`?search=<script>alert(1)</script>`

The application reflected the supplied input into its HTML response without proper encoding. As a result, the browser interpreted the injected script tag as executable JavaScript.

## Result
Successfully demonstrated reflected cross-site scripting by triggering the browser's `alert()` function through the search parameter.

## Lessons Learned
- User input reflected into HTML must be properly encoded.
- Untrusted input should not be inserted directly into an HTML document.
- Reflected XSS can occur when applications fail to distinguish between user-supplied data and executable HTML.
- Context-appropriate output encoding is an important part of preventing XSS.
