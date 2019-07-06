import React, { Component } from 'react';
import ColorField from './ColorField';
import ColorStart from './ColorStart';
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
    colorField: getColorField(),
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
      let resolveMessage = '';
      const updateColorsAfterLoadCallback = shouldUpdateColor => {
        if (shouldUpdateColor) {
          self.updateColorField(colorFieldKey, {
            status: COLORBUBBLE_STATUS.COMPLETE,
            name: newColorName,
          });
          resolveMessage = 'Load Continue: Update Color';
        } else {
          self.updateColorField(colorFieldKey, {
            status: COLORBUBBLE_STATUS.COMPLETE,
          });
          resolveMessage = 'Load Complete';
        }
        resolve(resolveMessage);
      };

      colorBubble.run(updateColorsAfterLoadCallback);
    })
      .then(data => data)
      .catch(err => console.log('Error:', err));
  };

  startAsyncColors = () => {
    const { colorField } = this.state;
    const colorFieldArray = Object.keys(colorField);
    const updatedColorBubbles = [];
    const promises = [];

    colorFieldArray.forEach(colorFieldKey => {
      const colorBubble = {
        ...colorField[colorFieldKey],
        status: COLORBUBBLE_STATUS.ACTIVE,
      };
      const newColorIndex = Math.floor(Math.random() * colorFieldArray.length);
      const newColorName = colorField[newColorIndex].name;
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
      .then(data => console.log('COMPLETED', data))
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    const { colorField } = this.state;
    return (
      <div id="container" style={style.container}>
        <header style={style.header}>
          <h1>async colorfield</h1>
        </header>
        <main style={style.main}>
          <ColorStart startAction={this.startAsyncColors} />
          <ColorField colorField={colorField} />
        </main>
      </div>
    );
  }
}

export default App;
