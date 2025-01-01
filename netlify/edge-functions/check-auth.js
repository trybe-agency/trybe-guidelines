import { Buffer } from 'node:buffer';

export const config = { path: '/*' };

const AUTH_COOKIE_NAME = 'auth';

const VALID_CREDENTIALS = { username: 'ANON', password: 'somepassword' };

export default async (request, context) => {
  let isNewlyAuthorized = false;
  // Assume it is a login attempt
  if (request.method === 'POST') {
    /**
     * @type {FormData}
     */
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');
    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
      console.log('Authorizing', username);
      const authToken = Buffer.from(`${username}:${password}`).toString('base64');
      context.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: authToken,
        path: '/' // Ensure the cookie is valid for all paths
      });
      isNewlyAuthorized = true;

      const newLocationValue = request.url;
      return new Response(null, {
        status: 303, // See Other
        headers: { 'Location': newLocationValue }
      });
    }
  }

  // Validate
  let isAlreadyAuthorized;
  const authTokenFromCookie = context.cookies.get(AUTH_COOKIE_NAME);
  if (authTokenFromCookie) {
    const [username, password] = Buffer.from(authTokenFromCookie, 'base64').toString('utf8').split(':');
    isAlreadyAuthorized = username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password;
  } else {
    isAlreadyAuthorized = false;
  }

  const isAuthorized = isNewlyAuthorized || isAlreadyAuthorized;

  if (isAuthorized) {
    // Pass control to the default handler
    return context.next();
  } else {
    // HACK: Return the content of the login page (index.html)
    const loginPageContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Open the Door</title>
  <style>
    *, *::before, *::after {
      position: relative;
    }

    :root {
      /* Type scale: Major Third. See https://typescale.com */
      --text-h1: 3.815rem;
      --text-h2: 3.052rem;
      --text-h3: 2.441rem;
      --text-h4: 1.953rem;
      --text-h5: 1.563rem;
      --text-h6: 1.25rem;
      --text-p: 1rem;

      --color-primary-brown: #8b4513;
      --color-black: #1a1a1a; /* Very Dark Gray */
      --color-beige: #f5e9d7;
      --color-secondary-beige: #faebd7;
    }

    .page {
      background-color: var(--color-beige);
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      font-family: Arial, sans-serif;
    }

    .login {
      background-color: #fff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      text-align: center;
      max-width: 400px;
      width: 100%;
      overflow: hidden;
    }

    .login__door-container {
      width: 200px;
      height: 300px;
      margin: 0 auto 2rem;
      perspective: 1000px;
    }

    .login__door {
      --door-pattern-color: #a0522d33;
      --door-knob-color: #291201;

      width: 100%;
      height: 100%;
      background:
        linear-gradient(45deg, var(--door-pattern-color) 25%, transparent 25%) -50px 0,
        linear-gradient(-45deg, var(--door-pattern-color) 25%, transparent 25%) -50px 0,
        linear-gradient(45deg, transparent 75%, var(--door-pattern-color) 75%),
        linear-gradient(-45deg, transparent 75%, var(--door-pattern-color) 75%);
      background-size: 100px 100px;
      background-color: var(--color-primary-brown);
      border-radius: 100px 100px 0 0;
      transform-style: preserve-3d;
      transform: rotateY(10deg);
      transition: transform 0.5s;
      box-shadow: -2px 8px 10px rgba(0, 0, 0, 0.3);
    }

    .login__door:hover {
      transform: rotateY(30deg);
    }

    .login__doorknob {
      width: 20px;
      height: 20px;
      background-color: var(--door-knob-color);
      border-radius: 50%;
      position: absolute;
      right: 25px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
    }

    .login__title {
      color: var(--color-black);
      font-size: var(--text-h4);
      margin-bottom: 1rem;
    }

    .login__quote {
      display: block;;
      color: #585858;
      font-style: italic;
      font-size: var(--text-h6);
      margin-bottom: 1.5rem;
    }

    .login__form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .login__label {
      color: var(--color-black);
      font-size: var(--text-p);
      font-weight: bold;
      text-align: left;
    }

    .login__input {
      padding: 0.5rem;
      border: 1px solid var(--color-primary-brown);
      border-radius: 4px;
      font-size: var(--text-p);
      background-color: var(--color-secondary-beige);
    }

    .login__button {
      padding: 0.5rem;
      background-color: var(--color-primary-brown);
      transition: background-color 0.3s;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: var(--text-p);
      cursor: pointer;
    }

    .login__button:hover {
      background-color: #a0522d;
    }

    /* Think: Tailwind's "max-sm" */
    @media (max-width: 640px) {
      .page {
        background-color: white;
      }

      .login {
        box-shadow: unset;
      }
    }
  </style>
</head>

<body class="page">
  <div class="login">
    <div class="login__door-container">
      <div class="login__door">
        <div class="login__doorknob"></div>
      </div>
    </div>
    <div>
      <h1 class="login__title">Open the Door</h1>
      <q class="login__quote">A very little key will open a very heavy door.</q>
      <form class="login__form" method="POST">
        <label class="login__label" for="password">The key</label>
        <input class="login__input" type="password" autofocus minlength="3" name="password" placeholder="Enter the password..." />
        <input type="hidden" name="username" value="ANON" />
        <button class="login__button" type="submit">Unlock</button>
      </form>
    </div>
  </div>
</body>
</html>
    `;

    return new Response(loginPageContent, {
      status: 401,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}
