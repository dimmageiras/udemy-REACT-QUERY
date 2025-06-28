import { memo } from "react";
import { InView } from "react-intersection-observer";

const Species = ({
  average_lifespan: averageLifespan,
  fetchMoreSpecies,
  language,
  name,
  shouldFetch,
}) => {
  return (
    <InView
      as="li"
      {...(shouldFetch && {
        onChange: (inView) => {
          if (inView) {
            fetchMoreSpecies();
          }
        },
      })}
    >
      {name}
      <ul>
        <li>language: {language}</li>
        <li>average lifespan: {averageLifespan}</li>
      </ul>
    </InView>
  );
};

export default memo(Species);
