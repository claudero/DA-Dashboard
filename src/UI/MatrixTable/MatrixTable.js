import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import noop from 'lodash/noop';

//import ActionButton from '@adsk/bim360-matrix-react-components/es/components/ActionButton';


import IconButton from '@hig/icon-button';
import '@hig/icon-button/build/index.css';

//import IconButton from '@adsk/bim360-matrix-react-components/es/components/IconButton';
//import SvgIcon from '@adsk/bim360-matrix-react-components/es/components/SvgIcon';
import { default as Table, AutoResizer, SortOrder}  from '@hig/table';



import Column from './Column';
import TableCell from './TableCell';
import TableHeaderCell from './TableHeaderCell';
import SelectionBox from './SelectionBox';
import ExpandIcon from './ExpandIcon';
import SortIndicator from './SortIndicator';

import { normalizeColumns, callOrReturn } from '@adsk/react-base-table/es/utils';

import '../../css/matrixTable.css';

// width of selectionColumn and actionColumn,
// 16 - icon width, 15 - one side padding, 7.5 - another side padding, to make the gutter width be 15
// should override it via custom props if you want to change the gutter width
const DEFAULT_COLUMN_WIDTH = 16 + 15 + 7.5;

/**
 * Table component for Matrix Design, based on [BaseTable](basetable)
 */
class MatrixTable extends React.Component {
  constructor(props) {
    super(props);

    const { selectedRowKeys, defaultSelectedRowKeys } = this.props;
    this.state = {
      columns: this._normalizeColumns(props),
      selectedRowKeys: [...('selectedRowKeys' in this.props ? selectedRowKeys : defaultSelectedRowKeys)],
    };

    this._setTableRef = this._setTableRef.bind(this);
    this._rowClassName = this._rowClassName.bind(this);

    this._selectableRowKeysCache = null;
  }

  _normalizeColumns(props) {
    const columns = props.columns ? [...props.columns] : normalizeColumns(props.children);
    columns.forEach(column => {
      if (column.resizable !== false) column.resizable = true;
    });
    this._insertSelectionColumn(columns, props);
    this._insertActionColumn(columns, props);
    return columns;
  }

  _getSelectableRowKeys(data, selectable) {
    if (this._selectableRowKeysCache) return this._selectableRowKeysCache;

    this._selectableRowKeysCache = data.reduce((keys, rowData, rowIndex) => {
      if (callOrReturn(selectable, { rowData, rowIndex })) {
        keys.push(rowData[this.props.rowKey]);
      }
      // if the row is expandable, get the children's keys recursively
      if (rowData.children) {
        const childrenKeys = this._getSelectableRowKeys(rowData.children, selectable);
        if (childrenKeys.length) keys = keys.concat(childrenKeys);
      }
      return keys;
    }, []);
    return this._selectableRowKeysCache;
  }

  _insertSelectionColumn(columns, props) {
    if (!props.selectable) return;

    columns.unshift({
      key: '__selection__',
      width: DEFAULT_COLUMN_WIDTH,
      flexShrink: 0,
      resizable: false,
      frozen: 'left',
      renderHeader: () => {
        const { selectedRowKeys } = this.state;
        const selectableRowKeys = this._getSelectableRowKeys(props.data, props.selectable);
        const checked = selectedRowKeys.length > 0;
        const partialChecked = checked && selectedRowKeys.length < selectableRowKeys.length;
          return (
              <div/>
          );
          /*return (
              <SelectionBox
                  checked={checked}
                  indeterminate={partialChecked}
                  onChange={() => {
                      const needClear = checked && !partialChecked;
                      const selectedRowKeys = needClear ? [] : [...selectableRowKeys];
                      // if `selectedRowKeys` is uncontrolled, update internal state
                      if (!('selectedRowKeys' in props)) {
                          this.setState({ selectedRowKeys });
                          this.forceUpdateTable();
                      }
                      props.onSelectedRowsChange(selectedRowKeys);
                      props.onSelectAll(!needClear, selectedRowKeys);
                  }}
              />
          );*/
      },
      renderCell: ({ rowData, rowIndex }) => {
        const selectableRowKeys = this._getSelectableRowKeys(props.data, props.selectable);
        const rowKey = rowData[props.rowKey];
        if (!selectableRowKeys.includes(rowKey)) return null;

        const { selectedRowKeys } = this.state;
        return (
          <SelectionBox
            checked={selectedRowKeys.includes(rowKey)}
            onChange={selected => {
              let selectedRowKeys = [...this.state.selectedRowKeys];
              if (selected) {
                selectedRowKeys = [rowKey];
              } else {
                const index = selectedRowKeys.indexOf(rowKey);
                if (index > -1) {
                  selectedRowKeys.splice(index, 1);
                }
              }
              // if `selectedRowKeys` is uncontrolled, update internal state
              if (!('selectedRowKeys' in props)) {
                this.setState({ selectedRowKeys });
                this.forceUpdateTable();
              }
              props.onRowSelect({ selected, rowData, rowIndex });
              props.onSelectedRowsChange(selectedRowKeys);
            }}
          />
        );
      },
      ...props.selectionColumnProps,
    });
  }

