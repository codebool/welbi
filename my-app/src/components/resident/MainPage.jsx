import React, { Component } from 'react';
import ResidentList from './ResidentList';

export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.listRef = React.createRef();
        this.state = {
            resident: '',
        }
    }

    handleReload = () => {
        this.listRef.current.reload();
    }

    render() {
        console.log(";;;");
        return (
            <>
                <ResidentList ref={this.listRef} {...this.props} filterValues={{ resident: this.state.resident }} />
            </>
        )
    }
}