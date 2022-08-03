import React, { Component } from 'react';

export default class ResidentEdit extends Component {
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
            birthDate: '',
            moveInDate: '',
            createdAt: '',
            updatedAt: '',
            attendance: '',
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
                        console.log(response.attendance);
                        this.setState({
                            name: response.name,
                            firstName: response.firstName,
                            lastName: response.lastName,
                            preferredName: response.preferredName,
                            status: response.status,
                            room: response.room,
                            levelOfCare: response.levelOfCare,
                            ambulation: response.ambulation,
                            birthDate: this.parseObject(response.birthDate),
                            moveInDate: this.parseObject(response.moveInDate),
                            createdAt: this.parseObject(response.createdAt),
                            updatedAt: this.parseObject(response.updatedAt),
                            attendance: this.parseObject(response.attendance),
                        });
                    }
                });
            }) // if text, no need for JSON.stringify
            .catch(error => console.error('Error:', error));
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        if (id) {
            this.setState({
                id: id
            });

            this.loadResident(id);
        }
    }


    render() {
        const { id, name, firstName, lastName, preferredName, status, room, levelOfCare, ambulation, birthDate, moveInDate, createdAt, updatedAt, attendance, dirty } = this.state;
        
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
                                <input name="name" type="text" onChange={this.handleChange} value={name} className="form-control" />
                            </div>

                            <div className="form-group col-md-6">
                                <label>First Name</label>
                                <input name="firstName" type="text" onChange={this.handleChange} value={firstName} className="form-control" />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Last Name</label>
                                <input name="lastName" type="text" onChange={this.handleChange} value={lastName} className="form-control" />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Preferred Name</label>
                                <input name="lastName" type="text" onChange={this.handleChange} value={lastName} className="form-control" />
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
                                <input name="room" type="text" onChange={this.handleChange} value={room} className="form-control" />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Level Of Care</label>
                                <input name="levelOfCare" type="text" onChange={this.handleChange} value={levelOfCare} className="form-control" />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Ambulation</label>
                                <input name="ambulation" type="text" onChange={this.handleChange} value={ambulation} className="form-control" />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Attendance</label>
                                <input name="attendance" type="text" onChange={this.handleChange} value={attendance} className="form-control" />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Birth Date</label>
                                <textarea name="birthDate" type="text" onChange={this.handleChange} value={birthDate} className="form-control" />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Move In Date</label>
                                <textarea name="moveInDate" type="text" onChange={this.handleChange} value={moveInDate} className="form-control" />
                            </div>

                            {(id) ?
                                <>
                                    <div className="form-group col-md-6">
                                        <label>Created At</label>
                                        <textarea name="createdAt" type="text" onChange={this.handleChange} value={createdAt} className="form-control" />
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label>Updated At</label>
                                        <textarea name="updatedAt" type="text" onChange={this.handleChange} value={updatedAt} className="form-control" />
                                    </div>
                                </>
                                : ''}

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