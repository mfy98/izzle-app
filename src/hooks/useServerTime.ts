import { useState, useEffect } from 'react';

export const useServerTime = () => {
  const [serverTime, setServerTime] = useState(new Date());

  useEffect(() => {
    // In a real app, we would fetch the initial server time offset here
    // const fetchServerTime = async () => { ... }
    
    const timer = setInterval(() => {
      // Increment time locally
      // In a real app, apply the calculated offset to Date.now()
      setServerTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return serverTime;
};

