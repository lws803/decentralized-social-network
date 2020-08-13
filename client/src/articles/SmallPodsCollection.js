import React from "react";

import { DateTree } from "gun-util";
import Masonry from "react-masonry-component";

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
    for await (let [ref, date] of tree.iterate({ order: -1 })) {
      let uuid = await ref.then();
      try {
        this.gunSession
          .get(pubKey)
          .get("posts")
          .get(uuid)
          .once(node => {
            if (node && !node.err) {
              let ref = node["_"]["#"];
              let post = (
                <SmallPod
                  key={date}
                  coverPhoto={node.coverPhoto}
                  title={node.title}
                  size={{ width: 200 }}
                  onClick={() => history.push(`/article/${ref}`)}
                />
              );
              this.setState({ items: [...this.state.items, post] });
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
  }

  render() {
    // TODO: Implement proper pagination in the future using the onAppend method
    const masonryOptions = {
      transitionDuration: 0,
      fitWidth: true,
    };
    return (
      <Masonry
        options={masonryOptions}
        disableImagesLoaded={false}
        updateOnEachImageLoad={false}
      >
        {this.state.items}
      </Masonry>
    );
  }
}

export default SmallPodsCollection;
