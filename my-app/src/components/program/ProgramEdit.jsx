import React, { Component } from 'react';

export default class ProgramEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            programs: [],
            isLoading: true
        };
    }

    componentDidMount() {
        fetch("https://welbi.org/api/programs", {
            method: 'GET',
            // body: JSON.stringify(data), // data can be string or object
            headers:{
                'Content-type': 'application/json',
                'Authorization': "Bearer 206fa34d-e89e-4c56-ab74-50d137a9b39b",
            }
          }).then(res => res.json()) // if response is json, for text use res.text()
          .then((response) => {
            console.log('Response:', JSON.stringify(response))
          }) // if text, no need for JSON.stringify
          .catch(error => console.error('Error:', error));  
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