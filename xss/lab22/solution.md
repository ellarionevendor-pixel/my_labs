# Lab 22: Stored XSS into Blog Comments — Session Cookie Theft and Impersonation

## Objective

The goal of this lab was to exploit a stored XSS vulnerability in the blog comments functionality, obtain the victim's session cookie, and use it to impersonate the victim.

The intended solution uses Burp Collaborator to exfiltrate the cookie. However, I explored an alternative approach that uses the application's own comment functionality to retrieve the cookie without requiring Burp Collaborator.

## Analysis

1. **Inspecting the comment submission request**

   First, I submitted a normal comment and intercepted the request in Burp Suite.

   The request was sent to:

   ```http
   POST /post/comment
   ```

   The request body contained the following parameters:

   ```text
   csrf=...&postId=3&comment=...&name=...&email=...&website=...
   ```

   The CSRF token was the main obstacle. Since the simulated victim has a different session, I could not simply reuse my own token.

2. **Locating the CSRF token**

   Inspected the page source and found that the token was stored in a hidden input:

   ```html
   <input required type="hidden" name="csrf" value="...">
   ```

   Since the comment section was vulnerable to stored XSS, injected JavaScript could access this input directly from the victim's browser.

3. **Confirming the XSS vulnerability**

   Tested the comment functionality with a basic script element:

   ```html
   <script></script>
   ```

   The script was accepted and executed when the comment was viewed.

   This confirmed that JavaScript could run in the context of the application's origin.

4. **Building the alternative exploit**

   The exploit uses the `DOMContentLoaded` event to ensure the page has been parsed before accessing the CSRF token.

   It then:
   - Reads the victim's CSRF token from the hidden input.
   - Creates a `FormData` object containing the required comment fields.
   - Places `document.cookie` in the comment field.
   - Submits the form to `/post/comment` using `fetch()`.

   This effectively makes the victim's browser submit a second comment containing the victim's accessible cookies.

   The implementation is in the separate `exploit.js` file.

5. **Retrieving the victim's session**

   After the injected script executed, I inspected the newly submitted comment and obtained the session cookie stored in its content.

   I then used that session value in a request to:

   ```http
   GET /my-account
   ```

   Replacing my own session cookie with the victim's session cookie allowed me to access the victim's account.

## Exploitation

The exploit follows this sequence:

1. Submit a stored XSS payload through the comment functionality.
2. Wait for the simulated victim to view the comments.
3. The injected JavaScript reads the victim's CSRF token and accessible cookies.
4. The script submits another comment containing the cookie.
5. Retrieve the cookie from the newly created comment.
6. Replace the session cookie in a request to `/my-account` to impersonate the victim.

## Result

Successfully solved the lab using an alternative approach that does not require Burp Collaborator.

Instead of sending the victim's cookie to an external server, the exploit uses the application's own comment functionality as a channel for retrieving it. The stolen session cookie was then used to access the victim's account.