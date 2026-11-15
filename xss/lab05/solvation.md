# Lab 5: DOM XSS in jQuery Anchor `href` Attribute Sink Using Source `location.search`

## Objective

The goal of this lab was to exploit a DOM-based XSS vulnerability in the submit feedback page. The vulnerability allows an attacker to control the `href` attribute of the back link through the URL's `returnPath` parameter.

To solve the lab, the back link must execute JavaScript that displays `document.cookie`.

## Analysis

1. **Inspecting the URL parameter:**
   - The submit feedback page uses the `returnPath` parameter to determine the destination of its back link.
   - The page uses jQuery to select an anchor element and update its `href` attribute with the value from `location.search`.

2. **Testing the parameter:**
   - Tried injecting a JavaScript URL through the `returnPath` parameter.
   - The application accepted the `javascript:` scheme instead of restricting the link to a safe URL.

3. **Confirming the vulnerability:**
   - The injected JavaScript was executed when the back link was clicked.
   - Result: Successful. The lab was solved.

## Exploitation

I used the following URL:

`https://0ae3009d04d4877c81b7de4100240090.web-security-academy.net/feedback?returnPath=javascript:alert(document.cookie)`

The `javascript:` URL causes the browser to execute the supplied JavaScript when the back link is activated. The payload displays the page's cookies using `alert(document.cookie)`.

## Result

Successfully demonstrated DOM-based XSS through an unsafe jQuery `href` attribute assignment. By controlling the `returnPath` parameter, I was able to make the back link execute JavaScript and display `document.cookie`.

## Lessons Learned

- URL parameters can become dangerous when used to set HTML attributes.
- A `javascript:` URL can execute code when used as a link destination and activated.
- Validate URL schemes before assigning untrusted values to `href` attributes.
- DOM-based XSS can occur when client-side JavaScript places untrusted data into a sensitive DOM sink.