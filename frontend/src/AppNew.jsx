import React, { useState, createContext } from 'react';
import NavbarNew from './Components/NavbarNew';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomeNew from './Components/HomeNew';
import Settings from './Components/Settings';
import JobsNew from './Components/JobsNew';
import AppSectionNew from './Components/AppSectionNew';
import TopCompanydata from './Components/TopCompanydata';
import RegisterNew from './Components/RegisterNew';
import Login from './Components/Login';
import TitleJobNew from './Components/TitleJobNew';
import SavedjobsNew from './Components/SavedjobsNew';
import EmployerDashboard from './Components/EmployerDashboard';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import ResumeBuilder from './Components/ResumeBuilder';
import './AppNew.css';

export const myContext = createContext();

function ProtectedJobSeekerRoute({ children }) {
  const { user, isLoggedIn } = useSelector(state => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (user?.userType !== 'job_seeker') {
    return <Navigate to="/" />;
  }

  return children;
}

function ProtectedEmployerRoute({ children }) {
  const { user, isLoggedIn } = useSelector(state => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (user?.userType !== 'employer') {
    return <Navigate to="/" />;
  }

  return children;
}

export default function AppNew() {
  const [jobsArray, setJobsArray] = useState({ jobs: [] });

  return (
    <myContext.Provider value={{ jobsArray, setJobsArray }}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavbarNew />

        <main style={{ flex: 1, width: '100%' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomeNew />} />
            <Route path="/help-centre" element={<Settings />} />
            <Route path="/register" element={<RegisterNew />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />

            {/* Job Seeker Only Routes */}
            <Route
              path="/jobs/:category"
              element={
                <ProtectedJobSeekerRoute>
                  <JobsNew />
                </ProtectedJobSeekerRoute>
              }
            />
            <Route
              path="/applyto/:jobId"
              element={
                <ProtectedJobSeekerRoute>
                  <AppSectionNew />
                </ProtectedJobSeekerRoute>
              }
            />
            <Route
              path="/savedjobs"
              element={
                <ProtectedJobSeekerRoute>
                  <SavedjobsNew />
                </ProtectedJobSeekerRoute>
              }
            />
            <Route
              path="/search/:title"
              element={
                <ProtectedJobSeekerRoute>
                  <TitleJobNew />
                </ProtectedJobSeekerRoute>
              }
            />

            {/* Employer Only Routes */}
            <Route
              path="/employer-dashboard"
              element={
                <ProtectedEmployerRoute>
                  <EmployerDashboard />
                </ProtectedEmployerRoute>
              }
            />

            {/* Fallback */}
            <Route path="/top-hiring-company/:company" element={<TopCompanydata />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Simple Footer */}
        <footer
          style={{
            backgroundColor: '#333',
            color: 'white',
            padding: '20px',
            textAlign: 'center',
            marginTop: '40px',
          }}
        >
          <p>&copy; 2026 Job Portal. All rights reserved.</p>
        </footer>
      </div>
    </myContext.Provider>
  );
}
