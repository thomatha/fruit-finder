import useSWR from 'swr';

export function useUserTrees(id: string) {
  const fetcher = (url) => fetch(url).then((r) => r.json());

  const { data, error } = useSWR(`/api/fruit_locations?user_id=${id}`, fetcher);
  if (data) {
    data.map((tree) => {
      const formattedDate = new Date(tree.created);
      tree.created = formattedDate.toLocaleString();
    });
  }

  return {
    user: data,
    isError: error,
  };
}
