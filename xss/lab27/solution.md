# Lab 27: Reflected XSS with Event Handlers and href Attributes Blocked

## Objective

The goal of this lab was to exploit reflected XSS by injecting a clickable element that executes `alert(1)`. The application allowed some HTML tags but blocked event handlers and direct use of the `href` attribute.

## Analysis

### 1. Testing allowed HTML tags

I started by testing a simple anchor element:

```html
<a>Click me</a>
```

The application rendered it as an anchor element, confirming that the `<a>` tag was allowed.

I also tested other tags, such as `<img>`, but the application returned `Tag is not allowed`.

### 2. Testing attribute restrictions

Next, I tried adding a JavaScript URL directly to the anchor:

```html
<a href="javascript:alert(1)">Click me</a>
```

The application rejected it with `Attribute is not allowed`.

This confirmed that I couldn't use `href` directly, and the usual event-handler approach was also blocked.

### 3. Enumerating allowed tags

I used Burp Suite Intruder with tag names from the PortSwigger XSS cheat sheet to identify which elements were accepted.

The following tags passed the filter:

- `a`
- `animate`
- `image`
- `svg`
- `title`

Since SVG and its animation element were allowed, I investigated whether `<animate>` could be used to set an attribute dynamically.

### 4. Using SVG animation to bypass the attribute filter

The key was to use the SVG `<animate>` element to modify the anchor's `href` attribute instead of including that attribute directly in the original HTML.

The final payload was:

```html
<svg>
  <a>
    <animate attributeName=href values=javascript:alert(1) />
    <text x=20 y=20>Click me</text>
  </a>
</svg>
```

The `<animate>` element targets the anchor's `href` attribute and assigns it the value `javascript:alert(1)`.

This bypasses the filter because the `href` attribute is introduced through SVG animation rather than being written directly on the anchor element.

## Exploitation

I submitted the SVG payload through the search parameter. The application rendered the SVG element and its animation.

After clicking the displayed **Click me** text, the animated `href` executed `alert(1)`.

## Result

Successfully exploited reflected XSS by using SVG animation to bypass the restriction on anchor `href` attributes. The attack demonstrated that blocking an attribute in the original HTML does not necessarily prevent it from being created dynamically through another allowed element.