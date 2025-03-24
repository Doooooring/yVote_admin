import { useQuery } from "@node_modules/@tanstack/react-query/build/legacy";

export function useCookieInfo() {

    const a = useQuery

  const { data } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts');
      return res.json();
    },
  });



}
