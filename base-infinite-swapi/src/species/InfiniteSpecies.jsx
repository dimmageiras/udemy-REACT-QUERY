import { useMemo } from "react";
import Species from "./Species";
import useSpeciesService from "./useSpeciesService";

const InfiniteSpecies = () => {
  const {
    data: { pages },
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetching,
    isLoading,
  } = useSpeciesService();

  const speciesData = useMemo(() => {
    return pages.flatMap((page) => page.results);
  }, [pages]);

  const speciesElements = useMemo(() => {
    return speciesData.map((species, speciesIndex) => {
      const isLastSpecies = speciesIndex === speciesData.length - 1;

      return (
        <Species
          fetchMoreSpecies={fetchNextPage}
          key={species.url}
          shouldFetch={isLastSpecies && hasNextPage}
          {...species}
        />
      );
    });
  }, [fetchNextPage, hasNextPage, speciesData]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (isError) {
    return <div>Error! {error.toString()}</div>;
  }

  return (
    <div>
      {isFetching ? <div className="loading">Loading...</div> : null}
      <div>
        <ul>{speciesElements}</ul>
      </div>
    </div>
  );
};

export default InfiniteSpecies;
