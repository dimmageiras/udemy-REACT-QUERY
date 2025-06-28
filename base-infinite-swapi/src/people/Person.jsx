import { memo } from "react";
import { InView } from "react-intersection-observer";

const Person = ({
  eye_color: eyeColor,
  fetchMorePeople,
  hair_color: hairColor,
  name,
  shouldFetch,
}) => {
  return (
    <InView
      as="li"
      {...(shouldFetch && {
        onChange: (inView) => {
          if (inView) {
            fetchMorePeople();
          }
        },
      })}
    >
      {name}
      <ul>
        <li>hair: {hairColor}</li>
        <li>eyes: {eyeColor}</li>
      </ul>
    </InView>
  );
};

export default memo(Person);
