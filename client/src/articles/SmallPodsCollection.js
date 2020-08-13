import React from "react";

import { DateTree } from "gun-util";
import { GridLayout } from "@egjs/react-infinitegrid";

import history from "../utils/History";
import SmallPod from "./SmallPod";

class SmallPodsCollection extends React.Component {
  maxItems = 20;
  constructor(props) {
    super(props);
    this.gunSession = props.gunSession;
    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    this.getContent(this.props.pubKey).then();
  }

  async getContent(pubKey) {
    let tree = new DateTree(
      this.gunSession.get(pubKey).get("date_tree"),
      "second"
    );
    var i = 0;
    for await (let [ref, date] of tree.iterate({ order: -1 })) {
      let refPath = await ref.then();
      let node = await this.gunSession.get(refPath).once();
      if (node) {
        let post = (
          <SmallPod
            key={i}
            coverPhoto={node.coverPhoto}
            title={node.title}
            size={{ width: 200 }}
            onClick={() => history.push(`/article/${refPath}`)}
          />
        );
        this.setState({ items: [...this.state.items, post] });
        i += 1;
      }
    }
  }

  render() {
    // TODO: Implement proper pagination in the future using the onAppend method
    const onLayoutComplete = ({ isLayout, endLoading }) => {
      !isLayout && endLoading();
    };
    return (
      <GridLayout
        useFirstRender={false}
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
