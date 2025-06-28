import { useMemo } from "react";
import Person from "./Person";
import usePeopleService from "./usePeopleService";

const InfinitePeople = () => {
  const {
    data: { pages },
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetching,
    isLoading,
  } = usePeopleService();

  const peopleData = useMemo(() => {
    return pages.flatMap((page) => page.results);
  }, [pages]);

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
        <ul>
          {peopleData.map((person, personIndex) => {
            const isLastPerson = personIndex === peopleData.length - 1;

            return (
              <Person
                fetchMorePeople={fetchNextPage}
                shouldFetch={isLastPerson && hasNextPage}
                key={person.url}
                {...person}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default InfinitePeople;
