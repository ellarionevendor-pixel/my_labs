# Lab 3: CSRF Where Token Validation Depends on Token Being Present

## Objective

The goal of this lab was to exploit a CSRF vulnerability in the email change functionality by submitting a request without a CSRF token.

## Analysis

1. **Inspecting the email change functionality**

   Logged in using the provided credentials:

   ```text
   Username: wiener
   Password: peter
   ```

   Inspected the email change request and identified that the application used a CSRF token as a protection mechanism.

2. **Identifying the validation weakness**

   The application did not properly enforce the presence of a CSRF token.

   Instead of rejecting requests without a token, it only performed token validation when a token was included in the request.

   This meant that removing the CSRF parameter entirely could bypass the protection.

3. **Creating the exploit**

   Created an HTML page containing a hidden form that submits a POST request to:

   ```http
   POST /my-account/change-email
   ```

   The form included only the new email address and deliberately omitted the CSRF token.

   JavaScript automatically submitted the form when the page loaded.

4. **Delivering the exploit**

   Uploaded the HTML file to the exploit server. When the simulated victim visited the page while authenticated, their browser submitted the forged request using their existing session.

## Exploitation

The relevant part of the exploit is:

```html
<form method="POST" action="https://LAB-ID.web-security-academy.net/my-account/change-email">
    <input type="hidden" name="email" value="istole@of.com">
</form>

<script>
    document.forms[0].submit();
</script>
```

Notice that the form does not contain a CSRF token parameter.

The application accepts the request because its validation logic does not reject requests where the token is missing.

## Result

Successfully solved the lab by submitting a forged email change request without including a CSRF token.

The vulnerability occurred because the application checked the validity of a token only when one was provided, rather than requiring a valid token for every state-changing request.