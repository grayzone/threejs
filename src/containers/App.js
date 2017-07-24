import React from "react";
import { Tabs } from "antd";

import First from "./first";
import Second from "./second";
import Third from "./third";
import Fourth from "./fourth";
import Fifth from "./fifth";
import Sixth from "./sixth";

export default class App extends React.Component {
  render() {
    let width = 512;
    let height = 512;
    const TabPane = Tabs.TabPane;
    return (
      <Tabs tabPosition="left" defaultActiveKey="6">
        <TabPane tab="1" key="1">
          <First width={width} height={height} />
        </TabPane>
        <TabPane tab="2" key="2">
          <Second width={width} height={height} />
        </TabPane>
        <TabPane tab="3" key="3">
          <Third width={width} height={height} />
        </TabPane>
        <TabPane tab="4" key="4">
          <Fourth width={width} height={height} />
        </TabPane>
        <TabPane tab="5" key="5">
          <Fifth width={width} height={height} />
        </TabPane>
        <TabPane tab="6" key="6">
          <Sixth width={width} height={height} />
        </TabPane>
      </Tabs>
    );
  }
}
