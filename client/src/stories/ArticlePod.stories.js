import React, { useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { GridLayout } from "@egjs/react-infinitegrid";

import Pod from "../articles/Pod";
import SanFran from "../res/sanfrancisco.jpg";

export default {
  title: "Article Pod",
  component: Pod,
};

// TODO: Look for the first image in the rich text
// and the first chunk of text ot be a description

export const Default = () => (
  <Pod
    coverPhoto={SanFran}
    title="Hello penyet"
    body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
    tempor incididunt ut labore et dolore magna aliqua. Dapibus ultrices in iaculis nunc sed 
    augue lacus. Quam nulla porttitor massa id neque aliquam. Ultrices mi tempus imperdiet 
    nulla malesuada. Eros in cursus turpis massa tincidunt dui ut ornare lectus. 
    Egestas sed sed risus pretium. Lorem dolor sed viverra ipsum. 
    Gravida rutrum quisque non tellus…
    "
    author="lws803"
    time="3 Aug, 2020"
    upVoteCount={10}
    downVoteCount={100000}
  />
);

export const PodListView = () => {
  const PodContainer = styled.div`
    margin-bottom: 40px;
  `;
  const [items, setItems] = useState(Array.from({ length: 20 }));
  const fetchMoreData = () => {
    setTimeout(() => {
      setItems(items.concat(Array.from({ length: 20 })));
    }, 1500);
  };

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
      hasMore={true}
      loader={<h4>Loading...</h4>}
    >
      {items.map((i, index) => (
        <PodContainer>
          <Pod
            coverPhoto={SanFran}
            title="Hello penyet"
            body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
            tempor incididunt ut labore et dolore magna aliqua. 
            Dapibus ultrices in iaculis nunc sed 
            augue lacus. Quam nulla porttitor massa id neque aliquam. Ultrices mi tempus imperdiet 
            nulla malesuada. Eros in cursus turpis massa tincidunt dui ut ornare lectus. 
            Egestas sed sed risus pretium. Lorem dolor sed viverra ipsum. 
            Gravida rutrum quisque non tellus…
            "
            author="lws803"
            time={`${index} Aug, 2020`}
            upVoteCount={index * 1000}
            downVoteCount={index}
          />
        </PodContainer>
      ))}
    </InfiniteScroll>
  );
};

export const StaggeredGrid = () => {
  const Pod = props => (
    <div>
      <img
        src={props.coverPhoto}
        style={{
          objectFit: "cover",
          height: props.size.height,
          width: props.size.width,
        }}
      />
      <div>{props.title}</div>
    </div>
  );

  const loadItems = (groupKey, start) => {
    const items = [];

    for (let i = 0; i < 20; ++i) {
      const randomNumber = Math.floor(Math.random() * 200) + 50;
      items.push(
        <Pod
          groupKey={groupKey}
          key={start + i}
          coverPhoto={SanFran}
          title="Hello World"
          size={{ height: `${randomNumber}px`, width: "300px" }}
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
      loading={<div className="loading">Loading... append</div>}
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
      }}
    >
      {ourList}
    </GridLayout>
  );
};