  _insertActionColumn(columns, props) {
    if (!props.onSettingsClick && !props.actionOptions) return;

    columns.push({
      key: '__action__',
      width: DEFAULT_COLUMN_WIDTH,
      flexGrow: 1,
      flexShrink: 0,
      align: 'right',
      resizable: false,
      frozen: 'right',
      renderHeader: () =>
        !!props.onSettingsClick && (
          <IconButton className="BaseTable__settings-icon" onClick={props.onSettingsClick}>
            <div className="Used to be svg icon">a</div>
          </IconButton>
        ),
      renderCell: ({ rowData, rowIndex, container }) => {
        const { actionOptions } = props;
        if (!actionOptions) return null;
        //const options = callOrReturn(actionOptions, { rowData, rowIndex });
        return (
            <div className="Used to be Action Button">a</div>
        );
      },
      ...props.actionColumnProps,
    });
  }

  /**
   * See BaseTable#getFrozenRowsHeight
   */
  getFrozenRowsHeight() {
    return this.table ? this.table.getFrozenRowsHeight() : 0;
  }

  /**
   * See BaseTable#getTotalColumnsWidth
   */
  getTotalColumnsWidth() {
    return this.table ? this.table.getTotalColumnsWidth() : 0;
  }

  /**
   * See BaseTable#getTotalRowsHeight
   */
  getTotalRowsHeight() {
    return this.table ? this.table.getTotalRowsHeight() : 0;
  }

  /**
   * See BaseTable#forceUpdateTable
   */
  forceUpdateTable() {
    this.table && this.table.forceUpdateTable();
  }

  /**
   * See BaseTable#measureAllRows
   */
  measureAllRows() {
    this.table && this.table.measureAllRows();
  }

  /**
   * See BaseTable#recomputeRowHeights
   */
  recomputeRowHeights(startRowIndex) {
    this.table && this.table.recomputeRowHeights(startRowIndex);
  }

  /**
   * See BaseTable#scrollToPosition
   */
  scrollToPosition(offset) {
    this.table && this.table.scrollToPosition(offset);
  }

  /**
   * See BaseTable#scrollToTop
   */
  scrollToTop(scrollTop) {
    this.table && this.table.scrollToTop(scrollTop);
  }

  /**
   * See BaseTable#scrollToLeft
   */
  scrollToLeft(scrollLeft) {
    this.table && this.table.scrollToLeft(scrollLeft);
  }

  /**
   * See BaseTable#scrollToRow
   */
  scrollToRow(rowIndex) {
    this.table && this.table.scrollToRow(rowIndex);
  }

  /**
   * See BaseTable#setExpandedRowKeys
   */
  setExpandedRowKeys(expandedRowKeys) {
    this.table && this.table.setExpandedRowKeys(expandedRowKeys);
  }

  /**
   * Set `selectedRowKeys` manually.
   * This method is available only if `selectedRowKeys` is uncontrolled.
   *
   * @param {array} selectedRowKeys
   */
  setSelectedRowKeys(selectedRowKeys) {
    if ('selectedRowKeys' in this.props) return;
    this.setState({
      selectedRowKeys: [...selectedRowKeys],
    });
    this.forceUpdateTable();
  }

  render() {
    const { width, height, maxHeight, onResize } = this.props;
    let tableHeight = height;
    if (!height && maxHeight) {
      tableHeight = 0;
    }
    return (
      <AutoResizer className="BaseTable__container" width={width} height={tableHeight} onResize={onResize}>
        {size => (
          <Table
            ref={this._setTableRef}
            {...this.props}
            width={size.width}
            height={size.height}
            columns={this.state.columns}
            rowClassName={this._rowClassName}
          />
        )}
      </AutoResizer>
    );
  }

