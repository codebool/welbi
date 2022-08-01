import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

export default class MainTabs extends Component {
    renderMenu = () => {
        return (
            <>
                <li className='nav-item' id='nav-item-list'>
                    <NavLink to='/program' exact='/program' className='nav-link' activeClassName='active'>
                        <i className='fas fa-list' /><label className='d-none d-sm-inline' style={{marginLeft: 5}}>All Programs</label>
                    </NavLink>
                </li>
                <li className='nav-item' id='nav-item-list'>
                    <NavLink to='/program/add' exact='/program/add' className='nav-link' activeClassName='active'>
                        <i className='fas fa-plus' /><label className='d-none d-sm-inline' style={{marginLeft: 5}}>New Programs</label>
                    </NavLink>
                </li>
            </>
        )
    }

    renderEditMenu = (id) => {
        return (
            <>
                <li className='nav-item' id='nav-item-list'>
                    <NavLink to='/program' exact='/program' className='nav-link' activeClassName='active'>
                        <i className='fas fa-list' /><label className='d-none d-sm-inline' style={{marginLeft: 5}}>All Programs</label>
                    </NavLink>
                </li>
                <li className='nav-item' id='nav-item-list'>
                    <NavLink to={`/program/${id}/edit`} exact={`/program/${id}/edit`} className='nav-link' activeClassName='active'>
                        <i className='fas fa-info' /><label className='d-none d-sm-inline' style={{marginLeft: 5}}>Details</label>
                    </NavLink>
                </li>
                <li className='nav-item' id='nav-item-list'>
                    <NavLink to='/program/add' exact='/program/add' className='nav-link' activeClassName='active'>
                        <i className='fas fa-plus' /><label className='d-none d-sm-inline' style={{marginLeft: 5}}>New Programs</label>
                    </NavLink>
                </li>
            </>
        )
    }

    render() {
        let id, edit;
        let editRes, idRes;
        if(this.props.location) {
            let editRegex = /\/([a-z0-9-]{36})/;
            editRes = this.props.location.pathname.match(editRegex);
            if(editRes && editRes[1]) {
                edit = editRes[1];
            }

            let idRegex = /\/([0-9]+\/)/;
            idRes = this.props.location.pathname.match(idRegex);
            if(idRes && idRes[1]) {
                id = parseInt(idRes[1]);
            }
        }

        return (
            <ul className='nav nav-tabs'>
                {id && this.renderEditMenu(id, edit)}
                {(!id && !edit) && this.renderMenu()}
            </ul>
        )
    }

    static propTypes = {
        location: PropTypes.object,
        history: PropTypes.object,
        match: PropTypes.object
    }
}