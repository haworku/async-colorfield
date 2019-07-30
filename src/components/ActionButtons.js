import React, { Component } from 'react';

const style = {
  button: {
    border: 'none',
    fontSize: '1rem',
    padding: '.4rem .1rem',
    margin: '.5rem',
  },
};

const ActionButtons = props => {
  const { loadIsCompleted, resetAction, showStart, startAction } = props;
  return (
    <div id="ActionButtons">
      {showStart && (
        <button
          id="ColorStartButton"
          type="button"
          style={style.button}
          onClick={startAction}
        >
          <span> start the colors </span>
        </button>
      )}
      {!showStart && (
        <button
          id="ColorResetButton"
          type="button"
          style={style.button}
          onClick={resetAction}
        >
          <span> reset colors </span>
        </button>
      )}
      {!showStart && !loadIsCompleted && <span> loading in progress ..</span>}
      {!showStart && loadIsCompleted && <span> COMPLETED!!! </span>}
    </div>
  );
};

export default ActionButtons;
