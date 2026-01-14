import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GiPreviousButton, GiNextButton } from 'react-icons/gi';
import { jobsAPI } from '../services/api';

export default function HomeNew() {
  const { user } = useSelector(state => state.auth);
  const [jobCategories, setJobCategories] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [companiesToShow, setCompaniesToShow] = useState([]);
  const [loading, setLoading] = useState(true);

  const topCompanies = [
    'Google',
    'Microsoft',
    'Amazon',
    'Apple',
    'Meta',
    'Tesla',
    'Netflix',
    'IBM',
    'Intel',
    'Adobe',
  ];

  useEffect(() => {
    if (user?.userType !== 'employer') {
      fetchJobCategories();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchJobCategories = async () => {
    try {
      setLoading(true);
      const jobs = await jobsAPI.getAllJobs();

      const categoryMap = {};
      jobs.forEach(job => {
        if (categoryMap[job.category]) {
          categoryMap[job.category]++;
        } else {
          categoryMap[job.category] = 1;
        }
      });

      const categories = Object.entries(categoryMap).map(([category, count]) => ({
        category,
        numofjobs: count,
      }));

      setJobCategories(categories.length > 0 ? categories : getDefaultCategories());
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobCategories(getDefaultCategories());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCategories = () => [
    { category: 'Technology', numofjobs: 0 },
    { category: 'Design', numofjobs: 0 },
    { category: 'Marketing', numofjobs: 0 },
    { category: 'Sales', numofjobs: 0 },
    { category: 'Finance', numofjobs: 0 },
    { category: 'HR', numofjobs: 0 },
  ];

  useEffect(() => {
    const companies = topCompanies.slice(startIndex, startIndex + 5);
    setCompaniesToShow(companies);
  }, [startIndex]);

  const nextSlide = () => {
    if (startIndex + 5 < topCompanies.length) {
      setStartIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1);
    }
  };

  // EMPLOYER HOME PAGE
  if (user?.userType === 'employer') {
    return (
      <div style={{ padding: '0' }}>
        {/* Hero Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
            color: 'white',
            padding: '60px 20px',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          <h1 style={{ fontSize: '2.5em', marginBottom: '10px' }}>
            Welcome, {user?.companyName || user?.name}
          </h1>
          <p style={{ fontSize: '1.2em', marginBottom: '20px', opacity: 0.9 }}>
            Find and hire talented professionals for your company
          </p>
          <Link to="/employer-dashboard">
            <button
              style={{
                padding: '12px 30px',
                backgroundColor: 'white',
                color: '#28a745',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1em',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Go to Dashboard
            </button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', marginBottom: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Employer Dashboard</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            <Link to="/employer-dashboard" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '2em', marginBottom: '10px' }}>📝</div>
                <h3 style={{ marginBottom: '10px', color: '#333' }}>Post New Job</h3>
                <p style={{ color: '#666' }}>Create and publish job listings</p>
              </div>
            </Link>

            <Link to="/employer-dashboard" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '2em', marginBottom: '10px' }}>👥</div>
                <h3 style={{ marginBottom: '10px', color: '#333' }}>View Applications</h3>
                <p style={{ color: '#666' }}>Review and manage job applications</p>
              </div>
            </Link>

            <Link to="/employer-dashboard" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '2em', marginBottom: '10px' }}>✅</div>
                <h3 style={{ marginBottom: '10px', color: '#333' }}>Manage Candidates</h3>
                <p style={{ color: '#666' }}>Shortlist and hire top talent</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div
          style={{
            backgroundColor: '#f9f9f9',
            padding: '40px 20px',
            marginTop: '40px',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
              Employer Features
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '30px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>📢</div>
                <h3 style={{ marginBottom: '10px', color: '#333' }}>Post Jobs Instantly</h3>
                <p style={{ color: '#666' }}>Create and publish job listings in minutes</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>📊</div>
                <h3 style={{ marginBottom: '10px', color: '#333' }}>Track Applications</h3>
                <p style={{ color: '#666' }}>Monitor all incoming applications in one place</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>🎯</div>
                <h3 style={{ marginBottom: '10px', color: '#333' }}>Manage Candidates</h3>
                <p style={{ color: '#666' }}>Shortlist, review, and communicate with candidates</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>💼</div>
                <h3 style={{ marginBottom: '10px', color: '#333' }}>Find Top Talent</h3>
                <p style={{ color: '#666' }}>Access profiles of qualified professionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // JOB SEEKER HOME PAGE (Default)
  return (
    <div style={{ padding: '0' }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center',
          marginBottom: '40px',
        }}
      >
        {user?.userType === 'job_seeker' ? (
          <>
            <h1 style={{ fontSize: '2.5em', marginBottom: '10px' }}>Welcome back, {user?.name}! 👋</h1>
            <p style={{ fontSize: '1.2em', marginBottom: '20px', opacity: 0.9 }}>
              Continue exploring amazing job opportunities that match your skills.
            </p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '2.5em', marginBottom: '10px' }}>Find Your Dream Job</h1>
            <p style={{ fontSize: '1.2em', marginBottom: '20px', opacity: 0.9 }}>
              Explore thousands of job opportunities with all the information you need.
            </p>
          </>
        )}

        {!user && (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <button
                style={{
                  padding: '12px 30px',
                  backgroundColor: 'white',
                  color: '#007bff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1em',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Get Started as Job Seeker
              </button>
            </Link>
            <Link to="/register">
              <button
                style={{
                  padding: '12px 30px',
                  backgroundColor: 'white',
                  color: '#007bff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1em',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Post a Job
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Job Categories */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Browse by Category</h2>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Loading job categories...</p>
        ) : jobCategories.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            {jobCategories.map((job, index) => (
              <Link
                key={index}
                to={`/jobs/${encodeURIComponent(job.category)}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <h3 style={{ marginBottom: '10px', color: '#333' }}>{job.category}</h3>
                  <p style={{ color: '#666' }}>~{job.numofjobs} jobs</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No job categories available yet.
          </p>
        )}
      </div>

      {/* Top Hiring Companies */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Top Hiring Companies</h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflowX: 'auto',
          }}
        >
          <button
            onClick={prevSlide}
            style={{
              padding: '10px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <GiPreviousButton />
          </button>

          {companiesToShow.length > 0 ? (
            companiesToShow.map((company, index) => (
              <Link
                key={index}
                to={`/top-hiring-company/${encodeURIComponent(company)}`}
                style={{
                  flex: '1 0 150px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  padding: '20px',
                  borderRight: index < companiesToShow.length - 1 ? '1px solid #ddd' : 'none',
                }}
              >
                <p
                  style={{
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#007bff',
                    margin: 0,
                  }}
                >
                  {company}
                </p>
              </Link>
            ))
          ) : (
            <p style={{ padding: '20px', color: '#666' }}>Loading companies...</p>
          )}

          <button
            onClick={nextSlide}
            style={{
              padding: '10px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <GiNextButton />
          </button>
        </div>
      </div>

      {/* How It Works Section */}
      <div
        style={{
          backgroundColor: '#f9f9f9',
          padding: '40px 20px',
          marginTop: '40px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>How It Works</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '30px',
            }}
          >
            <Link to={user?.userType === 'job_seeker' ? '/resume-builder' : '/register'} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  padding: '20px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    fontSize: '2.5em',
                    marginBottom: '10px',
                  }}
                >
                  📝
                </div>
                <h3 style={{ marginBottom: '10px', color: '#333' }}>Create Profile</h3>
                <p style={{ color: '#666' }}>
                  {user?.userType === 'job_seeker'
                    ? 'Build your professional resume'
                    : 'Register and build your professional profile'}
                </p>
              </div>
            </Link>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2.5em',
                  marginBottom: '10px',
                }}
              >
                🔍
              </div>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>Find Jobs</h3>
              <p style={{ color: '#666' }}>Browse and search for jobs matching your skills</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2.5em',
                  marginBottom: '10px',
                }}
              >
                📨
              </div>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>Apply</h3>
              <p style={{ color: '#666' }}>Apply to jobs and track your applications</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2.5em',
                  marginBottom: '10px',
                }}
              >
                🎉
              </div>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>Get Hired</h3>
              <p style={{ color: '#666' }}>Connect with employers and land your dream job</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
