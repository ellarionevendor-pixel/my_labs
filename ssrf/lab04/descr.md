Lab: SSRF with blacklist-based input filter
PRACTITIONER

LAB
Solved
This lab has a stock check feature which fetches data from an internal system.

To solve the lab, change the stock check URL to access the admin interface at http://localhost/admin and delete the user carlos.

The developer has deployed two weak anti-SSRF defenses that you will need to bypass.

- http://127.1/%25%36%31dmin + delete?username=carlos