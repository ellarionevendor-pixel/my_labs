# Lab 23: Exploiting Cross-Site Scripting to Capture Passwords

## Objective

The goal of this lab was to exploit a stored XSS vulnerability in the blog comments functionality to obtain the simulated victim's username and password, then use those credentials to log in to the victim's account.

The intended solution uses Burp Collaborator to exfiltrate credentials. I explored an alternative approach that uses the browser's password autofill functionality and the application's own comment system.

## Analysis

1. **Confirming the XSS vulnerability**

   First, I tested the comment functionality with a basic payload:

   ```html
   <script>alert(0)</script>
   ```

   The script executed when the comment was viewed, confirming that the comment section was vulnerable to stored XSS.

2. **Inspecting the comment submission request**

   Captured a normal comment submission request in Burp Suite:

   ```http
   POST /post/comment HTTP/2
   ```

   The request body contained several parameters:

   ```text
   csrf=...&postId=8&comment=...&name=...&email=...&website=...
   ```

   As in the previous lab, the CSRF token was required to submit another comment.

3. **Locating the CSRF token**

   Inspected the login and comment page HTML and found that the CSRF token was stored in a hidden input:

   ```html
   <input required type="hidden" name="csrf" value="...">
   ```

   Since the injected JavaScript executes in the application's origin, it can access the page's DOM and read the token.

4. **Understanding browser password autofill**

   The next step was to find a way to obtain the victim's credentials without asking them to enter anything manually.

   I inspected the application's login form:

   ```html
   <form class="login-form" method="POST" action="/login">
       <input required type="hidden" name="csrf" value="...">
       <label>Username</label>
       <input required type="username" name="username" autofocus>
       <label>Password</label>
       <input required type="password" name="password">
       <button class="button" type="submit">Log in</button>
   </form>
   ```

   Browsers can recognize common login form structures, particularly username and password fields, and automatically fill them with credentials saved by the user.

   I created a separate `takedata.html` page containing corresponding username and password inputs. The intention was to make the browser recognize these fields as a login form and autofill the simulated victim's saved credentials.

5. **Capturing the credentials**

   The password input uses an `onchange` event handler to trigger the `hax()` function.

   When the password field changes, the function:
   - Reads the username and password field values.
   - Retrieves the CSRF token from the page.
   - Creates a `FormData` object containing the captured credentials.
   - Places the credentials in the comment field.
   - Submits the comment to `/post/comment`.

   This uses the application's own comment functionality as a channel for retrieving the credentials, rather than sending them to an external server.

6. **Using the captured credentials**

   After the simulated victim's browser populated the login fields and the exploit submitted the credentials, I retrieved them from the newly created comment.

   The captured credentials were:

   ```text
   Username: administrator
   Password: [captured password]
   ```

   I then used these credentials to log in to the administrator account.

## Exploitation

The exploit is separated into two parts:

- **Stored XSS:** Injected into the blog comment section to execute JavaScript in the victim's browser.
- **Credential capture:** The separate `takedata.html` page uses login-style inputs to take advantage of browser password autofill. Its event handler collects the field values and submits them through the comment functionality.

The important idea is that the browser may automatically populate login fields with saved credentials. If an attacker can read those values through JavaScript running in a suitable context, they can potentially capture the credentials without the victim manually typing them.

## Result

Successfully solved the lab using an alternative approach that does not require Burp Collaborator.

Instead of exfiltrating credentials to an external server, the exploit takes advantage of browser password autofill and uses the application's comment functionality to retrieve the captured username and password. The credentials were then used to access the victim's account.