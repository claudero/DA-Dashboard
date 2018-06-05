import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import '../../css/selectionBox.css';

/**
 * SelectionBox for the Table
 */
class SelectionBox extends React.PureComponent {
  constructor(props) {
    super(props);

    this._handleClick = this._handleClick.bind(this);
  }

  render() {
    const { checked, indeterminate, disabled, className, onChange } = this.props;
    const cls = classNames(
      'SelectionBox',
      {
        'SelectionBox--checked': checked,
        'SelectionBox--indeterminate': indeterminate,
        'SelectionBox--disabled': disabled,
      },
      className
    );
      return <div className={cls} onClick={onChange ? this._handleClick : null} />;
  }

  _handleClick = e => {
    e.stopPropagation();
    const { onChange, checked, indeterminate, disabled } = this.props;
    if (disabled) return;
    onChange(indeterminate ? true : !checked);
  };
}

SelectionBox.propTypes = {
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default SelectionBox;
