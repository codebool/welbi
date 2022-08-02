import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Menu from './components/Menu';
import ResidentMainPage from './components/resident/MainPage';
import ResidentMainTabs from './components/resident/MainTabs';
import ResidentEdit from './components/resident/ResidentEdit';
import ProgramMainPage from './components/program/MainPage';
import ProgramMainTabs from './components/program/MainTabs';
import ProgramEdit from './components/program/ProgramEdit';


export default class App extends Component {

    render() {
        return (
            < Router>
                <div>
                    <Route path="/" exact component={Menu}></Route>

                    <Route path="/resident" component={ResidentMainTabs}></Route>
                    <Route path="/resident" exact component={ResidentMainPage}></Route>
                    <Route path='/resident/add' component={ResidentEdit}></Route>
                    <Route path='/resident/:id/edit' component={ResidentEdit}></Route>
                </div>



                {/* <Route path="/resident" component={[<ResidentMainTabs />, <ResidentMainPage />]}></Route>
                    <Route path="/resident/add" component={[<ResidentEdit />]}></Route>
                    <Route path="/resident/:id/edit" component={<ResidentEdit />}></Route>

                    <Route path="/program" component={[<ProgramMainTabs />, <ProgramMainPage />]}></Route>
                    <Route path="/program/add" component={<ProgramEdit />}></Route>
                    <Route path="/program/:id/edit" component={<ProgramEdit />}></Route>  */}

            </Router>
        );
    }
}
