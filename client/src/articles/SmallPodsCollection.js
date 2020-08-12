import React from "react";

import styled from "styled-components";
import { GridLayout } from "@egjs/react-infinitegrid";

import SmallPod from "./SmallPod";

class SmallPodsCollection extends React.Component {
  constructor(props) {
    super(props);
    this.gunSession = props.gunSession;
    this.state = {
      items: this.loadItems(0, 0),
      byteLimit: 5000,
    };
  }

  componentDidMount() {
    this.getContent(this.props.pubKey, this.props.path);
    // TODO: We need a better way to index
  }

  getContent(user, path) {
    this.gunSession
      .get(user)
      .get(path)
      // .get({ ".": { "*": path }, "%": this.state.byteLimit })
      .map()
      .once(console.log); // TODO: Verify if this gets everything
  }

  loadItems = (groupKey, start) => {
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
          coverPhoto={undefined}
          title={titles[Math.floor(Math.random() * 2)]}
          size={{ width: 200 }}
          onClick={() => console.log("test")}
        />
      );
    }
    return items;
  };

  render() {
    const onAppend = ({ groupKey, startLoading }) => {
      const list = this.state.items;
      const start = list.length;
      const items = this.loadItems(groupKey + 1, start);

      startLoading();
      this.setState({ items: list.concat(items) });
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
        {this.state.items}
      </GridLayout>
    );
  }
}

export default SmallPodsCollection;
