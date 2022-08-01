import React, {Component} from 'react';
import ProgramList from './ProgramList';

export default class MainPage extends Component {
    cinstructor(props) {
        this.listRef = React.createRef();
        this.state = {
            program: '',
        }
    }
    
    handleReload = () => {
        this.listRef.current.reload();
    }
    
    render() {
        return <div className='wrapper text-center'>
            <ProgramList />
            {/* <ResidentList ref={this.listRef} {...this.props} filterValues = {{resident: this.state.resident}} /> */}
        </div>
    }
}