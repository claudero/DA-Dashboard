import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import SortOrder from '@adsk/react-base-table/es/SortOrder';

import '../../css/sortIndicator.scss';

/**
 * SortIndicator for the Table
 */
const SortIndicator = ({ sortOrder, className, style }) => {
  const cls = cn('SortIndicator', className, {
    'SortIndicator--descending': sortOrder === SortOrder.DESC,
  });
  return (
    <div className={cls} style={style}>
      M
    </div>
  );
};

SortIndicator.propTypes = {
  sortOrder: PropTypes.oneOf([SortOrder.ASC, SortOrder.DESC]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default SortIndicator;
