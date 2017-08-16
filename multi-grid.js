import React, { PropTypes } from 'react';
import { isFunction, identity, isNil } from 'lodash/fp';
import {
  compose,
  pure,
  setPropTypes,
  withProps,
  withHandlers,
  defaultProps,
  withState,
  renameProps,
  lifecycle,
} from 'recompose';
// import CellMeasurerCacheDecorator
//  from 'react-virtualized/dist/commonjs/MultiGrid/CellMeasurerCacheDecorator';
import Grid from 'react-virtualized/dist/commonjs/Grid/Grid';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';
import uuid from 'uuid';
import './multi-grid-v2.less';
// import cellRangeRenderer from './cell-range-renderer';

const PlaceHolder = compose(
  pure,
)((props) => (
  <div
    key={uuid.v4()}
    style={{
      ...props.style,
    }}
  />
));

export default compose(
  pure,
  setPropTypes({
    fixedRowCount: PropTypes.number,
    rowHeight: PropTypes.number,
    columnWidth: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,
    fixedLeftColumnCount: PropTypes.number,
    fixedRightColumnCount: PropTypes.number,
    rowCount: PropTypes.number,
    columnCount: PropTypes.number,
    cellRenderer: PropTypes.func,
    onScroll: PropTypes.func,
  }),
  defaultProps({
    fixedRowCount: 0,
    rowHeight: 35,
    columnWidth: 75,
    height: 600,
    width: 1000,
    fixedLeftColumnCount: 0,
    fixedRightColumnCount: 0,
    cellRenderer: (props) => <PlaceHolder {...props} />,
    rowCount: 1000,
    columnCount: 100,
    onScroll: identity,
  }),
  renameProps({
    scrollLeft: 'scroll-Left',
    scrollTop: 'scroll-Top',
  }),
  withState('horizontal', 'changeHorizontal', false),
  withState('vertical', 'changeVertical', false),
  withState('scrollLeft', 'changeScrollLeft', ({ scrollLeft }) => scrollLeft),
  withState('scrollTop', 'changeScrollTop', ({ scrollTop }) => scrollTop),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (!isNil(nextProps['scroll-Left']) && nextProps['scroll-Left'] !== this.props.scrollLeft) {
        this.props.changeScrollLeft(nextProps['scroll-Left']);
      }

      if (!isNil(nextProps['scroll-Top']) && nextProps['scroll-Top'] !== this.props.scrollTop) {
        this.props.changeScrollTop(nextProps['scroll-Top']);
      }
    },
  }),
  withProps((props) => {
    const {
      fixedRowCount,
      rowHeight,
      height,
      fixedLeftColumnCount,
      fixedRightColumnCount,
      columnCount,
      columnWidth,
     } = props;
    let topGridHeight = 0;
    let bottomGridHeight = 0;
    let leftGridWidth = 0;
    let rightGridWidth = 0;
    if (isFunction(rowHeight)) {
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < fixedRowCount; index++) {
        topGridHeight += rowHeight({ index });
      }
    } else {
      topGridHeight = fixedRowCount * rowHeight;
    }

    bottomGridHeight = height - topGridHeight;

    if (isFunction(columnWidth)) {
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < fixedLeftColumnCount; index++) {
        leftGridWidth += columnWidth({ index });
      }

      // eslint-disable-next-line no-plusplus
      for (let index = columnCount - fixedRightColumnCount; index < columnCount; index++) {
        rightGridWidth += columnWidth({ index });
      }
    } else {
      leftGridWidth = fixedLeftColumnCount * columnWidth;
      rightGridWidth = fixedRightColumnCount * columnWidth;
    }

    return {
      topGridHeight,
      bottomGridHeight,
      leftGridWidth,
      rightGridWidth,
    };
  }),
  withHandlers({
    baseTopGridRenderer: ({
      cellRenderer,
      columnCount,
      fixedLeftColumnCount,
      fixedRightColumnCount,
    }) => (rendererProps) => {
      const { columnIndex } = rendererProps;
      if (columnIndex < fixedLeftColumnCount
        || columnIndex > columnCount - fixedRightColumnCount - 1) {
        return <PlaceHolder {...rendererProps} />;
      }

      return cellRenderer(rendererProps);
    },
    baseBottomGridRenderer: ({
      cellRenderer,
      columnCount,
      fixedLeftColumnCount,
      fixedRightColumnCount,
      fixedRowCount,
    }) => (rendererProps) => {
      const { columnIndex, rowIndex } = rendererProps;
      if (columnIndex < fixedLeftColumnCount
        || columnIndex > columnCount - fixedRightColumnCount - 1) {
        return <PlaceHolder {...rendererProps} />;
      }

      return cellRenderer({
        ...rendererProps,
        rowIndex: rowIndex + fixedRowCount,
        key: `${rowIndex + fixedRowCount}-${columnIndex}`,
      });
    },
    leftBottomGridRenderer: ({
      cellRenderer,
      fixedRowCount,
    }) => (rendererProps) =>
      cellRenderer({
        ...rendererProps,
        rowIndex: rendererProps.rowIndex + fixedRowCount,
        key: `${rendererProps.rowIndex + fixedRowCount}-${rendererProps.columnIndex}`,
      }),
    topRightGridRenderer: ({
      cellRenderer,
      fixedRightColumnCount,
      columnCount,
    }) => (rendererProps) => {
      const columnIndex =
        rendererProps.columnIndex + columnCount - fixedRightColumnCount;
      return cellRenderer({
        ...rendererProps,
        columnIndex,
        key: `${rendererProps.rowIndex}-${columnIndex}`,
      });
    },
    bottomRightGridRenderer: ({
      cellRenderer,
      fixedRightColumnCount,
      columnCount,
      fixedRowCount,
    }) => (rendererProps) => {
      const columnIndex = rendererProps.columnIndex + columnCount - fixedRightColumnCount;
      const rowIndex = rendererProps.rowIndex + fixedRowCount;
      return cellRenderer({
        ...rendererProps,
        columnIndex,
        rowIndex,
        key: `${rowIndex}-${columnIndex}`,
      });
    },
    rightGridColumnWidth: ({
      columnWidth,
      columnCount,
      fixedRightColumnCount,
    }) => ({ index }) => {
      const startColumnIndex = columnCount - fixedRightColumnCount;
      if (isFunction(columnWidth)) {
        return columnWidth({ index: index + startColumnIndex });
      }

      return columnWidth;
    },
    onScrollbarPresenceChange: ({
      changeHorizontal,
      changeVertical,
    }) => ({ horizontal, vertical }) => {
      changeHorizontal(horizontal);
      changeVertical(vertical);
    },
    onScroll: ({ changeScrollLeft, changeScrollTop, onScroll: onGridScroll }) =>
    ({ scrollLeft, scrollTop }) => {
      changeScrollLeft(scrollLeft);
      changeScrollTop(scrollTop);
      onGridScroll({
        scrollLeft,
        scrollTop,
      });
    },
    onScrollLeft: ({ changeScrollLeft, onScroll: onGridScroll, scrollTop }) => ({ scrollLeft }) => {
      changeScrollLeft(scrollLeft);
      onGridScroll({
        scrollLeft,
        scrollTop,
      });
    },
    onScrollTop: ({ changeScrollTop, onScroll: onGridScroll, scrollLeft }) => ({ scrollTop }) => {
      changeScrollTop(scrollTop);
      onGridScroll({
        scrollLeft,
        scrollTop,
      });
    },
  }),
)(({
  style,
  width,
  height,
  rowCount,
  fixedRowCount,
  topGridHeight,
  bottomGridHeight,
  columnCount,
  columnWidth,
  rowHeight,
  baseTopGridRenderer,
  baseBottomGridRenderer,
  scrollLeft,
  scrollTop,
  onScroll,
  onScrollbarPresenceChange,
  horizontal,
  vertical,
  fixedLeftColumnCount,
  fixedRightColumnCount,
  leftGridWidth,
  rightGridWidth,
  cellRenderer,
  leftBottomGridRenderer,
  rightGridColumnWidth,
  topRightGridRenderer,
  bottomRightGridRenderer,
  onScrollLeft,
  onScrollTop,
}) => {
  if (width === 0 || height === 0) {
    return null;
  }

  return (
    <div
      style={{
        ...style,
        width,
        height,
      }}
    >
      <AutoSizer disableHeight disableWidth>
        {() =>
          (
            <div
              style={{
                position: 'relative',
                width,
                height,
              }}
            >
              {
                fixedRowCount
                ?
                  <div
                    style={{
                      overflow: 'hidden',
                      width: vertical ? width - scrollbarSize() : width,
                      height: topGridHeight,
                    }}
                  >
                    <Grid
                      style={{
                        overflowY: 'hidden',
                      }}
                      width={vertical ? width - scrollbarSize() : width}
                      height={topGridHeight + scrollbarSize() + 2}
                      cellRenderer={baseTopGridRenderer}
                      rowCount={fixedRowCount}
                      columnCount={columnCount}
                      columnWidth={columnWidth}
                      rowHeight={rowHeight}
                      scrollLeft={scrollLeft}
                      onScroll={onScrollLeft}
                    />
                  </div>
                : null
                }
              <Grid
                width={width}
                height={bottomGridHeight}
                cellRenderer={baseBottomGridRenderer}
                rowCount={Math.max(0, rowCount - fixedRowCount)}
                columnCount={columnCount}
                columnWidth={columnWidth}
                rowHeight={rowHeight}
                scrollLeft={scrollLeft}
                scrollTop={scrollTop}
                onScroll={onScroll}
                onScrollbarPresenceChange={onScrollbarPresenceChange}
              />
              {
                fixedLeftColumnCount
                ? (<div
                  style={{
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: horizontal ? height - scrollbarSize() : height,
                    width: leftGridWidth,
                  }}
                >
                  <Grid
                    style={{
                      overflow: 'hidden',
                    }}
                    cellRenderer={cellRenderer}
                    width={leftGridWidth}
                    height={topGridHeight}
                    rowCount={fixedRowCount}
                    columnCount={fixedLeftColumnCount}
                    columnWidth={columnWidth}
                    rowHeight={rowHeight}
                  />
                  <div
                    style={{
                      overflow: 'hidden',
                      width: leftGridWidth,
                      height: bottomGridHeight,
                    }}
                  >
                    <Grid
                      style={{
                        overflowX: 'hidden',
                      }}
                      cellRenderer={leftBottomGridRenderer}
                      width={leftGridWidth + scrollbarSize() + 2}
                      height={horizontal ? bottomGridHeight - scrollbarSize() : bottomGridHeight}
                      rowCount={Math.max(0, rowCount - fixedRowCount)}
                      columnCount={fixedLeftColumnCount}
                      columnWidth={columnWidth}
                      rowHeight={rowHeight}
                      scrollTop={scrollTop}
                      onScroll={onScrollTop}
                    />
                  </div>
                </div>
                )
                : null
              }
              {
                fixedRightColumnCount
                ? (<div
                  style={{
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: 0,
                    right: vertical ? scrollbarSize() : 0,
                    height: horizontal ? height - scrollbarSize() : height,
                    width: rightGridWidth,
                  }}
                >
                  <Grid
                    style={{
                      overflow: 'hidden',
                    }}
                    width={rightGridWidth}
                    height={topGridHeight}
                    rowCount={fixedRowCount}
                    columnCount={fixedRightColumnCount}
                    columnWidth={rightGridColumnWidth}
                    rowHeight={rowHeight}
                    cellRenderer={topRightGridRenderer}
                  />
                  <div
                    style={{
                      width: rightGridWidth,
                      height: bottomGridHeight,
                      overflow: 'hidden',
                    }}
                  >
                    <Grid
                      style={{
                        overflowX: 'hidden',
                      }}
                      width={rightGridWidth + scrollbarSize() + 2}
                      height={horizontal ? bottomGridHeight - scrollbarSize() : bottomGridHeight}
                      columnCount={fixedRightColumnCount}
                      rowCount={Math.max(0, rowCount - fixedRowCount)}
                      columnWidth={rightGridColumnWidth}
                      rowHeight={rowHeight}
                      cellRenderer={bottomRightGridRenderer}
                      scrollTop={scrollTop}
                      onScroll={onScrollTop}
                    />
                  </div>
                </div>)
              : null
              }
            </div>)
        }
      </AutoSizer>
    </div>
  );
});
