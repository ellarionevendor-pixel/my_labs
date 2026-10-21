Lab: CSRF with broken Referer validation
PRACTITIONER

LAB
Solved
This lab's email change functionality is vulnerable to CSRF. It attempts to detect and block cross domain requests, but the detection mechanism can be bypassed.

To solve the lab, use your exploit server to host an HTML page that uses a CSRF attack to change the viewer's email address.

You can log in to your own account using the following credentials: wiener:peter


Found that referrer checking function is only looking for <LAB-DOMAIN> and I can add smth like 'some-weirdo-domain/?<LAB-DOMAIN>' or just a '/?<LAB-DOMAIN>'and it'll accept that