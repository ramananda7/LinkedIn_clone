import React, { useEffect, useState } from 'react';
import { clientServer } from '@/config'; // your axios instance

export default function TestGetRequest() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    clientServer.get('/test')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(err => {
        setMessage('Error: ' + err.message);
      });
  }, []);

  return <div>{message}</div>;
}
