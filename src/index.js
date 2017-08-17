import React from 'react';
import ReactDOM from 'react-dom';

import MultiGrid from '../multi-grid';
import styles from '../css/index.scss';

ReactDOM.render(
  <MultiGrid
    fixedRowCount={2}
    fixedLeftColumnCount={2}
    fixedRightColumnCount={2}
    style={{
      border: '1px solid #cccccc',
    }}
    cellRenderer={({ columnIndex, key, rowIndex, style }) => (
      <div className="Cell" key={key} style={style}>
        {`${rowIndex} - ${columnIndex}`}
      </div>
    )}
  />, document.getElementById('react-root'))