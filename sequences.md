# Sequences


## Auth

### Actors

- Alice is a user.

- Server or knowledge base (KB).

- Middleware is Vercel Edge Middleware.

- Auth0 has a database.


### Scenario: Normal

- Alice (not signed in) requests KB.

- Middleware returns login page.

- Alice visits Auth0.

- Alice logs in with Google.

- Alice requests KB.

- Server returns KB page.

[After 2 hours]

- Alice (automatic) uses their refresh token.

- Alice requests KB.

- Server returns KB page.

---

### Scenario: Blocking a user

[After 2 hours]

- Admin blocks Alice.

- Alice tries to refresh their token.

- Auth0 checks that the user has required roles and is not blocked.

- Auth0 refuses to refresh the page.

- Alice cannot view the page.

---

END.
