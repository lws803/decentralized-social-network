import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { createSerializer } from "enzyme-to-json";

import CustomCKEditor from "../CustomCKEditor";

Enzyme.configure({ adapter: new Adapter() });
expect.addSnapshotSerializer(createSerializer({ mode: "deep" }));

describe("Custom CK Editor component", () => {
  it("renders correctly", () => {
    const wrapper = shallow(<CustomCKEditor />);
    expect(wrapper).toMatchSnapshot();
  });

  it("accepts inputs correctly", () => {
    const onDataChange = jest.fn();
    const wrapper = shallow(<CustomCKEditor onChange={onDataChange} data="" />);
    const event = {
      preventDefault() {},
      target: { value: "value" },
    };
    wrapper.find("a").simulate("change", event);
    expect(onDataChange.mock.calls.length).toEqual(1);
  });
});
