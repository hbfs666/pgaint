import { useState, useEffect } from 'react';

const useWakeLock = (enabled) => {
  const [wakeLock, setWakeLock] = useState(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if (enabled && 'wakeLock' in navigator) {
          const wakeLock = await navigator.wakeLock.request('screen');
          setWakeLock(wakeLock);
          //Uncomment if you want to log when the wake lock is released
          wakeLock.addEventListener('release', () => {
            console.log('Wake Lock was released');
          });
          
        }
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    };

    if (enabled) {
      requestWakeLock();
    } else if (wakeLock) {
      wakeLock.release().then(() => {
        setWakeLock(null);
        // Uncomment if you want to log when the wake lock is released
        // console.log('Wake Lock was released');
      });
    }

    return () => {
      if (wakeLock) {
        wakeLock.release().then(() => {
          setWakeLock(null);
        });
      }
    };
  }, [enabled]);

  return wakeLock;
};

export default useWakeLock;
