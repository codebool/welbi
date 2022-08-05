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
            'dom': '<"row"<"col-sm-3"B><"col-sm-7"<"toolbar"><"clear">><"col-sm-2"f>>' +
                '<"row"<"col-sm-12"tr>>' +
                '<"row"<"col-sm-5"i><"col-sm-7"p>>',
            'buttons': [
                'pageLength',
                'pdf',
                'excel'
            ],
            'pageLength': 10,
            'lengthMenu': [[10, 20, 25, 50, -1], [10, 20, 25, 50, 'All']],
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
            'order': [[0, 'asc']],
            'columns': [
                { data: 'id', name: 'id', title: 'ID' },
                { data: 'name', name: 'name', title: 'Name' },
                { data: 'firstName', name: 'firstName', title: 'First Name' },
                { data: 'lastName', name: 'lastName', title: 'Last Name' },
                { data: 'preferredName', name: 'preferredName', title: 'Preferred Name' },
                { data: 'status', name: 'status', title: 'Status' },
                { data: 'room', name: 'room', title: 'Room' },
                { data: 'levelOfCare', name: 'levelOfCare', title: 'Level of Care' },
                { data: 'ambulation', name: 'ambulation', title: 'Ambulation' },
                { data: 'author', name: 'author', title: 'Author' },
                { data: 'birthDate', name: 'birthDate', title: 'Birth Date' },
                { data: 'moveInDate', name: 'moveInDate', title: 'Move In Date' },
                { data: 'createdAt', name: 'createdAt', title: 'Created At' },
                { data: 'updatedAt', name: 'updatedAt', title: 'Updated At' },
                { data: 'attendance', name: 'attendance', title: 'Attendance' },
                { data: null, title: 'Actions' }
            ],
            'columnDefs': [
                {
                    'targets': [4, 5],
                    'visible': true,
                    'searchable': true,
                    'render': (data, type, row, meta) => {
                        return (data) ? data : '-';
                    }
                },
                {
                    'targets': [9],
                    'visible': true,
                    'searchable': true,
                    'render': (data, type, row, meta) => {
                        return (data) ? data : '-';
                    }
                },
                {
                    'targets': [10, 11, 12, 13],
                    'visible': true,
                    'searchable': false,
                    'render': function (data) {
                        if (data) {
                            const result = Object.entries(data);
                            for (const [key, value] of result) {
                                if (value) {
                                    return moment(value).format('YYYY-MM-DD HH:mm:ssZ');
                                }
                            }
                        }
                        return {};
                    }
                },
                {
                    'targets': [14],
                    'visible': true,
                    'searchable': false,
                    'render': (data, type, row, meta) => {
                        const listItems = data.map((i) => <li key={i.programId}><i><small><b>Status:</b> {i.status} <b>Program ID:</b> {i.programId} <b>Author:</b> {i.author ? i.author : ''}</small></i></li>);

                        return ReactDOMServer.renderToStaticMarkup(
                            <div>
                                <ol>{listItems}</ol>
                            </div>)
                    }
                },
                {
                    "targets": [15],
                    "searchable": false,
                    "orderable": false,
                    "className": "all",
                    "render": function (data, type, row, meta) {
                        return ReactDOMServer.renderToStaticMarkup(
                            <div className="btn-group" role="group" aria-label="Button group with nested dropdown" data-rownum={meta.row}>
                                <button type="button" className="btn btn-secondary action-edit" id="btnGroup"> Edit</button>
                            </div>
                        )
                    }
                }
            ]
        });

        jQuery(this.table.current).on('click', '.action-edit', {}, (e) => {
            e.preventDefault();
            let rowIndex = e.target.closest('[data-rownum]').getAttribute('data-rownum');
            let row = this.dt.row(rowIndex).data();
            this.props.history.push(`/resident/${row.id}/edit`);
        });
    }

    draw = () => {
        this.dt.api().draw();
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillUnmount() {
        jQuery(this.table.current).off('click', '.action-edit');
        jQuery(this.table.current).DataTable().destroy(true);
    }

    render() {
        return (
            <div className='mt-3'>
                <table ref={this.table} className='table table-striped' />
            </div>
        )
    }
}
