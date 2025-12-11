import { useEffect, useState } from 'react';

export default function useCurrentUrl() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return url;
}
