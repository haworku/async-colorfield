import React, { Component } from 'react';

const style = {
  button: {
    border: 'none',
    fontSize: '1rem',
    padding: '.4rem .1rem',
    margin: '.5rem',
  },
};

class ColorStart extends Component {
  render() {
    return (
      <div id="ColorStart">
        <button
          id="ColorStartButton"
          type="button"
          style={style.button}
          onClick={this.props.startAction}
        >
          <span> start the colors </span>
        </button>
      </div>
    );
  }
}

export default ColorStart;
