# Lab 30: Reflected XSS Protected by CSP, with CSP Bypass

## Objective

The goal of this lab was to exploit reflected XSS while bypassing the application's Content Security Policy (CSP). The final payload needed to execute `alert(1)` despite the existing script restrictions.

The intended solution requires Chrome.

## Analysis

### 1. Finding the reflected input

The first test involved submitting a basic script tag through the search field:

```html
<script>alert(1)</script>
```

The script did not execute, and the expected script element was not visible in the page source.

Next, an image element was tested:

```html
<img src=1 onerror=alert(1)>
```

The application reflected the input into the search results heading:

```html
<section class="blog-header">
    <h1>0 search results for '<img>'</h1>
    <hr>
</section>
```

This confirmed that the search parameter was reflected into the HTML without fully preventing HTML injection.

### 2. Inspecting the request with Burp Suite

The request was captured using Burp Suite:

```http
GET /?search=%3Cimg+src%3D1+onerror%3Dalert%281%29%3E HTTP/2
```

The important discovery was that the application also accepted a `token` parameter.

This suggested that the token might influence how the CSP was generated, providing another possible injection point.

### 3. Understanding the CSP bypass

The application reflected the `token` parameter into its CSP configuration.

The following value was used:

```text
;script-src-elem 'unsafe-inline'
```

The leading semicolon is important because it separates CSP directives.

The injected value introduces a new directive:

```http
script-src-elem 'unsafe-inline'
```

This directive allows inline JavaScript execution for script elements, overriding the restrictions that would otherwise apply to those elements through `script-src`.

The distinction is important:

- `script-src` controls permitted JavaScript sources and acts as a fallback for script elements.
- `script-src-elem` specifically controls script elements such as `<script>`.
- When `script-src-elem` is present, it takes precedence over `script-src` for those elements.

As a result, injecting this directive weakens the existing CSP and allows the reflected script element to execute.

### 4. Constructing the final payload

The final URL was:

```text
?search=%3Cscript%3Ealert%281%29%3C%2Fscript%3E&token=;script-src-elem%20%27unsafe-inline%27
```

It contains two important parameters:

- `search` contains the reflected XSS payload: `<script>alert(1)</script>`.
- `token` injects the additional CSP directive: `script-src-elem 'unsafe-inline'`.

The browser processes the modified CSP, allowing the injected inline script to execute.

## Exploitation

The final payload was submitted through the URL using Chrome.

The `search` parameter injected the script element into the page, while the `token` parameter modified the CSP by introducing the `script-src-elem 'unsafe-inline'` directive.

With the script restriction bypassed, the browser executed `alert(1)` and the lab was solved.

## Result

Successfully exploited reflected XSS by manipulating the application's CSP configuration.

The attack used HTML injection together with CSP directive injection to override the existing script restrictions and execute JavaScript.