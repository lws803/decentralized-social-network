import React from "react";

import styled from "styled-components";
import { DateTree } from "gun-util";
import { GridLayout } from "@egjs/react-infinitegrid";

import SmallPod from "./SmallPod";

class SmallPodsCollection extends React.Component {
  maxItems = 20;
  constructor(props) {
    super(props);
    this.gunSession = props.gunSession;
    this.state = {
      items: [],
      start: 1,
    };
  }

  componentDidMount() {
    this.getContent(this.props.pubKey, 0, 0).then();
  }

  async getContent(pubKey, start, groupKey) {
    let tree = new DateTree(
      this.gunSession.get(pubKey).get("date_tree"),
      "second"
    );
    var i = 0;
    for await (let [ref, date] of tree.iterate({ order: -1 })) {
      if (i >= start && i < start + this.maxItems) {
        let refPath = await ref.then();
        let post = (
          <SmallPod
            groupKey={groupKey}
            key={start + i}
            coverPhoto={undefined}
            title={refPath}
            size={{ width: 200 }}
            onClick={() => console.log("test")}
          />
        );
        this.setState({ items: [...this.state.items, post] });
      }
      i += 1;
    }
  }

  render() {
    const onAppend = ({ groupKey, startLoading }) => {
      startLoading();
      // this.getContent(this.props.pubKey, 0, groupKey);
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
