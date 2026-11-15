# Lab 4: DOM XSS in innerHTML Sink Using Source location.search

## Objective
The goal of this lab was to identify and exploit a DOM-based XSS vulnerability in the blog search functionality by injecting HTML through the URL's search parameter.

## Analysis
1. Search input testing:
   - Tested the search functionality by entering the payload `<img src=1 onerror=alert(1)>`.
   - The application processed the input without properly handling the injected HTML.
   - Result: Vulnerable.

2. Vulnerability analysis:
   - The application uses the `innerHTML` property to insert content into a page element.
   - The search input is processed by client-side JavaScript and reaches an HTML insertion sink.
   - Since the input is not properly sanitized, injected HTML can be interpreted by the browser.

3. Payload execution:
   - Used an image element with an invalid source and an `onerror` event handler.
   - The image failed to load, triggering the JavaScript handler.
   - Result: Successful. The alert function was executed and the lab was solved.

## Exploitation
I used the following payload in the search field:

`<img src=1 onerror=alert(1)>`

The payload creates an image element with an invalid source. When the browser fails to load the image, the `onerror` handler executes `alert(1)`.

## Result
Successfully demonstrated DOM-based XSS through an unsafe `innerHTML` assignment. The vulnerability allowed JavaScript execution by manipulating the search input.

## Lessons Learned
- `innerHTML` can be dangerous when used with untrusted input.
- HTML elements can contain event handlers that execute JavaScript.
- DOM-based XSS vulnerabilities can occur entirely on the client side.
- `textContent` is generally a safer alternative when inserting plain text.
