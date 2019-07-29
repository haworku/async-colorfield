import React, { Component } from 'react';

const style = {
  button: {
    border: 'none',
    fontSize: '1rem',
    padding: '.4rem .1rem',
    margin: '.5rem',
  },
};

class ActionButtons extends Component {
  render() {
    const { showStart } = this.props;
    return (
      <div id="ActionButtons">
        {showStart && (
          <button
            id="ColorStartButton"
            type="button"
            style={style.button}
            onClick={this.props.startAction}
          >
            <span> start the colors </span>
          </button>
        )}
        {!showStart && (
          <button
            id="ColorResetButton"
            type="button"
            style={style.button}
            onClick={this.props.resetAction}
          >
            <span> reset colors </span>
          </button>
        )}
      </div>
    );
  }
}

export default ActionButtons;
