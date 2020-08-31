import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { createSerializer } from "enzyme-to-json";

import LazyImage from "../LazyImage";
import ProfilePhoto from "../../../res/7874219.jpeg";

Enzyme.configure({ adapter: new Adapter() });
expect.addSnapshotSerializer(createSerializer({ mode: "deep" }));

describe("Lazy Image component", () => {
  it("renders correctly", () => {
    const wrapper = shallow(<LazyImage src={ProfilePhoto}/>);
    expect(wrapper).toMatchSnapshot();
  })
})
