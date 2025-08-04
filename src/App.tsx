// import  React, { useState } from 'react'
import "./App.css";
import SignUp from "../src/components/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";
import Login from "./components/Login";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import { TaskDashboard } from "./components/TaskDashboard";

function App() {
  return (
    <>
      <AuthProvider>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/signUp" element={ <SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<SignUp />} />
              <Route path="/taskDashboard" element={<TaskDashboard />} />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </AuthProvider>
    </>
  );
}

{
  /* <div className='text-red-900 capitalize text-center mt-10 text-[30px]'>task manager</div> */
}

export default App;
