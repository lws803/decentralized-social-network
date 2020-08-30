import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import SmallPod from "../SmallPod";

Enzyme.configure({ adapter: new Adapter() });

describe("Small Pod component", () => {
  it("renders correctly", () => {
    const wrapper = shallow(
      <SmallPod size={{ width: 200 }} title="Some random title" />
    );  
    expect(wrapper).toMatchSnapshot();
  });

  it("handles clicks correctly", () => {
    const mockCallBack = jest.fn();
    const wrapper = shallow(
      <SmallPod size={{ width: 200 }} title="Some random title" onClick={mockCallBack}/>
    );  
    wrapper.simulate("click");

    expect(mockCallBack.mock.calls.length).toEqual(1);
  });
});
