import React, {Component} from 'react';
import { Link } from 'react-router-dom';

export default class MainPage extends Component {    
    render() {
        return <div className='wrapper text-center'>
            <Link to={'/residents'}> className={'box'}
                <div className='card-icon'>
                     {/* <img src="" alt="no image" /> */}
                </div>
                <h3>Residents</h3>
                <p className='card-description'>This is where you can view and edit your residents.</p>
            </Link>

            <Link to={'/programs'}> className={'box'}
                <div className='card-icon'>
                    {/* <img src="" alt="no image" /> */}
                </div>
                <h3>Programs</h3>
                <p className='card-description'>This is where you can view and edit your programs.</p>
            </Link>
        </div>
    }
}