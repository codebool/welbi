import React, {Component} from 'react';
import ResidentList from './ResidentList';

export default class MainPage extends Component {
    cinstructor(props) {
        this.listRef = React.createRef();
        this.state = { 
            resident: '',
        }
    }
    
    handleReload = () => {
        this.listRef.current.reload();
    }
    
    render() {
        return <div className='wrapper text-center'>
            <ResidentList />
            {/* <ResidentList ref={this.listRef} {...this.props} filterValues = {{resident: this.state.resident}} /> */}
        </div>
    }
}