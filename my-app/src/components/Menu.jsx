import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Menu extends Component {
    render() {
        return <div className='wrapper text-center'>
            <Link to={'/resident'} className={'box'}>
                <h3>Residents</h3>
                <p className='card-description'>This is where you can view and edit your residents.</p>
            </Link>

            <Link to={'/program'} className={'box'}>
                <h3>Programs</h3>
                <p className='card-description'>This is where you can view and edit your programs.</p>
            </Link>
        </div>
    }
}