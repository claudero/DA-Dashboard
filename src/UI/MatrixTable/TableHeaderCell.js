import React from 'react';
import PropTypes from 'prop-types';

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
    const { className, column, container } = this.props;
    const { isHovered, isTruncated } = this.state;
    const children = column.title;

    if (!children) return null;

    const showTooltip = isHovered && isTruncated;
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
  column: PropTypes.object,
  columnIndex: PropTypes.number,
  container: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

export default TableCell;
