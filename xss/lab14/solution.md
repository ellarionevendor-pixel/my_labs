# Lab 14: Reflected XSS into HTML Context with Most Tags and Attributes Blocked

## Objective

The goal of this lab was to exploit a reflected XSS vulnerability in the search functionality while bypassing a Web Application Firewall (WAF).

The application blocks most common HTML tags and attributes, so a typical payload such as an injected `<img>` element is rejected.

To solve the lab, I needed to find an allowed HTML element and use it to execute `print()` automatically, without requiring any user interaction.

## Analysis

### 1. Testing the WAF

I started by trying a simple HTML injection using an image tag:

```html
<img>
```

The application rejected the tag, confirming that the WAF was filtering common XSS payloads.

### 2. Finding an allowed HTML tag

Instead of guessing which tags might be accepted, I used Burp Suite Intruder to test different HTML tags against the search functionality.

After testing multiple possibilities, I found that the `<body>` tag was allowed by the WAF.

This was an important discovery because the `body` element supports event handlers that can execute JavaScript.

### 3. Building an automatic trigger

The next challenge was executing JavaScript without requiring the victim to click or hover over anything.

I used the `onresize` event handler on the injected `body` element:

```html
<body onresize=print()>
```

To trigger the resize event automatically, I used an iframe and changed its width after loading.

This allowed the event handler to execute without any manual interaction.

## Exploitation

I used the following exploit:

```html
<iframe src="https://LAB-ID/?search=%22%3E%3Cbody%20onresize=print()%3E" onload=this.style.width='8px'>
```

The exploit works in several stages:

1. The iframe loads the vulnerable lab page with the injected search parameter.
2. The payload escapes the existing HTML context and introduces a `body` element with an `onresize` event handler.
3. Once the iframe loads, its `onload` handler changes the iframe's width to `8px`.
4. This resize triggers the injected `onresize` handler, which executes `print()`.

The important part is that the event is triggered automatically by the iframe's load handler, so no interaction from the victim is required.

## Result

Successfully bypassed the WAF and executed `print()` through a reflected XSS vulnerability.

The solution relied on finding an allowed HTML tag, using an event handler that was not blocked, and triggering it automatically through an iframe resize.
