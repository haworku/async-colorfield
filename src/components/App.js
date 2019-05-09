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

  updateColorBlock = (key, colorBlockKeyValue) => {
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

  loadColorsAndReturnPromises = () => {
    const { colorField } = this.state;
    const updatedColorBlocks = [];

    return Object.keys(colorField).forEach(key => {
      const colorBlock = { ...colorField[key], status: COLORBLOCK_STATUS.ACTIVE };
      const newColorKey = 7;
      const newColorName = colorField[newColorKey].name;

      updatedColorBlocks.push(colorBlock);
      this.setState({ colorField: updatedColorBlocks });

      const whenColorBlockLoadCompletes = async () => {
        const callback = shouldUpdateColor => {
          if (shouldUpdateColor) {
            this.updateColorBlock(key, { color: newColorName });
          } else {
            this.updateColorBlock(key, { status: COLORBLOCK_STATUS.COMPLETE });
          }
        };
        await colorBlock.run(callback);
      };

      whenColorBlockLoadCompletes();
    });
  };

  startAsyncColors = async () => {
    this.loadColorsAndReturnPromises();
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
