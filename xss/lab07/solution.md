# Lab 7: Reflected XSS into Attribute with Angle Brackets HTML-Encoded

## Objective

The goal of this lab was to exploit a reflected XSS vulnerability in the blog search functionality. Although the application HTML-encodes angle brackets, the search input is still inserted into an HTML attribute without properly handling other potentially dangerous characters.

## Analysis

1. **Identifying where the input is reflected:**
   - I tested the search functionality and checked where the submitted text appeared in the page.
   - The input was reflected directly in the `<h1>` heading, specifically within an HTML attribute.

2. **Testing attribute injection:**
   - Since angle brackets were HTML-encoded, injecting a new HTML element or a `<script>` tag was not a suitable approach.
   - Instead, I tried adding a `style` attribute to change the appearance of the heading.
   - Result: Successful. This confirmed that I could break out of the existing attribute and inject another one.

3. **Testing JavaScript execution:**
   - After confirming that attribute injection was possible, I used an `onmouseover` event handler to execute JavaScript.
   - Result: Successful. Moving the mouse over the heading triggered `alert(1)`, and the lab was solved.

## Exploitation

I used the following injected attributes:

- Style test: `" style="color: #333; font-size: 2em;"`
- XSS payload: `" onmouseover="alert(1)"`

The key was to inject a new event-handler attribute rather than trying to insert a new HTML element. Once the browser processed the reflected input, the `onmouseover` handler executed when the heading was hovered over.

## Result

Successfully exploited the reflected XSS vulnerability by injecting an event-handler attribute into the heading. HTML-encoding angle brackets did not prevent the attack because the application failed to properly handle user input in its HTML attribute context.

## Lessons Learned

- HTML-encoding angle brackets alone is not enough to prevent XSS.
- User input must be encoded according to the context in which it is inserted.
- HTML attributes can introduce XSS risks, especially when event handlers are allowed.
- Testing how input is reflected can reveal whether an application is vulnerable to attribute injection.