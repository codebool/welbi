import React, { Component } from 'react';
import ResidentList from './ResidentList';

export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.listRef = React.createRef();
    }

    handleReload = () => {
        this.listRef.current.reload();
    }

    render() {
        return (
            <div>
                <ResidentList ref={this.listRef} {...this.props} />
            </div>
        )
    }
}