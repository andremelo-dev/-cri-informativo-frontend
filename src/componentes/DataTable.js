import React from 'react'
import { Component } from 'react'
import MUIDataTable from "mui-datatables";
import textLabel from './DataTable-PT';
import '../componentes/css/datatable.css';

export class DataTable extends Component {

    render() {
        const title = this.props.title || "Lista";
        const columns = this.props.columns;
        const data = this.props.data;

        const options = {
            filterType: "textField",
            responsive: "stacked",
            rowsPerPageOptions: [10],
            rowsPerPage: 10,
            searchPlaceholder: "Pesquisar",
            selectableRows:false,
            textLabels:textLabel
        };

        return (
            <MUIDataTable
                title={title}
                data={data}
                columns={columns}
                options={options}
            />
        )
    }
}