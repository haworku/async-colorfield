import React, { Component } from 'react';

const style = {
  button: {
    backgroundColor: '#873f92',
    fontSize: '1rem',
    fontWeight: 'bold',
    padding: '1rem',
  },
  span: {
    color: '#2cbdda',
    fontSize: '2rem',
    fontWeight: 'bold',
    padding: '1rem',
  },
};

class ColorStart extends Component {
  render() {
    return (
      <div>
        <button type="button" style={style.button} onClick={this.props.startAction}>
          <span> start the colors </span>
        </button>
      </div>
    );
  }
}

export default ColorStart;
