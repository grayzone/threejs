import React from "react";
import { Tabs } from "antd";

import First from "./first";
import Second from "./second";
import Third from "./third";
import Fourth from "./fourth";
import Fifth from "./fifth";
import Sixth from "./sixth";
import Seventh from "./seventh";
import Eighth from "./eighth";
import Ninth from "./ninth";
import Tenth from "./tenth";
import Eleventh from "./eleventh";
import Twelfth from "./twelfth";
import Thirteenth from "./thirteenth";
import Fourteenth from "./fourteenth";

import Fifteenth from "./fifteenth";

export default class App extends React.Component {
  render() {
    let width = 512;
    let height = 512;
    const TabPane = Tabs.TabPane;
    return (
      <Tabs tabPosition="left" defaultActiveKey="15">
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
        <TabPane tab="7" key="7">
          <Seventh width={width} height={height} />
        </TabPane>
        <TabPane tab="8" key="8">
          <Eighth width={width} height={height} />
        </TabPane>
        <TabPane tab="9" key="9">
          <Ninth width={width} height={height} />
        </TabPane>
        <TabPane tab="10" key="10">
          <Tenth width={width} height={height} />
        </TabPane>
        <TabPane tab="11" key="11">
          <Eleventh width={width} height={height} />
        </TabPane>
        <TabPane tab="12" key="12">
          <Twelfth width={width} height={height} />
        </TabPane>
        <TabPane tab="13" key="13">
          <Thirteenth width={width} height={height} />
        </TabPane>
        <TabPane tab="14" key="14">
          <Fourteenth width={width} height={height} />
        </TabPane>
         <TabPane tab="15" key="15">
          <Fifteenth width={width} height={height} />
        </TabPane>
        
      </Tabs>
    );
  }
}
