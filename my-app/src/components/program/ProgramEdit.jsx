import React, { Component, PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const moment = window.moment;

const levelOfCareOptions = [
    { label: "INDEPENDENT", value: "INDEPENDENT" },
    { label: "ASSISTED", value: "ASSISTED" },
    { label: "MEMORY", value: "MEMORY" },
    { label: "LONGTERM", value: "LONGTERM" }
]

const animatedComponents = makeAnimated();

class AttendanceEdit extends PureComponent {
    state = {
        statusValue: '',
        residentIdValue: '',
        authorValue: '',
        error: '',
        loading: false,
        showInput: false
    }

    static defaultProps = {
        residents: [],
        allResidents: [],
        allStatus: []
    }

    handleDeleteResident = (resident) => () => {
        const { residents, change } = this.props;
        const newResidents = residents.filter(oldResident => oldResident.residentId !== resident.residentId);
        change('residents', newResidents);
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.setState({ showInput: false });
    }

    handleStatusChange = (e) => {
        e.preventDefault();
        this.setState({ statusValue: e.target.value, error: '' });
    }

    handleResidentIdChange = (e) => {
        e.preventDefault();
        this.setState({ residentIdValue: e.target.value, error: '' });
    }

    handleAuthorChange = (e) => {
        e.preventDefault();
        this.setState({ authorValue: e.target.value, error: '' });
    }

    loadResidents = () => {
        this.setState({ loading: true });
        this.props.change('allStatus', [
            { value: 'Active', label: 'Active' },
            { value: 'Passive', label: 'Passive' },
            { value: 'Declined', label: 'Declined' },
            { value: 'Undefined', label: 'Undefined' }
        ]);

        fetch("https://welbi.org/api/residents", {
            method: 'GET',
            // body: JSON.stringify(data), // data can be string or object
            headers: {
                'Content-type': 'application/json',
                'Authorization': "Bearer 88a8ae6c-6b3e-400e-b052-48680a8aff14",
            }
        }).then(res => res.json()) // if response is json, for text use res.text()
            .then((response) => {
                this.props.change('allResidents', response);
                this.setState({ loading: false });
            }) // if text, no need for JSON.stringify
            .catch((e) => {
                console.log(e);
                this.setState({ loading: false });
            });
    }

    handleShowResidentInput = () => {
        this.setState({
            showInput: true,
            error: '',
            statusValue: '',
            residentIdValue: '',
            authorValue: ''
        });
        this.loadResidents();
    }

    handleResidentSubmit = (e) => {
        e.preventDefault();
        const { change, residents } = this.props;
        const status = this.state.statusValue;
        const residentId = this.state.residentIdValue;
        const author = this.state.authorValue;
        const residentObject = {
            status: status,
            residentId: residentId,
            author: author
        }

        if (residents.length && residents.map(resident => resident.residentId).includes(residentId)) {
            this.setState({ error: 'Resident already exists' });
        }
        else if (status === '') {
            this.setState({ error: 'Status is required' });
        }
        else if (residentId === '') {
            this.setState({ error: 'Resident ID is required' });
        }
        else if (residentObject) {
            change('residents', [...residents, residentObject]);
            this.setState({ showInput: false });
        }
    }

    render() {
        const { residents, allResidents, allStatus } = this.props;
        const { showInput, error } = this.state;
        return (
            <>
                <label style={{ marginBottom: '0' }}>
                    <strong>Attendances</strong>
                    {error ? <small className='text-danger ml-3'>{this.state.error}</small> : null}
                </label>
                <div className='form-group form-inline'>
                    {(residents && residents.length) ? residents.map((item, index) =>
                        <span className='bg-light text-dark rounded'
                            key={index}
                            style={{ padding: '0.4em', margin: '0.5em 0.5em 0 0' }}
                        >
                            <span style={{ cursor: 'pointer' }}>
                                <b>Status: </b>{item.status} <br /><b>ResidentId: </b>{item.residentId} {(item.author) ? <><br /><b>Author: </b>{item.author}</> : null}
                            </span> <i className='fas fa-times ml-2 pr-1'
                                onClick={this.handleDeleteResident(item)}
                                title='Delete'
                                style={{ cursor: 'pointer' }} />
                        </span>)
                        : null}
                    <div className='form-group mt-2'>
                        {showInput ?
                            <div className='form-group'>
                                <input className='form-control'
                                    type='text'
                                    list='resident-status'
                                    onChange={this.handleStatusChange}
                                    disabled={this.state.loading}
                                    value={this.state.statusValue}
                                    placeholder='select/enter a status'
                                />
                                <datalist id='resident-status'>
                                    {allStatus.map((item, index) => <option key={index} value={item.value} />)}
                                </datalist>

                                <label className="form-control-label"></label>
                                <select name="residents" id="residents" className="form-control" value={this.state.residentIdValue} onChange={this.handleResidentIdChange}>
                                    <option value="" disabled hidden>Select a resident</option>
                                    {allResidents ? allResidents.map((item, index) => {
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
                                    <button className='btn btn-success ml-1' type='button' onClick={this.handleResidentSubmit}>
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
                            <button className='btn btn-secondary' type='button' onClick={this.handleShowResidentInput}>
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

class ProgramEdit extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id ? this.props.match.params.id : '',
            name: '',
            location: '',
            allDay: false,
            start: '',
            end: '',
            tags: '',
            dimension: '',
            facilitators: '',
            levelOfCare: [],
            hobbies: [],
            isRepeated: false,
            attendance: [],
            dirty: false
        };
    }

    loadProgram = (id) => {
        const { initialize } = this.props;
        fetch("https://welbi.org/api/programs", {
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
                            residents: response.attendance
                        });
                        this.setState({
                            name: response.name,
                            location: response.location,
                            allDay: response.allDay,
                            start: response.start,
                            end: response.end,
                            tags: response.tags ? response.tags : '',
                            dimension: response.dimension ? response.dimension : '',
                            facilitators: response.facilitators ? response.facilitators : '',
                            levelOfCare: response.levelOfCare ? this.addObjToArr(response.levelOfCare) : [],
                            hobbies: response.hobbies ? response.hobbies : [],
                            isRepeated: response.isRepeated,
                            attendance: response.attendance
                        });
                    }
                });
            }) // if text, no need for JSON.stringify
            .catch(error => console.error('Error:', error));
    }

    addObjToArr = (arr) => {
        const result = [];

        arr.map((item) => {
            const obj = {};
            obj["label"] = item;
            obj["value"] = item;
            result.push(obj);
        });

        return result;
    }

    componentDidMount() {
        this._isMounted = true;
        const id = this.props.match.params.id;
        if (id) {
            this.setState({
                id: id
            });

            this.loadProgram(id);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.reset();
    }

    handleChange = (event, callback) => {
        let fieldDetails = { dirty: true };

        if (event.target.name === 'hobbies' || event.target.name === 'facilitators' || event.target.name === 'tags') {
            fieldDetails[event.target.name] = event.target.value.split(',');
        }
        else if (event.target.name === 'isRepeated' || event.target.name === 'allDay') {
            if (event.target.value === 'true') {
                fieldDetails[event.target.name] = true;
            }
            else {
                fieldDetails[event.target.name] = false;
            }
        }
        else {
            fieldDetails[event.target.name] = event.target.value;
        }

        this.setState(fieldDetails, () => {
            if (typeof callback == 'function') {
                callback();
            }
        });
    }

    handleLevelOfCareChange = (value) => {
        this.setState({
            levelOfCare: value,
            dirty: true
        }, () => {
            console.log(this.state.levelOfCare);
            console.log(this.state.dirty);
        });
    }

    handleFieldChange = (field, value) => {
        this.props.change(field, value);

        if (field === 'residents') {
            this.setState({
                dirty: true
            });
        }
    }

    handleReset = (e) => {
        e.preventDefault();

        const { initialize, formValues } = this.props;
        const { allResidents, allStatus } = formValues ? formValues : {};

        let id = this.props.match.params.id;

        if (id) {
            fetch("https://welbi.org/api/programs", {
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
                                residents: response.attendance,
                                allResidents: allResidents,
                                allStatus: allStatus
                            });
                            this.setState({
                                name: response.name,
                                location: response.location,
                                allDay: response.allDay,
                                start: response.start,
                                end: response.end,
                                tags: response.tags ? response.tags : '',
                                dimension: response.dimension ? response.dimension : '',
                                facilitators: response.facilitators ? response.facilitators : '',
                                levelOfCare: response.levelOfCare ? this.addObjToArr(response.levelOfCare) : [],
                                hobbies: response.hobbies ? response.hobbies : [],
                                isRepeated: response.isRepeated,
                                attendance: response.attendance
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
                location: '',
                allDay: false,
                start: '',
                end: '',
                tags: '',
                dimension: '',
                facilitators: '',
                levelOfCare: [],
                hobbies: [],
                isRepeated: false,
                attendance: [],
                dirty: false
            });
            initialize({
                residents: [],
                allResidents: allResidents,
                allStatus: allStatus
            });
        }
    }

    attendResidentToProgram = (residents, programId) => {
        if (residents.length) {
            residents.map((resident) => {
                fetch("https://welbi.org/api/programs/" + programId + "/attend", {
                    method: 'POST',
                    body: JSON.stringify(resident), // data can be string or object
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': "Bearer 88a8ae6c-6b3e-400e-b052-48680a8aff14",
                    }
                }).then(res => res.json()) // if response is json, for text use res.text()
                    .then((response) => {
                        this.setState({
                            dirty: false
                        });
                    }) // if text, no need for JSON.stringify
                    .catch(error => console.error('Error:', error));
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { id, name, location, allDay, start, end, tags, dimension, facilitators, hobbies, isRepeated } = this.state;
        const levelOfCare = this.state.levelOfCare.map((item) => {
            return item.value;
        })

        const { residents } = this.props.formValues;
        const params = { id, name, location, allDay, start, end, tags, dimension, facilitators, levelOfCare, hobbies, isRepeated, residents };

        const answer = window.confirm("Are you sure you want to save?");
        if (answer) {
            // this is the API only for creating new program, will need one which for updating the existing program
            fetch("https://welbi.org/api/programs", {
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
                        this.setState({
                            id: response.id
                        });
                        this.attendResidentToProgram(residents, response.id);
                    }
                    this.props.history.push('/program/');
                }) // if text, no need for JSON.stringify
                .catch(error => console.error('Error:', error));
        } else {
            console.log("Data was not saved");
        }
    }


    render() {
        const { formValues } = this.props;
        const { id, name, location, allDay, start, end, tags, dimension, facilitators, levelOfCare, hobbies, isRepeated, dirty } = this.state;
        const { residents, allResidents, allStatus } = formValues ? formValues : {};

        return (
            <div className="card" id="card-new">
                <div className="card-body">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-row">
                            {(id) ?
                                <div className=" form-group col-md-12">
                                    <label>Edit Program Id : </label>&nbsp;&nbsp;
                                    <strong>{id}</strong>
                                </div>
                                :
                                <div className=" form-group col-md-12">
                                    <label>Add New Program</label>&nbsp;&nbsp;
                                </div>
                            }

                            <div className="form-group col-md-6">
                                <label>Name</label>
                                <input name="name" type="text" onChange={this.handleChange} value={name} className="form-control" required />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Location</label>
                                <input name="location" type="text" onChange={this.handleChange} value={location} className="form-control" required />
                            </div>

                            <div className="form-group col-md-6">
                                <label>All Day?</label>
                                <select name="allDay" className="form-control" id="inputAllDay" value={allDay} onChange={this.handleChange} required>
                                    <option value="false">false</option>
                                    <option value="true">true</option>
                                </select>
                            </div>

                            <div className="form-group col-md-6">
                                <label>Is Repeated?</label>
                                <select name="isRepeated" className="form-control" id="inputIsRepeated" value={isRepeated} onChange={this.handleChange} required>
                                    <option value="false">false</option>
                                    <option value="true">true</option>
                                </select>
                            </div>

                            <div className="form-group col-md-6">
                                <label>Start</label>
                                <input name="start" type="datetime-local" onChange={this.handleChange} value={moment(start).format('YYYY-MM-DDTkk:mm')} className="form-control" required />
                            </div>

                            <div className="form-group col-md-6">
                                <label>End</label>
                                <input name="end" type="datetime-local" onChange={this.handleChange} value={moment(end).format('YYYY-MM-DDTkk:mm')} className="form-control" required />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Dimension</label>
                                <input name="dimension" type="text" onChange={this.handleChange} value={dimension} className="form-control" required />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Tags</label>
                                <input name="tags" type="text" onChange={this.handleChange} value={tags} className="form-control" placeholder="tag1,tag2,tag3" required />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Facilitators</label>
                                <input name="facilitators" type="text" onChange={this.handleChange} value={facilitators} className="form-control" placeholder="facilitator1,facilitator2,facilitator3" required />
                            </div>

                             <div className="form-group col-md-6">
                                <label>Hobbies</label>
                                <input name="hobbies" type="text" onChange={this.handleChange} value={hobbies} className="form-control" placeholder="hobbies1, hobbies2, hobbies3" required />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Level Of Care</label>
                                <Select
                                        name="levelOfCare"
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        value={levelOfCare}
                                        isMulti
                                        options={levelOfCareOptions}
                                        onChange={this.handleLevelOfCareChange}
                                    />
                            </div>

                            <div className='form-group col-md-12'>
                                <Field
                                    name='attendanceEdit'
                                    residents={residents}
                                    allResidents={allResidents}
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
                                    <button className='btn btn-success' type='submit' value={"Submit"} disabled={this.state.id}>
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

ProgramEdit = reduxForm({
    form: 'attendanceEdit',
    enableReinitialize: true,
    destroyOnUnmount: true,
    forceUnregisterOnUnmount: true,
    keepDirtyOnReinitialize: true,
    initialValues: {
        residents: [],
        allResidents: [],
        allStatus: []
    }
})(ProgramEdit);

const mapStateToProps = (state) => {
    return {
        formValues: state.form.attendanceEdit ? state.form.attendanceEdit.values : null
    }
};

export default connect(mapStateToProps)(ProgramEdit);