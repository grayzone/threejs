import React from "react";
import { Row, Col } from "antd";

import First from "./first";
import Second from "./second";
import Third from "./third";

export default class Template extends React.Component {
  render() {
    let width = 128;
    let height = 128;
    return (
      <Row>
        <Col>
          <First width={width} height={height} />
        </Col>
        <Col>
          <Second width={width} height={height} />
        </Col>
        <Col>
          <Third width={512} height={512} />
        </Col>
      </Row>
    );
  }
}
