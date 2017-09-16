'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Grid2 = require('react-virtualized/dist/commonjs/Grid/Grid');

var _Grid3 = _interopRequireDefault(_Grid2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // extends from original Grid component.


var _class = function (_Grid) {
  _inherits(_class, _Grid);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
  }

  _createClass(_class, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          autoContainerWidth = _props.autoContainerWidth,
          autoHeight = _props.autoHeight,
          autoWidth = _props.autoWidth,
          className = _props.className,
          containerProps = _props.containerProps,
          containerRole = _props.containerRole,
          containerStyle = _props.containerStyle,
          height = _props.height,
          id = _props.id,
          noContentRenderer = _props.noContentRenderer,
          role = _props.role,
          style = _props.style,
          tabIndex = _props.tabIndex,
          width = _props.width;


      var isScrolling = this._isScrolling();

      var gridStyle = {
        boxSizing: 'border-box',
        direction: 'ltr',
        height: autoHeight ? 'auto' : height,
        position: 'relative',
        width: autoWidth ? 'auto' : width,
        WebkitOverflowScrolling: 'touch',
        willChange: 'transform'
      };

      var totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize();
      var totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize();

      // Force browser to hide scrollbars when we know they aren't necessary.
      // Otherwise once scrollbars appear they may not disappear again.
      // For more info see issue #116
      // The origin Grid has some scrollbar falg issue for scrollbar change event. This is a fix.
      var verticalScrollBarSize = totalRowsHeight + this._scrollbarSize > height ? this._scrollbarSize : 0;
      var horizontalScrollBarSize = totalColumnsWidth + this._scrollbarSize > width ? this._scrollbarSize : 0;

      if (horizontalScrollBarSize !== this._horizontalScrollBarSize || verticalScrollBarSize !== this._verticalScrollBarSize) {
        this._horizontalScrollBarSize = horizontalScrollBarSize;
        this._verticalScrollBarSize = verticalScrollBarSize;
        this._scrollbarPresenceChanged = true;
      }

      // Also explicitly init styles to 'auto' if scrollbars are required.
      // This works around an obscure edge case where external CSS styles have not yet been loaded,
      // But an initial scroll index of offset is set as an external prop.
      // Without this style, Grid would render the correct range of cells but would NOT
      // update its internal offset.
      // This was originally reported via clauderic/react-infinite-calendar/issues/23
      // THIS IS THE FIX, FIX, FIX ...
      gridStyle.overflowX = totalColumnsWidth + verticalScrollBarSize < width ? 'hidden' : 'auto';
      gridStyle.overflowY = totalRowsHeight + horizontalScrollBarSize < height ? 'hidden' : 'auto';

      var childrenToDisplay = this._childrenToDisplay;

      var showNoContentRenderer = childrenToDisplay.length === 0 && height > 0 && width > 0;

      return _react2.default.createElement(
        'div',
        _extends({
          ref: this._setScrollingContainerRef
        }, containerProps, {
          'aria-label': this.props['aria-label'],
          'aria-readonly': this.props['aria-readonly'],
          className: (0, _classnames2.default)('ReactVirtualized__Grid', className),
          id: id,
          onScroll: this._onScroll,
          role: role,
          style: _extends({}, gridStyle, style),
          tabIndex: tabIndex
        }),
        childrenToDisplay.length > 0 && _react2.default.createElement(
          'div',
          {
            className: 'ReactVirtualized__Grid__innerScrollContainer',
            role: containerRole,
            style: _extends({
              width: autoContainerWidth ? 'auto' : totalColumnsWidth,
              height: totalRowsHeight,
              maxWidth: totalColumnsWidth,
              maxHeight: totalRowsHeight,
              overflow: 'hidden',
              pointerEvents: isScrolling ? 'none' : '',
              position: 'relative'
            }, containerStyle)
          },
          childrenToDisplay
        ),
        showNoContentRenderer && noContentRenderer()
      );
    }
  }]);

  return _class;
}(_Grid3.default);

exports.default = _class;