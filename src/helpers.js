const COLORBUBBLE_COLORS = {
  goldenrod: '#cc9900',
  melon: '#ff9b71',
  deepcoral: '#c4635a',
  eggplant: '#553e4e',
  cranberry: '#6b2737',
  grape: '#a379c9',
  lake: '#63b4d1',
  grass: '#a1c181',
  cucumber: '#619b8a',
  sage: '#a2a77f',
  nightfall: '#035e7b',
  evergreen: '#002e2c',
};

const COLORBUBBLE_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  COMPLETE: 2,
};

const COLORBUBBLE_COLOR_DEFAULT = '#bcbcbc';

// Imagine this function is defined by a third party and must be lifted into a Promise in App.js
const colorblockLoad = () => {
  const delay = 2000 + Math.random() * 2000;
  const updateColor = Math.random() > 0.5; // true or false
  return function delayedLoad(callback) {
    // eslint-disable-next-line func-names
    setTimeout(function() {
      callback(updateColor);
    }, delay);
  };
};

const getColorField = () => {
  return Object.keys(COLORBUBBLE_COLORS).reduce((acc, colorName, index) => {
    acc[index] = {
      loadCycles: 0,
      name: colorName,
      run: colorblockLoad,
      status: COLORBUBBLE_STATUS.INACTIVE,
    };
    return acc;
  }, {});
};

export {
  COLORBUBBLE_COLORS,
  COLORBUBBLE_COLOR_DEFAULT,
  COLORBUBBLE_STATUS,
  getColorField,
};
