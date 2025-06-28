import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.py4e.com/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);

  return response.json();
};

const useSpeciesService = () => {
  const speciesQuery = useInfiniteQuery({
    queryKey: ["sw-species"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => lastPage.next,
  });

  return {
    data: speciesQuery.data || { pages: [] },
    error: speciesQuery.error,
    fetchNextPage: speciesQuery.fetchNextPage,
    hasNextPage: speciesQuery.hasNextPage,
    isError: speciesQuery.isError,
    isFetchingNextPage: speciesQuery.isFetchingNextPage,
    isLoading: speciesQuery.isLoading,
  };
};

export default useSpeciesService;
