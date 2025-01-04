# Project: Brainiac Hatter

Building an internal documentation website or knowledge base.

Suppose we are building a documentation website for a fictional company: WonderWorks (`wonderworks.example`).

We call its employees _brainiacs_, after their founder _Hatter the Brainiac_.


## Branding

### Naming

Brainiac Hatter.

Hatter conceived the whole thing.

As in, "His geegantic brain conceived the whole thing, and I tell you it's a corker." -- _Alice in Blunderland_

Hatter, hats, meaning different job titles, roles, and/or tasks.

### Quote

Tone: friendly, whimsical, encouraging.

Options:

- Only a few find the way, some don't recognize it when they do - some... don't ever want to. Want to log in?

- A very little key will open a very heavy door. Do login!

- Who in the world am I? Ah, that's the great puzzle. Ready to solve it? Login!

- Why, sometimes I've believed as many as six impossible things before breakfast. How about you? Login!

---

Original quotes:

- "Only a few find the way, some don't recognize it when they do - some... don't ever want to." -- _American McGee's Alice_

- "A very little key will open a very heavy door" -- Charles Dickens, [_Hunted Down_](https://www.gutenberg.org/files/807/807-h/807-h.htm)


## Possible concerns

- Employee leaves the company.

- Vendor lock-in or some features we depend on (i.e. Vercel Edge Middle) getting changed.


## Technicalities

Requirements:
- **Req1**: Markdown-based
- **Req2**: Content is framework-agnostic (viewable on GitHub Pages or VSCode. This mainly means that assets like images are stored alongside pages).
- **Req3** Authentication (GitHub, Google, Discord, or whatever).

Preferences:
- Vue or React.
- It's fine if it uses/requires YAML frontmatter.


## How it works

See [Sequences](./sequences.md).

### Assumptions

- Every member has a Google account (Gmail).

### Source of truth

- Discord is the source of truth when it comes to members and their assigned roles.

- (Notion? Google Sheets?) There is an external source that maps a Discord user ID to the employee's email and name.

- Our Discord users and roles are upserted to Auth0.

- Auth0 allows importing and exporting data (e.g. users with roles and other metadata) programmatically.

- Our Auth0 app contains a predefined list of users and roles.

- Auth0 is configured to:
    * Support sign-in with Google.
    * Issue access tokens with lifetime = 2 hours.
    * Issue (rotating?) refresh tokens with lifetime = 3 months.
    * Before refreshing a token, we can check that the user is not blocked and still has the required roles.

### Middleware

Validate the auth token; otherwise, return the login page.


## Choosing

TLDR:
- GitHub repo as CMS to write content in markdown.
- VitePress to render markdown as a website.
- Vercel to serve the static website.
- Vercel Edge Middleware to restrict access by verifying access tokens.
- Auth0 to provide and revoke access to the website.
    * Login with Google.
    * Access tokens have a short lifetime for access tokens (say, 2 hours).
    * Refresh tokens have a long lifetime (say, 3 months).
    * Users (e.g. employees who leave the company) are blocked via the Auth0 Dashboard.

See tests:
- ~~Markdown test: https://github.com/djalilhebal/brainiac-guide~~
- ~~Protection test: https://github.com/djalilhebal/vercel-jwt-auth~~
- ~~Login test: auth0-vue-samples~~

### Writing


Options:

- ~~GitBook~~
  GitBook is amazing, but the free version does not support the following features:
    * Protecting content
    * Multiple users/viewers

- [x] [**VitePress**](https://vitepress.dev/)
    * https://github.com/vuejs/vitepress
    * Satisfies Req1 and Req2.
    * Vue.

- [x] **mdBook**

- [ ] **Nuxt** Content with a plugin (https://github.com/davestewart/nuxt-content-assets) to support "local" assets.
    * Vue.

- [ ] NextJS/Nextra
    * I tried it before. Not a big fan.
    * React.

- [ ] [**Docusaurus**](https://docusaurus.io)
    * https://github.com/facebook/docusaurus
    * React

- [ ] [**Yari**](https://github.com/mdn/yari)
    * Req1 and Req2, as in `mdn/content` and `mdn/yari`.
      https://github.com/mdn/content/blob/main/files/en-us/web/css/angle/index.md
    * Used by MDN.

### Hosting platform

GitBook, Vercel, and Netlify require a pro plan to enable protection and SSO login.
We can use Vercel Edge Middleware to implement login logic ourselves.

Options:

- [x] **Vercel**
    * See [Edge Middleware Overview](https://vercel.com/docs/functions/edge-middleware)
    * https://vercel.com/templates/next.js/jwt-authentication
    * https://vercel.com/templates/next.js/basic-auth-password

- [ ] **Netlify**

- [ ] Self-hosted (AWS? DigitalOcean?)

### Authentication providers

- [x] **Auth0**
    * Auth0 issues "JWTs as a result of the authentication process."
    * Used by OpenAI.com.

- [ ] **Clerk**

- [ ] **Keycloak** (https://www.keycloak.org/)
    * Used by Mangadex.org.
    * Java.

- [ ] Nuxt Auth https://nuxt-auth-example.sidebase.io/


### Auth0

The following script was tested with Google as an identity provider ("Login with Google").


Login action script:
```js
/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  const DEV_ROLE = 'DEV';
  const hasDevRole = (/** @type {Event} */ e) => e.authorization?.roles.includes(DEV_ROLE);
  const isBrainiac = (/** @type {string} */ x) => x.endsWith('@wonderworks.example');
  const isDreamski = (/** @type {string} */ x) => x === 'dreamski21@gmail.com';

  const email = event.user.email ?? '';
  const isAllowed = isBrainiac(email) || isDreamski(email) || hasDevRole(event);
  if (!isAllowed) {
    api.access.deny(`Access to ${event.client.name} is not allowed.`);
  }
};
```


- [x] https://github.com/auth0-samples/auth0-vue-samples
    * "Auth0 login with Google" works, tested locally. https://github.com/auth0-samples/auth0-vue-samples/tree/master/01-Login


## Bot

Task: Sync from Discord

- Discord is the source of truth.

- Discord get members, get roles.

- Auth0 get users, get roles, set roles, get is banned.

    * About Google as an Identity Provider: Since Auth0 is federated,
     so we don't need to publish our app or register test users to use OAuth and stuff.

- Vercel Redis, Postgres, Config Service: Update blacklist.

- Netlify supports Vercel/Nextjs Middle (`middleware.ts`).


### Middleware

If not Vercel Edge Middleware, we could use of these are the alternatives:

- Same logic, ExpressJS middleware.
    + https://vercel.com/guides/using-express-with-vercel
    + https://docs.netlify.com/frameworks/express/

- Using some proxy:

    * HAProxy
        + https://www.haproxy.com/blog/verify-oauth-jwt-tokens-with-haproxy

    * NGINX
        + https://nginx.org/en/docs/http/ngx_http_auth_jwt_module.html
        + https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-jwt-authentication/

---

END.
