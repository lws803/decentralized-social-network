import React from "react";
import renderer from "react-test-renderer";

import SmallPod from "../SmallPod";

it("renders correctly", () => {
  const smallPodContainer = renderer
    .create(<SmallPod size={{ width: 200 }} title="Some random title" />)
    .toJSON();
  expect(smallPodContainer).toMatchSnapshot();
});
