import React, {Component} from 'react';

export default class AttendanceView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attendances: [],
            isLoading: true
        };
    }


    render () {
        return (
            <div className="json-viewer">
                <header className="App-header">
                    
                </header>
            </div>
        )
    }
}