  componentWillReceiveProps(nextProps) {
    const state = {};

    if (nextProps.selectable !== this.props.selectable || nextProps.data !== this.props.data) {
      this._selectableRowKeysCache = null;
      state.columns = this._normalizeColumns(nextProps);
    }

    if (
      !state.columns &&
      ((nextProps.columns && nextProps.columns !== this.props.columns) || nextProps.children !== this.props.children)
    ) {
      state.columns = this._normalizeColumns(nextProps);
    }

    // If `selectedRowKeys` is controlled
    if (
      nextProps.selectable &&
      'selectedRowKeys' in nextProps &&
      nextProps.selectedRowKeys !== this.props.selectedRowKeys
    ) {
      state.selectedRowKeys = [...nextProps.selectedRowKeys];
    }

    this.setState(state);
  }

  _setTableRef(ref) {
    this.table = ref;
  }

  _rowClassName({ rowData, rowIndex }) {
    const { rowClassName, rowKey } = this.props;
    const rowClass = rowClassName ? callOrReturn(rowClassName, { rowData, rowIndex }) : '';
    return cn(rowClass, {
      'BaseTable__row--selected': this.state.selectedRowKeys.includes(rowData[rowKey]),
    });
  }
}

MatrixTable.Column = Column;
MatrixTable.SortOrder = SortOrder;

MatrixTable.defaultProps = {
  ...Table.defaultProps,
  rowKey: 'id',
  fixed: false,
  hideHeader: false,
  headerHeight: 50,
  rowHeight: 50,
  defaultSelectedRowKeys: [],

  onResize: noop,
  onRowSelect: noop,
  onSelectedRowsChange: noop,
  onSelectAll: noop,
  onRowAction: noop,
  setContainerRef: noop,
  components: {
    ...Table.defaultProps.components,
    TableCell,
    TableHeaderCell,
    ExpandIcon,
    SortIndicator,
  },
};

MatrixTable.propTypes = {
  ...Table.propTypes,
  /**
   * The width of the table, will be the container's width if not set
   */
  width: PropTypes.number,
  /**
   * The height of the table, will be the container's height if not set
   */
  height: PropTypes.number,
  /**
   * Custom props for the builtin selection column
   */
  selectionColumnProps: PropTypes.object,
  /**
   * Custom props for the builtin action column
   */
  actionColumnProps: PropTypes.object,
  /**
   * A callback funtion for the settings icon click event
   */
  onSettingsClick: PropTypes.func,
  /**
   * An array of ActionButton's options or a callback to return the options
   * The callback is of the shape of `({ rowData, rowIndex }) => array`
   */
  //actionOptions: PropTypes.oneOfType([PropTypes.arrayOf(ActionButton.optionPropType), PropTypes.func]),
  /**
   * A callback function for an action option click event
   * The handler is of the shape of `({ key, rowData, rowIndex }) => *`
   */
  onRowAction: PropTypes.func,
  /**
   * Whether the rows of the table are selectable, could be a callback to decide which row is selectable
   * The callback is of the shape of `({ rowData, rowIndex }) => bool`
   */
  selectable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  /**
   * Default selected row keys when initalize the table
   */
  defaultSelectedRowKeys: PropTypes.arrayOf(PropTypes.string),
  /**
   * Controlled selected row keys
   */
  selectedRowKeys: PropTypes.arrayOf(PropTypes.string),
  /**
   * A callback function when select or unselect a row
   * The handler is of the shape of `({ selected, rowData, rowIndex }) => *`
   */
  onRowSelect: PropTypes.func,
  /**
   * A callback function when the selected row keys changed
   * The handler is of the shape of `(selectedRowKeys) => *`
   */
  onSelectedRowsChange: PropTypes.func,
  /**
   * A callback function when toggle the checkbox in the header of selection column
   * The handler is of the shape of `(selected, selectedRowKeys) => *`
   */
  onSelectAll: PropTypes.func,
  /**
   * A callback function when the size of the table container changed if the width and height are not set
   * The handler is of the shape of `({ width, height }) => *`
   */
  onResize: PropTypes.func,
  /**
   * A callback function to set the ref of the container
   */
  setContainerRef: PropTypes.func,
};

export default MatrixTable;
