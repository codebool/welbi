import React, { Component } from 'react';

export default class ProgramList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            programs: [],
            isLoading: true
        };
    }

    componentDidMount() {
        // fetch("https://welbi.org/api/programs", {
        //     method: 'GET',
        //     // body: JSON.stringify(data), // data can be string or object
        //     headers:{
        //         'Content-type': 'application/json',
        //         'Authorization': "Bearer 88a8ae6c-6b3e-400e-b052-48680a8aff14",
        //     }
        //   }).then(res => res.json()) // if response is json, for text use res.text()
        //   .then((response) => {
        //     console.log('Response:', JSON.stringify(response))
        //   }) // if text, no need for JSON.stringify
        //   .catch(error => console.error('Error:', error));  
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        Fetch programs from Welbi platform.
                    </p>
                </header>
            </div>
        )
    }
}