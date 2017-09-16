import React from 'react';
import ReactDOM from 'react-dom';

import MultiGrid from './dist/commonjs';
import styles from './css/index.scss';

ReactDOM.render(
  <MultiGrid
    fixedRowCount={2}
    fixedLeftColumnCount={2}
    fixedRightColumnCount={2}
    rowCount={10000}
    columnCount={10000}
    style={{
      border: '1px solid #cccccc',
    }}
    cellRenderer={({ columnIndex, key, rowIndex, style }) => (
      <div className="Cell" key={key} style={style}>
        {`${rowIndex} - ${columnIndex}`}
      </div>
    )}
  />, document.getElementById('react-root'))