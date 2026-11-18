# Lab 4: CSRF Where Token Is Not Tied to User Session

## Objective

The goal of this lab was to exploit a CSRF vulnerability caused by improper CSRF token validation. The application accepts valid tokens without checking whether they belong to the session submitting the request.

## Analysis

1. **Inspecting the email change functionality**

   The application provides two accounts for testing:

   ```text
   Account 1:
   Username: wiener
   Password: peter

   Account 2:
   Username: carlos
   Password: montoya
   ```

   After logging in to both accounts, I inspected the email change functionality and captured the corresponding POST requests.

2. **Identifying the token validation weakness**

   The application uses CSRF tokens to protect the email change functionality.

   However, the token validation is not properly integrated with session handling. This means the application checks whether the submitted token is valid but does not verify whether it belongs to the current user's session.

   As a result, a token generated for one account can potentially be reused in a request authenticated as another account.

3. **Creating the exploit**

   I obtained a valid CSRF token from one account and inserted it into the forged HTML form.

   The form submits a POST request to:

   ```http
   POST /my-account/change-email
   ```

   It includes:
   - The new email address.
   - A valid CSRF token obtained from the other account.

   JavaScript automatically submits the form when the page loads.

4. **Delivering the exploit**

   Uploaded the HTML file to the exploit server. When the simulated victim visited the exploit page while authenticated, their browser submitted the forged request using their existing session.

   Although the token came from a different account, the application accepted it because it was valid and did not verify its association with the victim's session.

## Exploitation

The important part of the exploit is the CSRF token obtained from the other account:

```html
<input type="hidden" name="csrf" value="VALID_TOKEN_FROM_ANOTHER_ACCOUNT">
```

The complete form contains the new email address and the reused token:

```html
<form method="POST" action="https://LAB-ID.web-security-academy.net/my-account/change-email">
    <input type="hidden" name="email" value="istoleyour@gmail.com">
    <input type="hidden" name="csrf" value="VALID_TOKEN_FROM_ANOTHER_ACCOUNT">
</form>

<script>
    document.forms[0].submit();
</script>
```

## Result

Successfully solved the lab by reusing a valid CSRF token generated for a different account.

The vulnerability occurred because the application validated the token itself but did not bind it to the user's authenticated session. This allowed a token from one account to authorize a state-changing request in another account's session.