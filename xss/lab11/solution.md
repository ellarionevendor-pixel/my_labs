# Lab 11: DOM XSS in AngularJS Expression with Angle Brackets and Double Quotes HTML-Encoded

## Objective

The goal of this lab was to exploit a DOM-based XSS vulnerability in the search functionality by injecting an AngularJS expression that executes JavaScript.

The application uses AngularJS to evaluate expressions inside double curly braces (`{{ }}`). This makes it possible to execute JavaScript through AngularJS expressions, even when angle brackets and double quotes are HTML-encoded.

## Analysis

1. **Understanding AngularJS expressions:**
   - AngularJS processes HTML elements inside an application marked with the `ng-app` directive.
   - Expressions inside double curly braces are evaluated automatically.
   - For example, `{{ 5 * 203 }}` is evaluated as an expression rather than displayed as plain text.

2. **Exploring the JavaScript constructor:**
   - I created a small playground to understand how AngularJS evaluates expressions and how JavaScript's `constructor` property works.
   - I tested the `Function` constructor, which allows a new function to be created from a string containing JavaScript code.
   - I then explored how this constructor could be accessed through an AngularJS expression.

3. **Testing the XSS payload:**
   - I used the following expression:

   ```javascript
   {{ $eval.constructor('alert(1)')() }}
   ```

   - The expression accesses the constructor through `$eval`, creates a function containing `alert(1)`, and immediately executes it.
   - Result: Successful. The alert was triggered and the lab was solved.

## Exploitation

I used the following AngularJS expression in the search functionality:

```javascript
{{ $eval.constructor('alert(1)')() }}
```

The payload takes advantage of AngularJS expression evaluation. Instead of injecting a traditional HTML element or script tag, it uses AngularJS itself to evaluate the expression and execute JavaScript.

This approach works because the vulnerability is in the way AngularJS processes the expression, rather than in the insertion of HTML markup.

## Result

Successfully demonstrated DOM-based XSS through AngularJS expression evaluation. The payload executed JavaScript without relying on HTML tags, bypassing the protection provided by encoding angle brackets and double quotes.