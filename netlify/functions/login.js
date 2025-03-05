exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
      return { 
          statusCode: 405, 
          body: JSON.stringify({ message: 'Method Not Allowed' }) 
      };
  }

  const { password } = JSON.parse(event.body);
  
  // Replace with your secure password
  const SITE_PASSWORD = 'your-secure-password';

  if (password === SITE_PASSWORD) {
      return {
          statusCode: 200,
          body: JSON.stringify({ 
              success: true,
              message: 'Login successful' 
          })
      };
  } else {
      return {
          statusCode: 401,
          body: JSON.stringify({ 
              success: false,
              message: 'Invalid credentials' 
          })
      };
  }
};