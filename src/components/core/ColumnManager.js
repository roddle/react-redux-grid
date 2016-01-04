import React from 'react';
import ActionColumn from '../plugins/gridactions/ActionColumn.jsx';
import { CSS_PREFIX, CLASS_NAMES, SORT_METHODS } from '../../constants/GridConstants';
import { keyFromObject } from '../../util/keygenerator';
import { elementContains } from '../../util/elementContains';
import { hideMenu } from '../../actions/plugins/actioncolumn/MenuActions';
import { doLocalSort } from '../../actions/GridActions';
import sorter from '../../util/sorter';

export default class ColumnManager {

    constructor(plugins, store, events, selModel, editor, columns) {

        const defaults = {
            defaultColumnWidth: `${100 / columns.length}%`,
            minColumnWidth: 10,
            moveable: false,
            resizable: false,
            sortable: {
                enabled: true,
                method: SORT_METHODS.LOCAL
            },

            /**
                @private properties used by components
                    if properties are not available
                    i wouldn't remove these, but theyre
                    values can be flipped
            **/
            defaultResizable: false,
            defaultSortable: true
        };

        const config = plugins.COLUMN_MANAGER
            ? Object.assign(defaults, plugins.COLUMN_MANAGER) : defaults;

        this.plugins = plugins;
        this.store = store;
        this.sorter = sorter;
        this.events = events;
        this.selModel = selModel;
        this.editor = editor;
        this.columns = columns;
        this.config = config;

        document.addEventListener('click', this.setDismissEvent.bind(this));
    }

    setDismissEvent(e) {

        if (!elementContains(e.target, `${CSS_PREFIX}-action-container`)) {
            this.store.dispatch(hideMenu());
        }

    }

    doSort(method, column, direction, dataSource) {
        if (method === SORT_METHODS.LOCAL) {
            this.store(
                doLocalSort(column,
                    this.sorter.sortBy(column.name, direction, dataSource)));
        }

        else {
            // remote sort
        }
    }

    addActionColumn(cells, type, id) {
        const cellsCopy = cells;
        const { GRID_ACTIONS } = this.plugins;
        const actionProps = {
            actions: GRID_ACTIONS,
            store: this.store,
            type,
            columns: this.columns,
            rowId: id,
            editor: this.editor,
            selModel: this.selModel,
            key: keyFromObject(cells, ['row', 'actionhandler'])
        };

        if (GRID_ACTIONS) {
            cells.push(<ActionColumn { ...actionProps } />);
        }

        return cellsCopy;
    }
}