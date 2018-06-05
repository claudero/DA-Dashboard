import React from 'react';
import PropTypes from 'prop-types';

import toString from 'lodash/toString';

import { callOrReturn } from '@adsk/react-base-table/es/utils';

/**
 * TableCell for the Table
 */
class TableCell extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isHovered: false,
      isTruncated: false,
    };

    this._setContainerRef = this._setContainerRef.bind(this);
    this._handleMouseEnter = this._handleMouseEnter.bind(this);
    this._handleMouseLeave = this._handleMouseLeave.bind(this);
  }

  render() {
    const { className, cellData, column, columnIndex, rowData, rowIndex, container } = this.props;
    const { isHovered, isTruncated } = this.state;
    const children = toString(cellData);

    if (!children) return null;

    const tooltip = callOrReturn(column.tooltip, { cellData, column, columnIndex, rowData, rowIndex });
    const showTooltip = isHovered && (tooltip || isTruncated);
    return (
      <div
        ref={this._setContainerRef}
        className={className}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
      >
        {children}
      </div>
    );
  }

  _setContainerRef(ref) {
    this.container = ref;
  }

  _handleMouseEnter() {
    this.setState({
      isHovered: true,
      isTruncated: this.container.scrollWidth > this.container.clientWidth,
    });
  }

  _handleMouseLeave() {
    this.setState({
      isHovered: false,
    });
  }
}

TableCell.propTypes = {
  className: PropTypes.string,
  cellData: PropTypes.any,
  column: PropTypes.object,
  columnIndex: PropTypes.number,
  rowData: PropTypes.object,
  rowIndex: PropTypes.number,
  container: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

export default TableCell;
