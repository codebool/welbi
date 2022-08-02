import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';

const jQuery = window.jQuery, moment = window.moment;

export default class ResidentList extends Component {
    constructor(props) {
        super(props);
        this.table = React.createRef();
        this.listRef = React.createRef();
    }

    componentDidMount() {
        this.dt = jQuery(this.table.current).DataTable({
            'responsive': true,
            'processing': true,
            'serverSide': false,
            'searching': true,
            'stateSave': false,
            'autoWidth': false,
            'deferRender': true,
            'dom': '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row"<"col-sm-12 col-md-12"tr>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
            'buttons': [
                'copy', 'excel', 'pdf', 'colvis', 'print', 'pageLength'
            ],
            'pageLength': 10,
            'ajax': (data, callback) => {
                fetch("https://welbi.org/api/residents", {
                    method: 'GET',
                    // body: JSON.stringify(data), // data can be string or object
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': "Bearer 88a8ae6c-6b3e-400e-b052-48680a8aff14",
                    }
                }).then(res => res.json()) // if response is json, for text use res.text()
                    .then((response) => {
                        // console.log('Response:', JSON.stringify(response));
                        // console.log('Response:', response)
                        // this.setState({ residents: response, isLoading: false });
                        if (response) {
                            callback({
                                data: response
                            });
                        } else {
                            callback({
                                data: []
                            });
                        }
                    }) // if text, no need for JSON.stringify
                    .catch(error => {
                        console.error('Error:', error);
                        callback({
                            data: []
                        });
                    });
            },
            'order': [[0, 'desc']],
            'columns': [
                { data: 'id', name: 'id', title: 'ID', defaultContent: '-' },
                { data: 'name', name: 'name', title: 'Name' },
                { data: 'firstName', name: 'firstName', title: 'First Name' },
                { data: 'lastName', name: 'lastName', title: 'Last Name' },
                { data: 'preferredName', name: 'preferredName', title: 'Preferred Name' },
                { data: 'status', name: 'status', title: 'Status' },
                { data: 'room', title: 'Room' },
                { data: 'levelOfCare', title: 'Level of Care' },
                { data: 'ambulation', title: 'Ambulation' },
                { data: 'birthDate', title: 'Birth Date' },
                { data: 'moveInDate', title: 'Move In Date' },
                { data: 'created_at', title: 'Created At' },
                { data: 'updated_at', title: 'Updated At' },
                { data: 'attendance', name: 'attendance', title: 'Attendance' },
                { data: null, title: 'Actions' }
            ],
            'columnDefs': [
                {
                    'targets': [0],
                    'visible': true,
                    'searchable': false,
                    'render': (data, type, row, meta) => {
                        //   338,675,114,871,620,180
                        return (data > 2147483647) ? '-' : data;
                    }
                }
            ]
        })
    }

    draw = () => {
        this.dt.api().draw();
    }

    shouldComponentUpdate() {
        return false;
    }


    render() {
        return (
            <>
                <table ref={this.table} className='table table-striped' />
            </>
        )
    }
}