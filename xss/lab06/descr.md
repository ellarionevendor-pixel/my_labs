# Lab 6: DOM XSS in jQuery Selector Sink Using a Hashchange Event

## Objective
The goal of this lab was to identify and exploit a DOM-based XSS vulnerability caused by unsafe handling of URL fragments in a jQuery selector.

## Analysis
1. Vulnerable script discovery:
   - Inspected the page source and found a script listening for the `hashchange` event.
   - The script reads the URL fragment using `window.location.hash`.
   - It decodes the fragment with `decodeURIComponent()` and inserts it directly into a jQuery selector.
   - Result: Vulnerable. User-controlled input reaches the jQuery `$()` selector without proper validation.

2. Vulnerability analysis:
   - The application uses the `:contains()` selector to search for a blog post based on its title.
   - Since the URL fragment is inserted directly into the selector, specially crafted input can change how jQuery interprets the selector.
   - This creates a DOM XSS vulnerability.

## Exploitation
I created an HTML page containing an iframe that loads the vulnerable website.

When the iframe finishes loading, its `onload` event modifies the URL fragment by appending an HTML image element with an invalid source and an `onerror` handler.

The injected image triggers the `print()` function when its loading fails. This demonstrates that attacker-controlled input can lead to JavaScript execution through the vulnerable jQuery selector.

## Result
The vulnerability allows JavaScript execution in the context of the target website through manipulation of the URL fragment. The lab's objective is to deliver the exploit to the victim and trigger the browser's `print()` function.

## Lessons Learned
- URL fragments should not be treated as trusted input.
- User-controlled data should never be inserted directly into HTML or selector expressions without proper handling.
- jQuery selector functions can become dangerous when used with untrusted input.
- DOM-based vulnerabilities can occur entirely on the client side, without requiring a malicious server response.
