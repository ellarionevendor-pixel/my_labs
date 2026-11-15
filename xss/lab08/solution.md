# Lab 8: Stored XSS into Anchor `href` Attribute with Double Quotes HTML-Encoded

## Objective

The goal of this lab was to exploit a stored XSS vulnerability in the comment functionality. The application stores the website URL provided with a comment and uses it as the `href` value of the comment author's name.

To solve the lab, I needed to make JavaScript execute when someone clicked the comment author's name.

## Analysis

1. **Inspecting the comment functionality:**
   - I noticed that the comment form includes a `Website` field.
   - After submitting a comment, the website value was stored and displayed as the destination of a link around the comment author's name.

2. **Testing the `href` attribute:**
   - The submitted URL appeared inside an anchor's `href` attribute.
   - Although double quotes were HTML-encoded, the application still accepted a `javascript:` URL scheme.

3. **Confirming the vulnerability:**
   - I tested the `javascript:alert(1)` payload in the Website field.
   - After submitting the comment, clicking the author's name executed the JavaScript.
   - Result: Successful. The lab was solved.

## Exploitation

I entered the following payload in the Website field:

`javascript:alert(1)`

The application stored this value and used it as the link destination for the comment author's name. When the link was clicked, the browser interpreted the `javascript:` URL and executed `alert(1)`.

## Result

Successfully demonstrated stored XSS through an unsafe anchor `href` attribute. The injected value was saved with the comment and executed when the author's name was clicked.

## Lessons Learned

- Stored XSS can occur when user-submitted data is saved and later rendered to other users.
- HTML-encoding quotation marks does not make every URL safe.
- The `href` attribute should only accept validated URL schemes, such as `https:` and `http:`, when those are the intended destinations.
- User-controlled URLs should be validated before being stored or rendered as links.