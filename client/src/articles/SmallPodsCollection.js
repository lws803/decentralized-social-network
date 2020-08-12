import React from "react";

import styled from "styled-components";
import { GridLayout } from "@egjs/react-infinitegrid";

import SmallPod from "./SmallPod";

class SmallPodsCollection extends React.Component {
  constructor(props) {
    super(props);
    this.gunSession = props.gunSession;
  }

  render() {
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
            onClick={() => console.log("test")}
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
  }
}

export default SmallPodsCollection;
