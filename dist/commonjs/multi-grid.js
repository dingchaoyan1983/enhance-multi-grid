'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fp = require('lodash/fp');

var _recompose = require('recompose');

var _AutoSizer = require('react-virtualized/dist/commonjs/AutoSizer');

var _AutoSizer2 = _interopRequireDefault(_AutoSizer);

var _scrollbarSize = require('dom-helpers/util/scrollbarSize');

var _scrollbarSize2 = _interopRequireDefault(_scrollbarSize);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _enhancedGrid = require('./enhanced-grid');

var _enhancedGrid2 = _interopRequireDefault(_enhancedGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PlaceHolder = (0, _recompose.compose)(_recompose.pure)(function (props) {
  return _react2.default.createElement('div', {
    key: _uuid2.default.v4(),
    style: props.style
  });
});

exports.default = (0, _recompose.compose)(_recompose.pure, (0, _recompose.setPropTypes)({
  fixedRowCount: _react.PropTypes.number,
  rowHeight: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.func]),
  columnWidth: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.func]),
  height: _react.PropTypes.number,
  width: _react.PropTypes.number,
  fixedLeftColumnCount: _react.PropTypes.number,
  fixedRightColumnCount: _react.PropTypes.number,
  rowCount: _react.PropTypes.number,
  columnCount: _react.PropTypes.number,
  cellRenderer: _react.PropTypes.func,
  onScroll: _react.PropTypes.func,
  onScrollbarPresenceChange: _react.PropTypes.func
}), (0, _recompose.defaultProps)({
  fixedRowCount: 0,
  rowHeight: 35,
  columnWidth: 75,
  height: 600,
  width: 1000,
  fixedLeftColumnCount: 0,
  fixedRightColumnCount: 0,
  cellRenderer: function cellRenderer(props) {
    return _react2.default.createElement(PlaceHolder, props);
  },
  rowCount: 1000,
  columnCount: 100,
  onScroll: _fp.identity,
  onScrollbarPresenceChange: _fp.identity
}), (0, _recompose.renameProps)({
  scrollLeft: 'scroll-Left',
  scrollTop: 'scroll-Top'
}), (0, _recompose.withState)('horizontal', 'changeHorizontal', false), (0, _recompose.withState)('vertical', 'changeVertical', false), (0, _recompose.withState)('scrollLeft', 'changeScrollLeft', function (_ref) {
  var scrollLeft = _ref.scrollLeft;
  return scrollLeft;
}), (0, _recompose.withState)('scrollTop', 'changeScrollTop', function (_ref2) {
  var scrollTop = _ref2.scrollTop;
  return scrollTop;
}), (0, _recompose.lifecycle)({
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (!(0, _fp.isNil)(nextProps['scroll-Left']) && nextProps['scroll-Left'] !== this.props.scrollLeft) {
      this.props.changeScrollLeft(nextProps['scroll-Left']);
    }

    if (!(0, _fp.isNil)(nextProps['scroll-Top']) && nextProps['scroll-Top'] !== this.props.scrollTop) {
      this.props.changeScrollTop(nextProps['scroll-Top']);
    }
  }
}), (0, _recompose.withProps)(function (props) {
  var fixedRowCount = props.fixedRowCount,
      rowHeight = props.rowHeight,
      height = props.height,
      fixedLeftColumnCount = props.fixedLeftColumnCount,
      fixedRightColumnCount = props.fixedRightColumnCount,
      columnCount = props.columnCount,
      columnWidth = props.columnWidth;

  var topGridHeight = 0;
  var bottomGridHeight = 0;
  var leftGridWidth = 0;
  var rightGridWidth = 0;
  if ((0, _fp.isFunction)(rowHeight)) {
    // eslint-disable-next-line no-plusplus
    for (var index = 0; index < fixedRowCount; index++) {
      topGridHeight += rowHeight({ index: index });
    }
  } else {
    topGridHeight = fixedRowCount * rowHeight;
  }

  bottomGridHeight = height - topGridHeight;

  if ((0, _fp.isFunction)(columnWidth)) {
    // eslint-disable-next-line no-plusplus
    for (var _index = 0; _index < fixedLeftColumnCount; _index++) {
      leftGridWidth += columnWidth({ index: _index });
    }

    // eslint-disable-next-line no-plusplus
    for (var _index2 = columnCount - fixedRightColumnCount; _index2 < columnCount; _index2++) {
      rightGridWidth += columnWidth({ index: _index2 });
    }
  } else {
    leftGridWidth = fixedLeftColumnCount * columnWidth;
    rightGridWidth = fixedRightColumnCount * columnWidth;
  }

  return {
    topGridHeight: topGridHeight,
    bottomGridHeight: bottomGridHeight,
    leftGridWidth: leftGridWidth,
    rightGridWidth: rightGridWidth
  };
}), (0, _recompose.withHandlers)({
  baseTopGridRenderer: function baseTopGridRenderer(_ref3) {
    var cellRenderer = _ref3.cellRenderer,
        columnCount = _ref3.columnCount,
        fixedLeftColumnCount = _ref3.fixedLeftColumnCount,
        fixedRightColumnCount = _ref3.fixedRightColumnCount;
    return function (rendererProps) {
      var columnIndex = rendererProps.columnIndex;

      if (columnIndex < fixedLeftColumnCount || columnIndex > columnCount - fixedRightColumnCount - 1) {
        return _react2.default.createElement(PlaceHolder, rendererProps);
      }

      return cellRenderer(rendererProps);
    };
  },
  baseBottomGridRenderer: function baseBottomGridRenderer(_ref4) {
    var cellRenderer = _ref4.cellRenderer,
        columnCount = _ref4.columnCount,
        fixedLeftColumnCount = _ref4.fixedLeftColumnCount,
        fixedRightColumnCount = _ref4.fixedRightColumnCount,
        fixedRowCount = _ref4.fixedRowCount;
    return function (rendererProps) {
      var columnIndex = rendererProps.columnIndex,
          rowIndex = rendererProps.rowIndex;

      if (columnIndex < fixedLeftColumnCount || columnIndex > columnCount - fixedRightColumnCount - 1) {
        return _react2.default.createElement(PlaceHolder, rendererProps);
      }

      return cellRenderer(_extends({}, rendererProps, {
        rowIndex: rowIndex + fixedRowCount,
        key: rowIndex + fixedRowCount + '-' + columnIndex
      }));
    };
  },
  leftBottomGridRenderer: function leftBottomGridRenderer(_ref5) {
    var cellRenderer = _ref5.cellRenderer,
        fixedRowCount = _ref5.fixedRowCount;
    return function (rendererProps) {
      return cellRenderer(_extends({}, rendererProps, {
        rowIndex: rendererProps.rowIndex + fixedRowCount,
        key: rendererProps.rowIndex + fixedRowCount + '-' + rendererProps.columnIndex
      }));
    };
  },
  topRightGridRenderer: function topRightGridRenderer(_ref6) {
    var cellRenderer = _ref6.cellRenderer,
        fixedRightColumnCount = _ref6.fixedRightColumnCount,
        columnCount = _ref6.columnCount;
    return function (rendererProps) {
      var columnIndex = rendererProps.columnIndex + columnCount - fixedRightColumnCount;
      return cellRenderer(_extends({}, rendererProps, {
        columnIndex: columnIndex,
        key: rendererProps.rowIndex + '-' + columnIndex
      }));
    };
  },
  bottomRightGridRenderer: function bottomRightGridRenderer(_ref7) {
    var cellRenderer = _ref7.cellRenderer,
        fixedRightColumnCount = _ref7.fixedRightColumnCount,
        columnCount = _ref7.columnCount,
        fixedRowCount = _ref7.fixedRowCount;
    return function (rendererProps) {
      var columnIndex = rendererProps.columnIndex + columnCount - fixedRightColumnCount;
      var rowIndex = rendererProps.rowIndex + fixedRowCount;
      return cellRenderer(_extends({}, rendererProps, {
        columnIndex: columnIndex,
        rowIndex: rowIndex,
        key: rowIndex + '-' + columnIndex
      }));
    };
  },
  rightGridColumnWidth: function rightGridColumnWidth(_ref8) {
    var columnWidth = _ref8.columnWidth,
        columnCount = _ref8.columnCount,
        fixedRightColumnCount = _ref8.fixedRightColumnCount;
    return function (_ref9) {
      var index = _ref9.index;

      var startColumnIndex = columnCount - fixedRightColumnCount;
      if ((0, _fp.isFunction)(columnWidth)) {
        return columnWidth({ index: index + startColumnIndex });
      }

      return columnWidth;
    };
  },
  onScroll: function onScroll(_ref10) {
    var changeScrollLeft = _ref10.changeScrollLeft,
        changeScrollTop = _ref10.changeScrollTop,
        onGridScroll = _ref10.onScroll;
    return function (_ref11) {
      var scrollLeft = _ref11.scrollLeft,
          scrollTop = _ref11.scrollTop;

      changeScrollLeft(scrollLeft);
      changeScrollTop(scrollTop);
      onGridScroll({
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      });
    };
  },
  onScrollLeft: function onScrollLeft(_ref12) {
    var changeScrollLeft = _ref12.changeScrollLeft,
        onGridScroll = _ref12.onScroll,
        scrollTop = _ref12.scrollTop;
    return function (_ref13) {
      var scrollLeft = _ref13.scrollLeft;

      changeScrollLeft(scrollLeft);
      onGridScroll({
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      });
    };
  },
  onScrollTop: function onScrollTop(_ref14) {
    var changeScrollTop = _ref14.changeScrollTop,
        onGridScroll = _ref14.onScroll,
        scrollLeft = _ref14.scrollLeft;
    return function (_ref15) {
      var scrollTop = _ref15.scrollTop;

      changeScrollTop(scrollTop);
      onGridScroll({
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      });
    };
  }
}), (0, _recompose.withHandlers)(function (_ref16) {
  var changeHorizontal = _ref16.changeHorizontal,
      changeVertical = _ref16.changeVertical,
      _onScrollbarPresenceChange = _ref16.onScrollbarPresenceChange;

  var mainBaseGridRef = void 0;
  var mainHeadGridRef = void 0;
  return {
    registerMainBaseGrid: function registerMainBaseGrid() {
      return function (ref) {
        mainBaseGridRef = ref;
      };
    },
    registerMainHeadGrid: function registerMainHeadGrid() {
      return function (ref) {
        mainHeadGridRef = ref;
      };
    },
    onResize: function onResize() {
      return function () {
        mainBaseGridRef.recomputeGridSize();
        if (mainHeadGridRef) {
          mainHeadGridRef.recomputeGridSize();
        }
      };
    },
    onScrollbarPresenceChange: function onScrollbarPresenceChange() {
      return function (_ref17) {
        var horizontal = _ref17.horizontal,
            vertical = _ref17.vertical;

        if (mainHeadGridRef) {
          mainHeadGridRef.recomputeGridSize();
        }
        if (mainBaseGridRef) {
          mainBaseGridRef.recomputeGridSize();
        }
        changeHorizontal(horizontal);
        changeVertical(vertical);
        _onScrollbarPresenceChange({
          horizontal: horizontal,
          vertical: vertical
        });
      };
    }
  };
}))(function (_ref18) {
  var style = _ref18.style,
      width = _ref18.width,
      height = _ref18.height,
      rowCount = _ref18.rowCount,
      fixedRowCount = _ref18.fixedRowCount,
      topGridHeight = _ref18.topGridHeight,
      bottomGridHeight = _ref18.bottomGridHeight,
      columnCount = _ref18.columnCount,
      columnWidth = _ref18.columnWidth,
      rowHeight = _ref18.rowHeight,
      baseTopGridRenderer = _ref18.baseTopGridRenderer,
      baseBottomGridRenderer = _ref18.baseBottomGridRenderer,
      scrollLeft = _ref18.scrollLeft,
      scrollTop = _ref18.scrollTop,
      onScroll = _ref18.onScroll,
      onScrollbarPresenceChange = _ref18.onScrollbarPresenceChange,
      horizontal = _ref18.horizontal,
      vertical = _ref18.vertical,
      fixedLeftColumnCount = _ref18.fixedLeftColumnCount,
      fixedRightColumnCount = _ref18.fixedRightColumnCount,
      leftGridWidth = _ref18.leftGridWidth,
      rightGridWidth = _ref18.rightGridWidth,
      cellRenderer = _ref18.cellRenderer,
      leftBottomGridRenderer = _ref18.leftBottomGridRenderer,
      rightGridColumnWidth = _ref18.rightGridColumnWidth,
      topRightGridRenderer = _ref18.topRightGridRenderer,
      bottomRightGridRenderer = _ref18.bottomRightGridRenderer,
      onScrollLeft = _ref18.onScrollLeft,
      onScrollTop = _ref18.onScrollTop,
      registerMainBaseGrid = _ref18.registerMainBaseGrid,
      registerMainHeadGrid = _ref18.registerMainHeadGrid,
      onResize = _ref18.onResize;

  if (width === 0 || height === 0) {
    return null;
  }

  return _react2.default.createElement(
    'div',
    {
      style: _extends({}, style, {
        width: width,
        height: height + 2
      })
    },
    _react2.default.createElement(
      _AutoSizer2.default,
      { onResize: onResize },
      function () {
        return _react2.default.createElement(
          'div',
          {
            style: {
              position: 'relative',
              width: width,
              height: height
            }
          },
          fixedRowCount ? _react2.default.createElement(
            'div',
            {
              style: {
                overflow: 'hidden',
                width: vertical ? width - (0, _scrollbarSize2.default)() : width,
                height: topGridHeight
              }
            },
            _react2.default.createElement(_enhancedGrid2.default, {
              ref: registerMainHeadGrid,
              style: {
                overflowY: 'hidden'
              },
              width: vertical ? width - (0, _scrollbarSize2.default)() : width,
              height: topGridHeight + (0, _scrollbarSize2.default)() + 2,
              cellRenderer: baseTopGridRenderer,
              rowCount: fixedRowCount,
              columnCount: columnCount,
              columnWidth: columnWidth,
              rowHeight: rowHeight,
              scrollLeft: scrollLeft,
              onScroll: onScrollLeft
            })
          ) : null,
          _react2.default.createElement(_enhancedGrid2.default, {
            ref: registerMainBaseGrid,
            width: width,
            height: bottomGridHeight,
            cellRenderer: baseBottomGridRenderer,
            rowCount: Math.max(0, rowCount - fixedRowCount),
            columnCount: columnCount,
            columnWidth: columnWidth,
            rowHeight: rowHeight,
            scrollLeft: scrollLeft,
            scrollTop: scrollTop,
            onScroll: onScroll,
            onScrollbarPresenceChange: onScrollbarPresenceChange
          }),
          fixedLeftColumnCount ? _react2.default.createElement(
            'div',
            {
              style: {
                backgroundColor: '#fff',
                position: 'absolute',
                top: 0,
                left: 0,
                height: horizontal ? height - (0, _scrollbarSize2.default)() : height,
                width: leftGridWidth
              }
            },
            _react2.default.createElement(_enhancedGrid2.default, {
              style: {
                overflow: 'hidden'
              },
              cellRenderer: cellRenderer,
              width: leftGridWidth,
              height: topGridHeight,
              rowCount: fixedRowCount,
              columnCount: fixedLeftColumnCount,
              columnWidth: columnWidth,
              rowHeight: rowHeight
            }),
            _react2.default.createElement(
              'div',
              {
                style: {
                  overflow: 'hidden',
                  width: leftGridWidth,
                  height: horizontal ? bottomGridHeight - (0, _scrollbarSize2.default)() : bottomGridHeight
                }
              },
              _react2.default.createElement(_enhancedGrid2.default, {
                style: {
                  overflowX: 'hidden'
                },
                cellRenderer: leftBottomGridRenderer,
                width: leftGridWidth + (0, _scrollbarSize2.default)() + 2,
                height: horizontal ? bottomGridHeight - (0, _scrollbarSize2.default)() : bottomGridHeight,
                rowCount: Math.max(0, rowCount - fixedRowCount),
                columnCount: fixedLeftColumnCount,
                columnWidth: columnWidth,
                rowHeight: rowHeight,
                scrollTop: scrollTop,
                onScroll: onScrollTop
              })
            )
          ) : null,
          fixedRightColumnCount ? _react2.default.createElement(
            'div',
            {
              style: {
                backgroundColor: '#fff',
                position: 'absolute',
                top: 0,
                right: vertical ? (0, _scrollbarSize2.default)() : 0,
                height: horizontal ? height - (0, _scrollbarSize2.default)() : height,
                width: rightGridWidth
              }
            },
            _react2.default.createElement(_enhancedGrid2.default, {
              style: {
                overflow: 'hidden'
              },
              width: rightGridWidth,
              height: topGridHeight,
              rowCount: fixedRowCount,
              columnCount: fixedRightColumnCount,
              columnWidth: rightGridColumnWidth,
              rowHeight: rowHeight,
              cellRenderer: topRightGridRenderer
            }),
            _react2.default.createElement(
              'div',
              {
                style: {
                  width: rightGridWidth,
                  height: horizontal ? bottomGridHeight - (0, _scrollbarSize2.default)() : bottomGridHeight,
                  overflow: 'hidden'
                }
              },
              _react2.default.createElement(_enhancedGrid2.default, {
                style: {
                  overflowX: 'hidden'
                },
                width: rightGridWidth + (0, _scrollbarSize2.default)() + 2,
                height: horizontal ? bottomGridHeight - (0, _scrollbarSize2.default)() : bottomGridHeight,
                columnCount: fixedRightColumnCount,
                rowCount: Math.max(0, rowCount - fixedRowCount),
                columnWidth: rightGridColumnWidth,
                rowHeight: rowHeight,
                cellRenderer: bottomRightGridRenderer,
                scrollTop: scrollTop,
                onScroll: onScrollTop
              })
            )
          ) : null
        );
      }
    )
  );
});