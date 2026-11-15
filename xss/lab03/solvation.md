# Lab 3: DOM XSS in document.write Sink Using Source location.search

## Objective
The goal of this lab was to identify and exploit a DOM-based XSS vulnerability in the search tracking functionality by injecting HTML and JavaScript through the URL's search parameter.

## Analysis
1. Initial payload testing:
   - Tried injecting `<script>alert(1)</script>` into the `search` URL parameter.
   - Also tested the URL-encoded version of the payload.
   - Result: Not vulnerable with these payloads.

2. Source code inspection:
   - Found a JavaScript function responsible for tracking search queries:

```javascript
function trackSearch(query) {
    document.write('<img src="/resources/images/tracker.gif?searchTerms='+query+'">');
}

var query = (new URLSearchParams(window.location.search)).get('search');

if(query) {
    trackSearch(query);
}
```

   - The application retrieves the search parameter using `URLSearchParams`.
   - The retrieved value is passed directly to `document.write()`.
   - Result: User-controlled input reaches an HTML-writing sink without proper encoding.

3. Payload testing:
   - Used the payload `"><img src=1 onerror=alert(1)>`.
   - The payload breaks out of the existing image attribute and injects a new HTML image element.
   - Result: Vulnerable. The injected event handler executed JavaScript and the lab was solved.

## Exploitation
I used the following payload in the URL's `search` parameter:

`"><img src=1 onerror=alert(1)>`

The application inserted the search value into an HTML string through `document.write()`. By starting with a double quote and closing the existing attribute, I was able to inject a new image element with an `onerror` event handler.

Because the image source was invalid, the error event was triggered and executed `alert(1)`.

## Result
Successfully demonstrated DOM-based XSS through the `document.write()` function. The vulnerability allowed JavaScript execution by manipulating the URL's search parameter.

## Lessons Learned
- DOM-based XSS can occur when URL parameters are passed directly into HTML-writing functions.
- `document.write()` can introduce vulnerabilities when used with untrusted input.
- Breaking out of an existing HTML attribute can allow an attacker to inject new elements.
- User-controlled data should be handled with safe DOM APIs and appropriate output encoding.
