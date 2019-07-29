import React, { Component } from 'react';
import ColorField from './ColorField';
import ActionButtons from './ActionButtons';
import { getColorField, COLORBUBBLE_STATUS } from '../helpers';

const style = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0 auto',
    height: '100%',
  },
  main: {
    flexDirection: 'column',
    display: 'flex',
    flex: '1 0 100%',
  },
};

class App extends Component {
  state = {
    colorFieldClean: true,
    colorFieldLoadCompleted: false,
    colorField: getColorField(),
  };

  getNewColor = colorField => {
    const newColorIndex = Math.floor(Math.random() * Object.keys(colorField).length);
    return colorField[newColorIndex].name;
  };

  // Update colorField nested state
  updateColorField = (key, colorBubbleKeyValue) => {
    const { colorField } = this.state;
    const colorBubble = colorField[key];

    this.setState({
      colorField: {
        ...colorField,
        [key]: {
          ...colorBubble,
          ...colorBubbleKeyValue,
        },
      },
    });
  };

  returnColorLoadPromise = (colorBubble, colorFieldKey, newColorName) => {
    const self = this;
    return new Promise(resolve => {
      const resolveData = {
        colorFieldKey,
        loadCycles: colorBubble.loadCycles + 1,
        loadAgain: false,
      };

      const updateColorsAfterLoadCallback = shouldUpdateColor => {
        // Once bubble has reloaded 3x it is completed, otherwise use shouldUpdateColor variable to determine wether to chain additional load
        if (resolveData.loadCycles < 5 && shouldUpdateColor) {
          self.updateColorField(colorFieldKey, {
            name: newColorName,
            loadCycles: resolveData.loadCycles,
          });
          resolveData.loadAgain = true;
        } else {
          self.updateColorField(colorFieldKey, {
            status: COLORBUBBLE_STATUS.COMPLETE,
            loadCycles: resolveData.loadCycles,
          });
        }
        resolve(resolveData);
      };

      colorBubble.run()(updateColorsAfterLoadCallback);
    })
      .then(data => {
        if (data.loadAgain) {
          // get updated colorField
          const { colorField } = this.state;

          // load again, passing along latest bubble data and a color for the load callback
          const updatedColorBubble = colorField[colorFieldKey];
          const updatedNewColor = this.getNewColor(colorField);
          console.log('CHAINING PROMISE', colorFieldKey, updatedColorBubble);
          return this.returnColorLoadPromise(
            updatedColorBubble,
            colorFieldKey,
            updatedNewColor
          );
        }
        return data;
      })
      .catch(err => console.log('Error:', err));
  };

  resetColorField = () => {
    // Add a way to cancel promise chaining and exit async
    this.setState({
      colorField: getColorField(),
      colorFieldClean: true,
      colorFieldLoadCompleted: false,
    });
  };

  startAsyncColors = () => {
    const { colorField } = this.state;
    const colorFieldArray = Object.keys(colorField);
    const updatedColorBubbles = [];
    const promises = [];

    this.setState({ colorFieldClean: false });

    colorFieldArray.forEach(colorFieldKey => {
      const colorBubble = {
        ...colorField[colorFieldKey],
        status: COLORBUBBLE_STATUS.ACTIVE,
      };
      const newColorName = this.getNewColor(colorField);

      updatedColorBubbles.push(colorBubble);
      this.setState({ colorField: updatedColorBubbles });

      const p = this.returnColorLoadPromise(
        colorBubble,
        colorFieldKey,
        newColorName
      );

      promises.push(p);
    });

    Promise.all(promises)
      .then(data => {
        console.log('COMPLETED', data);
        this.setState({ colorFieldLoadCompleted: true });
      })
      .catch(err => console.error('Error:', err));
  };

  render() {
    const { colorField, colorFieldClean, colorFieldLoadCompleted } = this.state;
    return (
      <div id="container" style={style.container}>
        <header style={style.header}>
          <h1>async colorfield</h1>
        </header>
        <main style={style.main}>
          <ActionButtons
            resetAction={this.resetColorField}
            showStart={colorFieldClean}
            startAction={this.startAsyncColors}
          />
          <ColorField
            colorField={colorField}
            loadIsCompleted={colorFieldLoadCompleted}
          />
        </main>
      </div>
    );
  }
}

export default App;
