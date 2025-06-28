import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.py4e.com/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);

  return response.json();
};

const usePeopleService = () => {
  const peopleQuery = useInfiniteQuery({
    queryKey: ["sw-people"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => lastPage.next,
  });

  return {
    data: peopleQuery.data || { pages: [] },
    error: peopleQuery.error,
    fetchNextPage: peopleQuery.fetchNextPage,
    hasNextPage: peopleQuery.hasNextPage,
    isError: peopleQuery.isError,
    isFetchingNextPage: peopleQuery.isFetchingNextPage,
    isLoading: peopleQuery.isLoading,
  };
};

export default usePeopleService;
