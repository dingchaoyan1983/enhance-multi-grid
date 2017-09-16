// extends from original Grid component.
import React from 'react';
import cn from 'classnames';
import Grid from 'react-virtualized/dist/commonjs/Grid/Grid';

export default class extends Grid {
  render() {
    const {
      autoContainerWidth,
      autoHeight,
      autoWidth,
      className,
      containerProps,
      containerRole,
      containerStyle,
      height,
      id,
      noContentRenderer,
      role,
      style,
      tabIndex,
      width,
    } = this.props;

    const isScrolling = this._isScrolling();

    const gridStyle = {
      boxSizing: 'border-box',
      direction: 'ltr',
      height: autoHeight ? 'auto' : height,
      position: 'relative',
      width: autoWidth ? 'auto' : width,
      WebkitOverflowScrolling: 'touch',
      willChange: 'transform',
    };

    const totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize();
    const totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize();

    // Force browser to hide scrollbars when we know they aren't necessary.
    // Otherwise once scrollbars appear they may not disappear again.
    // For more info see issue #116
    // The origin Grid has some scrollbar falg issue for scrollbar change event. This is a fix.
    const verticalScrollBarSize =
      totalRowsHeight + this._scrollbarSize > height ? this._scrollbarSize : 0;
    const horizontalScrollBarSize =
      totalColumnsWidth + this._scrollbarSize > width ? this._scrollbarSize : 0;

    if (
      horizontalScrollBarSize !== this._horizontalScrollBarSize ||
      verticalScrollBarSize !== this._verticalScrollBarSize
    ) {
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
    gridStyle.overflowX =
      totalColumnsWidth + verticalScrollBarSize < width ? 'hidden' : 'auto';
    gridStyle.overflowY =
      totalRowsHeight + horizontalScrollBarSize < height ? 'hidden' : 'auto';

    const childrenToDisplay = this._childrenToDisplay;

    const showNoContentRenderer =
      childrenToDisplay.length === 0 && height > 0 && width > 0;

    return (
      <div
        ref={this._setScrollingContainerRef}
        {...containerProps}
        aria-label={this.props['aria-label']}
        aria-readonly={this.props['aria-readonly']}
        className={cn('ReactVirtualized__Grid', className)}
        id={id}
        onScroll={this._onScroll}
        role={role}
        style={{
          ...gridStyle,
          ...style,
        }}
        tabIndex={tabIndex}
      >
        {childrenToDisplay.length > 0 &&
          <div
            className="ReactVirtualized__Grid__innerScrollContainer"
            role={containerRole}
            style={{
              width: autoContainerWidth ? 'auto' : totalColumnsWidth,
              height: totalRowsHeight,
              maxWidth: totalColumnsWidth,
              maxHeight: totalRowsHeight,
              overflow: 'hidden',
              pointerEvents: isScrolling ? 'none' : '',
              position: 'relative',
              ...containerStyle,
            }}
          >
            {childrenToDisplay}
          </div>}
        {showNoContentRenderer && noContentRenderer()}
      </div>
    );
  }
}
