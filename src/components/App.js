import React, { Component } from 'react';
import ColorField from './ColorField';
import ColorStart from './ColorStart';
import { getColorField, COLORBLOCK_STATUS } from '../helpers';

const style = {
  container: {
    display: 'flex',
    minHeight: '100%',
    flexDirection: 'column',
  },
  header: {
    borderBottom: 'double',
    height: '2rem',
    lineHeight: '2rem',
    textAlign: 'center',
  },
  main: {
    display: 'flex',
    flex: 1,
  },
};

class App extends Component {
  state = {
    colorField: getColorField(),
  };

  // Update colorField nested state
  updateColorField = (key, colorBlockKeyValue) => {
    const { colorField } = this.state;
    const colorBlock = colorField[key];

    this.setState({
      colorField: {
        ...colorField,
        [key]: {
          ...colorBlock,
          ...colorBlockKeyValue,
        },
      },
    });
  };

  returnColorLoadPromise = (colorBlock, colorFieldKey, newColorName) => {
    const self = this;

    return new Promise(resolve => {
      const updateColorsAfterLoadCallback = shouldUpdateColor => {
        if (shouldUpdateColor) {
          self.updateColorField(colorFieldKey, {
            status: COLORBLOCK_STATUS.COMPLETE,
            name: newColorName,
          });
        } else {
          self.updateColorField(colorFieldKey, {
            status: COLORBLOCK_STATUS.COMPLETE,
          });
        }
        resolve();
      };

      colorBlock.run(updateColorsAfterLoadCallback);
    });
  };

  startAsyncColors = () => {
    const { colorField } = this.state;
    const colorFieldArray = Object.keys(colorField);
    const updatedColorBlocks = [];
    const promises = [];

    colorFieldArray.forEach(colorFieldKey => {
      const colorBlock = {
        ...colorField[colorFieldKey],
        status: COLORBLOCK_STATUS.ACTIVE,
      };
      const newColorIndex = Math.floor(Math.random() * colorFieldArray.length);
      const newColorName = colorField[newColorIndex].name;
      updatedColorBlocks.push(colorBlock);
      this.setState({ colorField: updatedColorBlocks });

      const p = this.returnColorLoadPromise(colorBlock, colorFieldKey, newColorName);

      promises.push(p);
    });

    Promise.all(promises)
      .then(console.log('COMPLETED'))
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    const { colorField } = this.state;
    return (
      <div style={style.container}>
        <header style={style.header}>async colorfield</header>
        <main style={style.main}>
          <ColorStart startAction={this.startAsyncColors} />
          <ColorField colorField={colorField} />
        </main>
      </div>
    );
  }
}

export default App;
