# Lab 15: Reflected XSS into HTML Context with All Tags Blocked Except Custom Ones

## Objective

The goal of this lab was to exploit a reflected XSS vulnerability in the search functionality by injecting a custom HTML element.

The application blocks standard HTML tags but allows custom elements. I needed to take advantage of this behavior to execute JavaScript and display `document.cookie` without requiring manual interaction.

## Analysis

### 1. Understanding the filtering behavior

The lab description indicated that standard HTML tags were blocked, while custom HTML elements were still allowed.

Since injecting regular elements such as `<script>` or `<img>` was not an option, I focused on creating a custom element instead.

### 2. Crafting the custom element

I used the following payload:

```html
<watchout id=w onfocus=alert(document.cookie) tabindex=1>
```

Here is what each part does:

- `watchout` creates a custom HTML element.
- `id=w` gives the element an identifier.
- `onfocus=alert(document.cookie)` executes JavaScript when the element receives focus.
- `tabindex=1` makes the element programmatically focusable.

### 3. Triggering the event automatically

Simply injecting the custom element was not enough. I also needed to trigger its `onfocus` event without requiring the victim to interact with it.

I used the URL fragment `#w` to target the element by its ID. When the browser navigates to that fragment, it attempts to bring the corresponding element into focus.

This allowed the injected event handler to execute automatically.

## Exploitation

I used the following payload to redirect the browser to the vulnerable page with the custom element injected:

```html
<script>
location = 'https://LAB-ID/?search=%3Cwatchout+id%3Dw+onfocus%3Dalert%28document.cookie%29%20tabindex=1%3E#w';
</script>
```

The exploit works in the following sequence:

1. The browser navigates to the vulnerable search page.
2. The `search` parameter contains the injected custom element.
3. The element is assigned the ID `w` and made focusable using `tabindex`.
4. The URL fragment `#w` targets the injected element.
5. The browser focuses the element, triggering its `onfocus` handler.
6. `alert(document.cookie)` executes automatically.

## Result

Successfully bypassed the HTML tag restrictions by injecting a custom element and triggering its event handler through URL fragment navigation.

The lab demonstrated that blocking standard HTML tags does not necessarily prevent XSS when custom elements and their event handlers are still allowed.
