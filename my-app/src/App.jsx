import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
            < BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Menu />}></Route>

                    <Route path="/resident"  element={[<ResidentMainTabs />, <ResidentMainPage />]}></Route>
                    <Route path="/resident/add" element={<ResidentEdit />}></Route>
                    <Route path="/resident/:id/edit" element={<ResidentEdit />}></Route>

                    <Route path="/program" element={[<ProgramMainTabs />, <ProgramMainPage />]}></Route>
                    <Route path="/program/add" element={<ProgramEdit />}></Route>
                    <Route path="/program/:id/edit" element={<ProgramEdit />}></Route>
                </Routes>
            </BrowserRouter>
        );
    }
}
