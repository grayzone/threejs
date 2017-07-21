import React from "react";
import { Tabs } from "antd";

import First from "./first";
import Second from "./second";
import Third from "./third";


export default class App extends React.Component {
  render() {
    let width = 512;
    let height = 512;
    const TabPane = Tabs.TabPane;
    return (
      <Tabs tabPosition="left" defaultActiveKey="4">
        <TabPane tab="1" key="1">
          <First width={width} height={height} />
        </TabPane>
        <TabPane tab="2" key="2">
          <Second width={width} height={height} />
        </TabPane>
        <TabPane tab="3" key="3">
          <Third width={width} height={width} />
        </TabPane>
      </Tabs>
    );
  }
}
