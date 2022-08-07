import React, { Component } from 'react';
import ProgramList from './ProgramList';

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
                <ProgramList ref={this.listRef} {...this.props} />
            </div>
        )
    }
}