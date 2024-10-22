import { useEffect, useState } from 'react';
import axios from 'axios';

const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Fetch the CSRF token from the server
    axios.get('/user/csrf-token', { withCredentials: true }).then((response) => {
      setCsrfToken(response.data.csrfToken);
      console.log('CSRF', response.data.csrfToken);
    });
  }, []);

  return csrfToken;
};

export default useCsrfToken;