const redirectToAuth = (event) => {
  const authHeader = event.headers.authorization;
  
  if (!authHeader) {
    return {
      statusCode: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
        'Content-Type': 'text/plain'
      },
      body: 'Authentication required'
    };
  }

  const [username, password] = Buffer.from(
    authHeader.split(' ')[1], 
    'base64'
  ).toString().split(':');

  // Replace with your actual credentials
  const validUsername = 'trybe';
  const validPassword = 'lopoko';

  if (
    username !== validUsername || 
    password !== validPassword
  ) {
    return {
      statusCode: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
        'Content-Type': 'text/plain'
      },
      body: 'Invalid credentials'
    };
  }

  // If authentication succeeds, allow access
  return {
    statusCode: 200,
    body: 'Authentication successful'
  };
};

exports.handler = async (event) => {
  // Only apply authentication for GET requests
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  return redirectToAuth(event);
};