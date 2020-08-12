import React from "react";

import styled from "styled-components";
import { DateTree } from "gun-util";
import { GridLayout } from "@egjs/react-infinitegrid";

import SmallPod from "./SmallPod";

class SmallPodsCollection extends React.Component {
  constructor(props) {
    super(props);
    this.gunSession = props.gunSession;
    this.state = {
      items: this.loadItems(0, 0),
      posts: [],
    };
  }

  componentDidMount() {
    this.getContent(this.props.pubKey).then();
  }

  async getContent(user) {
    let tree = new DateTree(
      this.gunSession.get(user).get("date_tree"),
      "second"
    );
    (async () => {
      for await (let [ref, date] of tree.iterate({ order: -1 })) {
        let uuid = await ref.then();
        this.setState({ posts: [...this.state.posts, uuid] });
      }
    })();
  }

  loadItems = (groupKey, start) => {
    const items = [];
    const maxItems = 20;

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
