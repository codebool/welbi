import React, { Component, PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

const moment = window.moment;

class AttendanceEdit extends PureComponent {
    state = {
        statusValue: '',
        programIdValue: '',
        authorValue: '',
        error: '',
        loading: false,
        showInput: false
    }

    static defaultProps = {
        programs: [],
        allPrograms: [],
        allStatus: []
    }

    handleDeleteProgram = (program) => () => {
        const { programs, change } = this.props;
        const newPrograms = programs.filter(oldProgram => oldProgram.programId !== program.programId);
        change('programs', newPrograms);
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.setState({ showInput: false });
    }

    handleStatusChange = (e) => {
        e.preventDefault();
        this.setState({ statusValue: e.target.value, error: '' });
    }

    handleProgramIdChange = (e) => {
        e.preventDefault();
        this.setState({ programIdValue: e.target.value, error: '' });
    }

    handleAuthorChange = (e) => {
        e.preventDefault();
        this.setState({ authorValue: e.target.value, error: '' });
    }

    loadPrograms = () => {
        this.setState({ loading: true });
        this.props.change('allStatus', [
            { value: 'Active', label: 'Active' },
            { value: 'Passive', label: 'Passive' },
            { value: 'Declined', label: 'Declined' },
            { value: 'Undefined', label: 'Undefined' }
        ]);

        fetch("https://welbi.org/api/programs", {
            method: 'GET',
            // body: JSON.stringify(data), // data can be string or object
            headers: {
                'Content-type': 'application/json',
                'Authorization': "Bearer 88a8ae6c-6b3e-400e-b052-48680a8aff14",
            }
        }).then(res => res.json()) // if response is json, for text use res.text()
            .then((response) => {
                this.props.change('allPrograms', response);
                this.setState({ loading: false });
            }) // if text, no need for JSON.stringify
            .catch((e) => {
                console.log(e);
                this.setState({ loading: false });
            });
    }

    handleShowProgramInput = () => {
        this.setState({
            showInput: true,
            error: '',
            statusValue: '',
            programIdValue: '',
            authorValue: ''
        });
        this.loadPrograms();
    }

    handleProgramSubmit = (e) => {
        e.preventDefault();
        const { change, programs } = this.props;
        const status = this.state.statusValue;
        const programId = this.state.programIdValue;
        const author = this.state.authorValue;
        const programObject = {
            status: status,
            programId: programId,
            author: author
        }

        if (programs.length && programs.map(program => program.programId).includes(programId)) {
            this.setState({ error: 'Program already exists' });
        }
        else if (status === '') {
            this.setState({ error: 'Status is required' });
        }
        else if (programId === '') {
            this.setState({ error: 'Program ID is required' });
        }
        else if (programObject) {
            change('programs', [...programs, programObject]);
            this.setState({ showInput: false });
        }
    }

    render() {
        const { programs, allPrograms, allStatus } = this.props;
        const { showInput, error } = this.state;
        return (
            <>
                <label style={{ marginBottom: '0' }}>
                    <strong>Attendances</strong>
                    {error ? <small className='text-danger ml-3'>{this.state.error}</small> : null}
                </label>
                <div className='form-group form-inline'>
                    {(programs && programs.length) ? programs.map((item, index) =>
                        <span className='bg-light text-dark rounded'
                            key={index}
                            style={{ padding: '0.4em', margin: '0.5em 0.5em 0 0' }}
                        >
                            <span style={{ cursor: 'pointer' }}>
                                <b>Status: </b>{item.status} <br /><b>ProgramId: </b>{item.programId} {(item.author) ? <><br /><b>Author: </b>{item.author}</> : null}
                            </span> <i className='fas fa-times ml-2 pr-1'
                                onClick={this.handleDeleteProgram(item)}
                                title='Delete'
                                style={{ cursor: 'pointer' }} />
                        </span>)
                        : null}
                    <div className='form-group mt-2'>
                        {showInput ?
                            <div className='form-group'>
                                <input className='form-control'
                                    type='text'
                                    list='program-status'
                                    onChange={this.handleStatusChange}
                                    disabled={this.state.loading}
                                    value={this.state.statusValue}
                                    placeholder='select/enter a status'
                                />
                                <datalist id='program-status'>
                                    {allStatus.map((item, index) => <option key={index} value={item.value} />)}
                                </datalist>

                                <label className="form-control-label"></label>
                                <select name="programs" id="programs" className="form-control" value={this.state.programIdValue} onChange={this.handleProgramIdChange}>
                                    <option value="" disabled hidden>Select a program</option>
                                    {allPrograms ? allPrograms.map((item, index) => {
                                        return <option key={index} value={item.id}>{item.id} - {item.name}</option>
                                    }) : null}
                                </select>


                                <label className="form-control-label"></label>
                                <input name="author" type="text" onChange={this.handleAuthorChange} className="form-control" placeholder="enter the author" />


                                {this.state.loading ?
                                    <div style={{ margin: '0.2em 0 0 0.5em' }}>
                                        <i className='fas fa-spinner fa-pulse text-warning' style={{ fontSize: '2rem' }} />
                                    </div>
                                    :
                                    <button className='btn btn-success ml-1' type='button' onClick={this.handleProgramSubmit}>
                                        <i className='fas fa-check' title='Confirm' />
                                    </button>
                                }
                                {!this.state.loading ?
                                    <button className='btn btn-danger ml-1' type='button' onClick={this.handleCancel}>
                                        <i className='fas fa-times' title='Cancel' />
                                    </button>
                                    : null}
                            </div>
                            :
                            <button className='btn btn-secondary' type='button' onClick={this.handleShowProgramInput}>
                                <i className='fas fa-plus'
                                    title='Add New Attendance'
                                />
                            </button>
                        }
                    </div>
                </div>
            </>
        )
    }
}

class ResidentEdit extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id ? this.props.match.params.id : '',
            name: '',
            firstName: '',
            lastName: '',
            preferredName: '',
            status: '',
            room: '',
            levelOfCare: '',
            ambulation: '',
            author: '',
            birthDate: '',
            moveInDate: '',
            createdAt: '',
            updatedAt: '',
            attendance: [],
            dirty: false
        };
    }

    parseObject = (obj) => {
        const result = Object.entries(obj);
        for (const [key, value] of result) {
            if (value) {
                return value;
            }
        }
        return {};
    }

    loadResident = (id) => {
        const { initialize } = this.props;
        fetch("https://welbi.org/api/residents", {
            method: 'GET',
            // body: JSON.stringify(data), // data can be string or object
            headers: {
                'Content-type': 'application/json',
                'Authorization': "Bearer 88a8ae6c-6b3e-400e-b052-48680a8aff14",
            }
        }).then(res => res.json()) // if response is json, for text use res.text()
            .then((response) => {
                response.find((response) => {
                    if (response.id === id) {
                        initialize({
                            programs: response.attendance
                        });
                        this.setState({
                            name: response.name,
                            firstName: response.firstName,
                            lastName: response.lastName,
                            preferredName: response.preferredName,
                            status: response.status,
                            room: response.room,
                            levelOfCare: response.levelOfCare ? response.levelOfCare : '',
                            ambulation: response.ambulation ? response.ambulation : '',
                            author: response.author ? response.author : '',
                            birthDate: this.parseObject(response.birthDate),
                            moveInDate: this.parseObject(response.moveInDate),
                            createdAt: this.parseObject(response.createdAt),
                            updatedAt: this.parseObject(response.updatedAt),
                            attendance: response.attendance,
                        });
                    }
                });
            }) // if text, no need for JSON.stringify
            .catch(error => console.error('Error:', error));
    }

    componentDidMount() {
        this._isMounted = true;
        const id = this.props.match.params.id;
        if (id) {
            this.setState({
                id: id
            });

            this.loadResident(id);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleChange = (event, callback) => {
        let fieldDetails = { dirty: true };

        fieldDetails[event.target.name] = event.target.value;
        this.setState(fieldDetails, () => {
            if (typeof callback == 'function') {
                callback();
            }
        });
    }

    handleFieldChange = (field, value) => {
        this.props.change(field, value);

        if (field === 'programs') {
            this.setState({
                dirty: true
            });
        }
    }

    handleReset = (e) => {
        e.preventDefault();

        const { initialize, formValues } = this.props;
        const { allPrograms, allStatus } = formValues ? formValues : {};

        let id = this.props.match.params.id;

        if (id) {
            fetch("https://welbi.org/api/residents", {
                method: 'GET',
                // body: JSON.stringify(data), // data can be string or object
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': "Bearer 88a8ae6c-6b3e-400e-b052-48680a8aff14",
                }
            }).then(res => res.json()) // if response is json, for text use res.text()
                .then((response) => {
                    response.find((response) => {
                        if (response.id === id) {
                            initialize({
                                programs: response.attendance,
                                allPrograms: allPrograms,
                                allStatus: allStatus
                            });
                            this.setState({
                                name: response.name,
                                firstName: response.firstName,
                                lastName: response.lastName,
                                preferredName: response.preferredName,
                                status: response.status,
                                room: response.room,
                                levelOfCare: response.levelOfCare ? response.levelOfCare : '',
                                ambulation: response.ambulation ? response.ambulation : '',
                                author: response.author ? response.author : '',
                                birthDate: this.parseObject(response.birthDate),
                                moveInDate: this.parseObject(response.moveInDate),
                                createdAt: this.parseObject(response.createdAt),
                                updatedAt: this.parseObject(response.updatedAt),
                                attendance: response.attendance,
                            });

                        }
                    });
                }) // if text, no need for JSON.stringify
                .catch(error => console.error('Error:', error));
            this.setState({
                dirty: false
            })
        } else {
            this.setState({
                name: '',
                firstName: '',
                lastName: '',
                preferredName: '',
                status: '',
                room: '',
                levelOfCare: '',
                ambulation: '',
                author: '',
                birthDate: '',
                moveInDate: '',
                createdAt: '',
                updatedAt: '',
                attendance: [],
                dirty: false
            });
            initialize({
                programs: [],
                allPrograms: allPrograms,
                allStatus: allStatus
            })
        }
    }

    componentWillUnmount() {
        this.props.reset();
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { id, name, firstName, lastName, preferredName, status, room, levelOfCare, ambulation, author, birthDate, moveInDate, createdAt, updatedAt } = this.state;
        const { programs } = this.props.formValues;
        const params = { id, name, firstName, lastName, preferredName, status, room, levelOfCare, ambulation, author, birthDate, moveInDate, createdAt, updatedAt, programs };
        
        const answer = window.confirm("Are you sure you want to save?");
        if (answer) {
            fetch("https://welbi.org/api/residents", {
                method: 'POST',
                body: JSON.stringify(params), // data can be string or object
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': "Bearer 88a8ae6c-6b3e-400e-b052-48680a8aff14",
                }
            }).then(res => res.json()) // if response is json, for text use res.text()
                .then((response) => {
                    this.setState({
                        dirty: false
                    });
                    if (response.id) {
                        this.props.history.push('/resident/' + response.id + '/edit');
                        this.setState({
                            id: response.id
                        });
                    }
                    else {
                        this.props.history.push('/resident/');
                    }
                }) // if text, no need for JSON.stringify
                .catch(error => console.error('Error:', error));
        } else {
            console.log("Data was not saved");
        }
    }


    render() {
        const { formValues } = this.props;
        const { id, name, firstName, lastName, preferredName, status, room, levelOfCare, ambulation, author, birthDate, moveInDate, createdAt, updatedAt, attendance, dirty } = this.state;
        const { programs, allPrograms, allStatus } = formValues ? formValues : {};

        return (
            <div className="card" id="card-new">
                <div className="card-body">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-row">
                            {(id) ?
                                <div className=" form-group col-md-12">
                                    <label>Edit Resident Id : </label>&nbsp;&nbsp;
                                    <strong>{id}</strong>
                                </div>
                                :
                                <div className=" form-group col-md-12">
                                    <label>Add New Resident</label>&nbsp;&nbsp;
                                </div>
                            }

                            <div className="form-group col-md-6">
                                <label>Name</label>
                                <input name="name" type="text" onChange={this.handleChange} value={name} className="form-control" required/>
                            </div>

                            <div className="form-group col-md-6">
                                <label>First Name</label>
                                <input name="firstName" type="text" onChange={this.handleChange} value={firstName} className="form-control" required/>
                            </div>

                            <div className="form-group col-md-6">
                                <label>Last Name</label>
                                <input name="lastName" type="text" onChange={this.handleChange} value={lastName} className="form-control" required/>
                            </div>

                            <div className="form-group col-md-6">
                                <label>Preferred Name</label>
                                <input name="preferredName" type="text" onChange={this.handleChange} value={preferredName} className="form-control" />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Status</label>
                                <select name="status" className="form-control" id="inputStatus" value={status} onChange={this.handleChange}>
                                    <option value=""></option>
                                    <option value="HERE">HERE</option>
                                    <option value="LOA">LOA</option>
                                    <option value="ISOLATION">ISOLATION</option>
                                </select>
                            </div>

                            <div className="form-group col-md-6">
                                <label>Room</label>
                                <input name="room" type="text" onChange={this.handleChange} value={room} className="form-control" required/>
                            </div>
                           
                            <div className="form-group col-md-6">
                                <label>Level Of Care</label>
                                <select name="levelOfCare" className="form-control" id="inputLevelOfCare" value={levelOfCare} onChange={this.handleChange} required>
                                    <option value=""></option>
                                    <option value="INDEPENDENT">INDEPENDENT</option>
                                    <option value="ASSISTED">ASSISTED</option>
                                    <option value="MEMORY">MEMORY</option>
                                    <option value="LONGTERM">LONGTERM</option>
                                </select>
                            </div>
                            
                            <div className="form-group col-md-6">
                                <label>Ambulation</label>
                                <select name="ambulation" className="form-control" id="inputAmbulation" value={ambulation} onChange={this.handleChange} required>
                                    <option value=""></option>
                                    <option value="NOLIMITATIONS">NOLIMITATIONS</option>
                                    <option value="CANE">CANE</option>
                                    <option value="WALKER">WALKER</option>
                                    <option value="WHEELCHAIR">WHEELCHAIR</option>
                                </select>
                            </div>

                            <div className="form-group col-md-6">
                                <label>Author</label>
                                <input name="author" type="text" onChange={this.handleChange} value={author} className="form-control" />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Birth Date</label>
                                <input name="birthDate" type="datetime-local" onChange={this.handleChange} value={moment(birthDate).format('YYYY-MM-DDTkk:mm')} className="form-control" required/>
                            </div>

                            <div className="form-group col-md-6">
                                <label>Move In Date</label>
                                <input name="moveInDate" type="datetime-local" onChange={this.handleChange} value={moment(moveInDate).format('YYYY-MM-DDTkk:mm')} className="form-control" required/>
                            </div>

                            {(id) ?
                                <>
                                    <div className="form-group col-md-6">
                                        <label>Created At</label>
                                        <input name="createdAt" type="text" disabled onChange={this.handleChange} value={moment(createdAt).format('YYYY-MM-DD, hh:mm:ss A')} className="form-control" />
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label>Updated At</label>
                                        <input name="updatedAt" type="text" disabled onChange={this.handleChange} value={moment(updatedAt).format('YYYY-MM-DD, hh:mm:ss A')} className="form-control" />
                                    </div>
                                </>
                                : ''}

                            <div className='form-group col-md-12'>
                                <Field
                                    name='attendanceEdit'
                                    programs={programs}
                                    allPrograms={allPrograms}
                                    allStatus={allStatus}
                                    change={this.handleFieldChange}
                                    component={AttendanceEdit}
                                />
                            </div>

                            <div className="form-group col-md-12">
                                <div className='col-12 text-right'>
                                    {(dirty) ? <button className='btn btn-danger mr-3' type='button' onClick={this.handleReset}>
                                        <i className='fas fa-undo' /> Reset
                                    </button> : <button className='btn btn-danger mr-3' type='button' disabled>
                                        <i className='fas fa-undo' /> Reset
                                    </button>}
                                    <button className='btn btn-success' type='submit' value={"Submit"}>
                                        <i className='fas fa-save' /> Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

ResidentEdit = reduxForm({
    form: 'attendanceEdit',
    enableReinitialize: true,
    destroyOnUnmount: true,
    forceUnregisterOnUnmount: true,
    keepDirtyOnReinitialize: true,
    initialValues: {
        programs: [],
        allPrograms: [],
        allStatus: []
    }
})(ResidentEdit);

const mapStateToProps = (state) => {
    return {
        formValues: state.form.attendanceEdit ? state.form.attendanceEdit.values : null
    }
};

export default connect(mapStateToProps)(ResidentEdit);