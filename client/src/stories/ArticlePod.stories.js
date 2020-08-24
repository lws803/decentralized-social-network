import React, { useState } from "react";

import { GridLayout } from "@egjs/react-infinitegrid";
import { action } from "@storybook/addon-actions";
import Masonry from "react-masonry-component";

import SanFran from "../res/sanfrancisco.jpg";
import SmallPod from "../components/articles/SmallPod";

export default {
  title: "Article Pod",
  component: SmallPod,
};

export const Default = () => {
  return (
    <SmallPod
      onClick={action("clicked")}
      coverPhoto={SanFran}
      title="Hello wonderful world, the quick recap, lorem ipsum some long title"
      size={{ width: 200 }}
    />
  );
};

export const StaggeredGrid = () => {
  const masonryOptions = {
    transitionDuration: 0,
    fitWidth: true,
  };
  const titles = ["hello world", "the quick brown fox jumped over the rainbow"];

  const items = [];
  for (let i = 0; i < 10; i++) {
    items.push(
      <SmallPod
        coverPhoto={SanFran}
        title={titles[Math.floor(Math.random() * 2)]}
        size={{ width: 200 }}
        onClick={action("clicked")}
      />
    );
  }
  return (
    <Masonry
      options={masonryOptions}
      disableImagesLoaded={false}
      updateOnEachImageLoad={false}
    >
      {items}
    </Masonry>
  );
};

export const StaggeredGridOptimized = () => {
  const loadItems = (groupKey, start) => {
    const items = [];
    const titles = [
      "hello world",
      "the quick brown fox jumped over the rainbow",
    ];

    for (let i = 0; i < 20; ++i) {
      items.push(
        <SmallPod
          groupKey={groupKey}
          key={start + i}
          coverPhoto={SanFran}
          title={titles[Math.floor(Math.random() * 2)]}
          size={{ width: 200 }}
          onClick={action("clicked")}
        />
      );
    }
    return items;
  };

  const [ourList, setList] = useState(loadItems(0, 0));
  const onAppend = ({ groupKey, startLoading }) => {
    const list = ourList;
    const start = list.length;
    const items = loadItems(groupKey + 1, start);

    startLoading();
    setList(list.concat(items));
  };
  const onLayoutComplete = ({ isLayout, endLoading }) => {
    !isLayout && endLoading();
  };
  return (
    <GridLayout
      useFirstRender={false}
      onAppend={onAppend}
      onLayoutComplete={onLayoutComplete}
      options={{
        threshold: 100,
        isOverflowScroll: false,
        isEqualSize: false,
        isConstantSize: false,
        useFit: false,
        useRecycle: false,
        horizontal: false,
      }}
      layoutOptions={{
        align: "justify",
        margin: 10,
      }}
    >
      {ourList}
    </GridLayout>
  );
};
