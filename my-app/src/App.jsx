import './App.css';
import React, {Component} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from './components/MainPage';
import FetchResidentsFromWelbi from './components/FetchResidentsFromWelbi';
import FetchProgramsFromWelbi from './components/FetchProgramsFromWelbi';

export default class App extends Component {
    render() {
        return (
            < BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<MainPage />}/>
                    <Route path="/residents" element={<FetchResidentsFromWelbi />}/>
                    <Route path="/programs" element={<FetchProgramsFromWelbi />}/>
                </Routes>
            </BrowserRouter>
        );
    }
}
