import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {createSerializer} from 'enzyme-to-json';

import SmallPod from "../SmallPod";
import SanFran from "../../../res/sanfrancisco.jpg";

describe("Small Pod component", () => {
  Enzyme.configure({ adapter: new Adapter() });
  expect.addSnapshotSerializer(createSerializer({mode: 'deep'}));

  it("renders correctly", () => {
    const wrapper = shallow(
      <SmallPod size={{ width: 200 }} title="Some random title" />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("renders images correctly", () => {
    const wrapper = shallow(
      <SmallPod
        size={{ width: 200 }}
        title="Some random title"
        coverPhoto={SanFran}
      />
    );
    expect(wrapper.find({"src": "sanfrancisco.jpg"}).length).toEqual(1);
  });

  it("handles clicks correctly", () => {
    const mockCallBack = jest.fn();
    const wrapper = shallow(
      <SmallPod
        size={{ width: 200 }}
        title="Some random title"
        onClick={mockCallBack}
      />
    );
    wrapper.simulate("click");

    expect(mockCallBack.mock.calls.length).toEqual(1);
  });
});
