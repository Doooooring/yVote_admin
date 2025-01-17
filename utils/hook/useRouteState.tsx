import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useRouteState = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const setRouteStart = () => setLoading(true);
  const setRouteEnd = () => setLoading(false);

  useEffect(() => {
    router.events.on('routeChangeStart', setRouteStart);
    router.events.on('routeChangeComplete', setRouteEnd);
    router.events.on('routeChangeError', setRouteEnd);

    // Clean up event listeners
    return () => {
      router.events.off('routeChangeStart', setRouteStart);
      router.events.off('routeChangeComplete', setRouteEnd);
      router.events.off('routeChangeError', setRouteEnd);
    };
  }, []);

  return loading;
};
