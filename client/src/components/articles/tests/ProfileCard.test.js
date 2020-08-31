import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
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
        dateCreated={moment("1995-12-25")}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("profile clicks", () => {
    const mockCallBack = jest.fn();
    const wrapper = mount(
      <Card
        authorName="lws803"
        authorPhoto={ProfilePhoto}
        dateCreated={moment()}
        onProfileClick={mockCallBack}
      />
    );
    wrapper.find("#author_name").children().at(0).simulate("click");
    expect(mockCallBack.mock.calls.length).toEqual(1);
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

  it("profile clicks", () => {
    const mockCallBack = jest.fn();
    const wrapper = mount(
      <LargeCard
        authorName="lws803"
        authorPhoto={ProfilePhoto}
        bio="The quick brown fox"
        onProfileClick={mockCallBack}
      />
    );
    wrapper.find("#author_name").at(0).simulate("click");
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });
});
