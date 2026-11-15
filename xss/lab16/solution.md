# Lab 16: Reflected XSS with Some SVG Markup Allowed

## Objective

The goal of this lab was to exploit a reflected XSS vulnerability in the search functionality by using SVG markup.

The application blocks most common HTML tags but still allows certain SVG elements and event handlers. I needed to identify which combinations were accepted and use them to execute `alert(1)`.

## Analysis

### 1. Testing the HTML tag restrictions

I started by testing a common HTML element to understand how strict the filtering was.

For example:

```html
<img>
```

Result: The application rejected the tag.

This suggested that common HTML elements were blocked, so I moved on to testing SVG markup.

### 2. Finding allowed SVG elements

I tested the following tag:

```html
<svg>
```

Result: Accepted.

After confirming that SVG markup was allowed, I used Burp Suite Intruder to test different SVG elements and identify which ones were accepted by the application.

I copied a list of SVG tags from the PortSwigger XSS cheat sheet and tested them.

The following elements returned a successful response:

- `<svg>`
- `<animateTransform>`
- `<image>`

This narrowed down the possibilities for building the payload.

### 3. Finding an allowed event handler

Next, I tested different event-handler attributes on the allowed SVG elements.

I used Intruder again, this time testing event names against the `animateTransform` element.

The attribute that passed the filter was:

```html
onbegin
```

This was the important discovery because `onbegin` is an SVG animation event that fires when an animation begins.

### 4. Combining the results

After identifying an allowed SVG element and event handler, I combined them into a single payload:

```html
<svg><animateTransform onbegin=alert(1)>
```

Result: Successful. The JavaScript executed and the lab was solved.

## Exploitation

The final payload was:

```html
<svg><animateTransform onbegin=alert(1)>
```

The payload uses an SVG animation element with an `onbegin` event handler. When the animation begins, the event handler executes `alert(1)`.

## Result

Successfully exploited the reflected XSS vulnerability by combining an allowed SVG element with an allowed event handler.

The lab demonstrated that blocking common HTML tags is not enough to prevent XSS. SVG elements have their own event handlers and execution behavior, which can introduce additional attack vectors.