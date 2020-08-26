import React from "react";

import CustomCKEditor from "../components/common/CustomCKEditor";

export default {
  title: "RichText Editor",
  component: CustomCKEditor,
};

export const Default = () => {
  return (
    <CustomCKEditor
      data="
      <p>Hello penyet, have some maggiemee</p>
      <img src='http://ipfs.io/ipfs/QmadQpErLiKb2b7ZYYwMq6JB3fcjHdTzW54gRiSCev6mG3'/>"
    />
  );
};
