import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';

const jQuery = window.jQuery, moment = window.moment;

export default class ResidentEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            residents: [],
            isLoading: true
        };
    }

    componentDidMount() {
        // fetch("https://welbi.org/api/residents", {
        //     method: 'GET',
        //     // body: JSON.stringify(data), // data can be string or object
        //     headers:{
        //         'Content-type': 'application/json',
        //         'Authorization': "Bearer 88a8ae6c-6b3e-400e-b052-48680a8aff14",
        //     }
        //   }).then(res => res.json()) // if response is json, for text use res.text()
        //   .then((response) => {
        //     // console.log('Response:', JSON.stringify(response));
        //     console.log('Response:', response)
           
        //     this.setState({ residents: response, isLoading: false });
        //   }) // if text, no need for JSON.stringify
        //   .catch(error => console.error('Error:', error));  
    }


    render() {
        const {isLoading} = this.state;
        return (
            <div className="json-viewer">
                <header className="App-header">
                    <p>
                        Fetch residents from Welbi platform.
                    </p>
                </header>
            </div>
        )
    }
}