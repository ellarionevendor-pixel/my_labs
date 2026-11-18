# Lab 6: SSRF with Whitelist-Based Input Filter

## Objective

The goal of this lab was to bypass a whitelist-based anti-SSRF filter and access the internal admin interface at `http://localhost/admin` to delete the user `carlos`.

## Analysis

1. **Understanding the whitelist restriction**

   The stock check functionality accepts a URL through the `stockApi` parameter, but the application uses a whitelist to restrict which hostnames can be accessed.

   Directly providing `http://localhost/admin` is blocked because `localhost` is not an approved hostname.

2. **Inspecting URL parsing behavior**

   I used the trusted hostname `stock.weliketoshop.net` in the payload and combined it with URL user information syntax and double URL encoding.

   The important characters are:

   - `@`: separates the user information from the hostname.
   - `%2523`: double-encoded `#` character.

3. **Bypassing the whitelist**

   Used the following URL:

   ```text
   http://localhost:80%2523@stock.weliketoshop.net/admin/delete?username=carlos
   ```

   The double-encoded hash is intended to create a difference between the application's whitelist validation and the URL parsing performed later.

   This allows the payload to pass the hostname validation while manipulating the final destination toward the internal localhost service.

4. **Reaching the admin interface**

   The payload targets the internal deletion endpoint:

   ```text
   /admin/delete?username=carlos
   ```

   By supplying this URL through the stock check functionality, the application makes the request from its own environment.

## Exploitation

The payload used for the attack was:

```text
http://localhost:80%2523@stock.weliketoshop.net/admin/delete?username=carlos
```

I supplied this URL as the stock check destination.

The attack relies on inconsistent URL decoding and parsing between the whitelist validation and the component that performs the actual request.

## Result

Successfully solved the lab by bypassing the whitelist-based SSRF protection and reaching the internal admin deletion endpoint.

The root cause was insufficient URL validation. The application trusted a hostname check without ensuring that the final destination after decoding and URL parsing was still the approved host.