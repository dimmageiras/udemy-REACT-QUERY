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

  Reflect.set(speciesQuery, "data", speciesQuery.data || { pages: [] });

  return speciesQuery;
};

export default useSpeciesService;
