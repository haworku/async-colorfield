import React, { Component } from 'react';
import { pack as D3Pack, hierarchy as D3Hierarchy } from 'd3-hierarchy';
import { scaleOrdinal as D3ScaleOrdinal } from 'd3-scale';
import { select as D3Select } from 'd3-selection';
import {
  COLORBUBBLE_STATUS,
  COLORBUBBLE_COLORS,
  COLORBUBBLE_COLOR_DEFAULT,
} from '../helpers';

const style = {
  container: {
    backgroundColor: '#fff',
    border: '1px solid black',
    borderRadius: ' 8px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
};

class ColorField extends Component {
  componentDidMount() {
    const { colorField } = this.props;
    const colorFieldKeys = Object.keys(colorField);
    const color = D3ScaleOrdinal()
      .domain(colorFieldKeys)
      .range(Object.values(COLORBUBBLE_COLORS));

    const width = 700;
    const height = 700;

    let nodes = [];

    const colorBubbles = colorFieldKeys.map(key => {
      return {
        ...colorField[key],
        radius: Math.random() * 12 + 4,
      };
    });

    const root = { children: colorBubbles }; //
    nodes = D3Hierarchy(root).sum(() => Math.random());

    const pack = D3Pack()
      .size([width - 20, height - 20])
      .padding(5);
    const packedNodes = pack(nodes);

    const svg = D3Select('#ColorField')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const leaf = svg
      .selectAll('g')
      .data(packedNodes.leaves())
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x + 1},${d.y + 1})`);

    leaf
      .append('circle')
      .attr('r', d => d.r)
      .attr('name', d => d.data.name)
      .style('stroke-width', 3)
      .style('fill', d => this.getFill(d.data.status, color(d.data.name)))
      .style('stroke', d => this.getStroke(d.data.status, color(d.data.name)));
  }

  componentDidUpdate() {
    const { colorField } = this.props;
    const colorFieldKeys = Object.keys(colorField);
    const d3VizCircles = D3Select('#ColorField').selectAll('circle');
    const d3VizData = d3VizCircles.data();
    const newData = d3VizData;

    // refactor into shared function
    const color = D3ScaleOrdinal()
      .domain(colorFieldKeys)
      .range(Object.values(COLORBUBBLE_COLORS));

    colorFieldKeys.forEach(key => {
      if (d3VizData[key].data !== colorField[key]) {
        newData[key].data = {
          ...d3VizData[key].data,
          ...colorField[key],
        };

        d3VizCircles
          .data(newData)
          .style('fill', d => this.getFill(d.data.status, color(d.data.name)))
          .style('stroke', d => this.getStroke(d.data.status, color(d.data.name)));

        if (this.props.loadIsCompleted) {
          console.log('IN THIS');
          d3VizCircles
            .append('title')
            .text(d => `Load Cycles: ${d.data.loadCycles}`);
        }
      }
    });
  }

  getFill = (status, color) => {
    switch (status) {
      case COLORBUBBLE_STATUS.ACTIVE:
      case COLORBUBBLE_STATUS.COMPLETE:
        return color;
      default:
        return COLORBUBBLE_COLOR_DEFAULT;
    }
  };

  getStroke = (status, color) => {
    switch (status) {
      case COLORBUBBLE_STATUS.ACTIVE:
        return color;
      default:
        return COLORBUBBLE_COLOR_DEFAULT;
    }
  };

  render() {
    return <div id="ColorField" style={style.container} />;
  }
}

export default ColorField;
