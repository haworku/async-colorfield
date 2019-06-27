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

  startAsyncColors = () => {
    const { colorField } = this.state;
    const updatedColorBlocks = [];
    const promises = [];
    const self = this;

    Object.keys(colorField).forEach(key => {
      const colorBlock = { ...colorField[key], status: COLORBLOCK_STATUS.ACTIVE };
      const newColorName = 'grape';

      updatedColorBlocks.push(colorBlock);
      this.setState({ colorField: updatedColorBlocks });

      const p = new Promise(resolve => {
        const updateColorsAfterLoad = shouldUpdateColor => {
          if (shouldUpdateColor) {
            self.updateColorBlock(key, {
              status: COLORBLOCK_STATUS.COMPLETE_CHANGED,
              name: newColorName,
            });
          } else {
            self.updateColorBlock(key, {
              status: COLORBLOCK_STATUS.COMPLETE_UNCHANGED,
            });
          }
          resolve();
        };

        colorBlock.run(updateColorsAfterLoad);
      }).then(() => {
        console.log('in this');
      });
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
