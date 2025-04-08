import { useSuspenseQuery } from '@tanstack/react-query';

export function useCookieInfo() {
  const { data } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts');
      return res.json();
    },
  });
}
