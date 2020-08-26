import React from "react";
import renderer from "react-test-renderer";

import Main from "../Main";

it("renders correctly", () => {
  const mainPage = renderer.create(<Main />).toJSON();
  expect(mainPage).toMatchSnapshot();
  // FIXME: Fix issue
});
