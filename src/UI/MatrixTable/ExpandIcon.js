import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import '../../css/expandIcon.scss';

/**
 * ExpandIcon for the Table
 */
class ExpandIcon extends React.PureComponent {
  constructor(props) {
    super(props);

    this._handleClick = this._handleClick.bind(this);
  }

  render() {
    const { expandable, expanded, indentSize, depth, onExpand } = this.props;
    if (!expandable && indentSize === 0) return null;

    const cls = cn('ExpandIcon', {
      'ExpandIcon--expanded': expanded,
    });
    const a11yProps = {
      role: 'button',
      tabIndex: 0,
    };
    return (
      <div
        {...expandable && onExpand && a11yProps}
        className={cls}
        onClick={expandable && onExpand ? this._handleClick : null}
        style={{ marginLeft: depth * indentSize }}
      >
        {expandable && <div className="ExpandIcon__icon">M</div>}
      </div>
    );
  }

  _handleClick(e) {
    e.stopPropagation();
    const { onExpand, expanded } = this.props;
    onExpand(!expanded);
  }
}

ExpandIcon.defaultProps = {
  depth: 0,
  indentSize: 16,
};

ExpandIcon.propTypes = {
  expandable: PropTypes.bool,
  expanded: PropTypes.bool,
  indentSize: PropTypes.number,
  depth: PropTypes.number,
  onExpand: PropTypes.func,
};

export default ExpandIcon;
