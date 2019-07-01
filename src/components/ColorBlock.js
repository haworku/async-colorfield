import React, { Component } from 'react';
import {
  COLORBLOCK_STATUS,
  COLORBLOCK_COLORS,
  COLORBLOCK_COLOR_DEFAULT,
} from '../helpers';

const style = {
  container: {
    flex: '0 1 auto',
    padding: '1rem',
    margin: '.5rem',
  },
};

class ColorBlock extends Component {
  getColor = () => {
    const { colorName, status } = this.props;
    switch (status) {
      case COLORBLOCK_STATUS.INACTIVE:
        return COLORBLOCK_COLOR_DEFAULT;
      case COLORBLOCK_STATUS.ACTIVE:
      case COLORBLOCK_STATUS.COMPLETE:
        return COLORBLOCK_COLORS[colorName];
      default:
        return COLORBLOCK_COLOR_DEFAULT;
    }
  };

  render() {
    const { colorName, status } = this.props;

    return (
      <div style={{ ...style.container, backgroundColor: this.getColor() }}>
        <h3> {colorName} </h3>
        <span> {`Status: ${status}`} </span>
      </div>
    );
  }
}

export default ColorBlock;
