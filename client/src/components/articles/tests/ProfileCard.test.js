import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { createSerializer } from "enzyme-to-json";
import moment from "moment";

import { Card, LargeCard } from "../ProfileCard";
import ProfilePhoto from "../../../res/7874219.jpeg";

Enzyme.configure({ adapter: new Adapter() });
expect.addSnapshotSerializer(createSerializer({ mode: "deep" }));

describe("Card component", () => {
  it("renders correctly", () => {
    const wrapper = shallow(
      <Card
        authorName="lws803"
        authorPhoto={ProfilePhoto}
        dateCreated={moment()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});

describe("Large Card component", () => {
  it("renders correctly", () => {
    const wrapper = shallow(
      <LargeCard
        authorName="lws803"
        authorPhoto={ProfilePhoto}
        bio="The quick brown fox"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
