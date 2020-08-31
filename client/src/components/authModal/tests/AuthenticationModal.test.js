import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { createSerializer } from "enzyme-to-json";

import AuthenticationModal from "../AuthenticationModal";

Enzyme.configure({ adapter: new Adapter() });
expect.addSnapshotSerializer(createSerializer({ mode: "deep" }));

describe("Authentication Modal component", () => {
  const mockUsername = "lws803";
  const mockPassword = "helloworld1234";
  it("renders correctly", () => {
    const user = {
      is: undefined,
      create: () => {},
      auth: () => {},
    };
    const wrapper = shallow(<AuthenticationModal user={user} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("stores information correctly", () => {
    const user = {
      is: undefined,
    };
    const wrapper = mount(<AuthenticationModal user={user} />);
    wrapper
      .find("#username_field")
      .simulate("change", { target: { value: mockUsername } });
    wrapper
      .find("#password_field")
      .simulate("change", { target: { value: mockPassword } });
    expect(wrapper.state("name")).toEqual(mockUsername);
    expect(wrapper.state("password")).toEqual(mockPassword);
  });

  it("authenticates correctly", () => {
    const mockUserAuthCallBack = jest.fn();

    const user = {
      is: undefined,
      auth: mockUserAuthCallBack,
    };
    const wrapper = mount(<AuthenticationModal user={user} />);
    wrapper
      .find("#username_field")
      .simulate("change", { target: { value: mockUsername } });
    wrapper
      .find("#password_field")
      .simulate("change", { target: { value: mockPassword } });

    wrapper.find("#authenticate_user_btn").at(0).simulate("click");
    expect(mockUserAuthCallBack.mock.calls.length).toEqual(1);
  });

  it("creates new users correctly", () => {
    const mockUserCreateCallBack = jest.fn();

    const user = {
      is: undefined,
      create: mockUserCreateCallBack,
    };
    const wrapper = mount(<AuthenticationModal user={user} />);
    wrapper
      .find("#username_field")
      .simulate("change", { target: { value: mockUsername } });
    wrapper
      .find("#password_field")
      .simulate("change", { target: { value: mockPassword } });

    wrapper.find("#create_new_user_btn").at(0).simulate("click");
    expect(mockUserCreateCallBack.mock.calls.length).toEqual(1);
  });
});
