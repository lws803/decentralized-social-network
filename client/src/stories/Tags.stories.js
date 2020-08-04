import React, { useState } from "react";

import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

export default {
  title: "Tags",
  component: ReactTagInput,
};

export const Default = () => {
  const [tags, setTags] = useState([]);
  return (
    <ReactTagInput
      tags={tags}
      onChange={newTags => setTags(newTags)}
      removeOnBackspace
      maxTags={10}
    />
  );
};

export const ReadOnly = () => {
  return <ReactTagInput tags={["helloworld", "covid"]} readOnly />;
};
