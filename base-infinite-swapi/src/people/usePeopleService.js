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

  Reflect.set(peopleQuery, "data", peopleQuery.data || { pages: [] });

  return peopleQuery;
};

export default usePeopleService;
