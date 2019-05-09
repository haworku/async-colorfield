import React, { Component } from 'react';
import ColorBlock from './ColorBlock';

const style = {
  container: {
    backgroundColor: '#fff',
    border: '1px solid rgba(24,33,45,.06)',
    borderRadius: ' 8px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
};

class ColorField extends Component {
  render() {
    const { colorField } = this.props;

    return (
      <div style={style.container}>
        {Object.keys(colorField).map(key => {
          return (
            <ColorBlock
              key={key}
              colorName={colorField[key].name}
              status={colorField[key].status}
            />
          );
        })}
      </div>
    );
  }
}

export default ColorField;
