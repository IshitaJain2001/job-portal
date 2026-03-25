import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { jobsAPI, applicationsAPI } from '../services/api';

export default function EmployerDashboard() {
  const { user, token } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('my-jobs'); 
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    salary: { min: '', max: '' },
    jobType: 'full-time',
    skills: '',
    experience: '',
  });

  useEffect(() => {
    console.log('User:', user);
    console.log('Token:', token);
    if (user?.userType === 'employer') {
      fetchMyJobs();
      fetchApplications();
    }
  }, [user, token]);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching my jobs...');
      const response = await jobsAPI.getMyJobs();
      console.log('Response:', response);
      setMyJobs(response || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Error loading jobs: ' + error.message);
      setMyJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await applicationsAPI.getReceivedApplications();
      setApplications(response || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;

    if (name === 'salary.min' || name === 'salary.max') {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        salary: { ...prev.salary, [key]: value },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePostJob = async e => {
    e.preventDefault();

    try {
      setLoading(true);
      const jobData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        salary: {
          min: parseInt(formData.salary.min),
          max: parseInt(formData.salary.max),
        },
      };

      console.log('Posting job:', jobData);
      await jobsAPI.createJob(jobData);
      alert('Job posted successfully!');
      setFormData({
        title: '',
        description: '',
        category: '',
        location: '',
        salary: { min: '', max: '' },
        jobType: 'full-time',
        skills: '',
        experience: '',
      });
      fetchMyJobs();
      setActiveTab('my-jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Error posting job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async jobId => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobsAPI.deleteJob(jobId);
        alert('Job deleted successfully');
        fetchMyJobs();
      } catch (error) {
        alert('Error deleting job: ' + error.message);
      }
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await applicationsAPI.updateApplicationStatus(applicationId, status);
      fetchApplications();
      alert(`Application status updated to ${status}`);
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  if (!user || user.userType !== 'employer') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>You must be logged in as an employer to access this page.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>{user.companyName} - Employer Dashboard</h1>

      {/* Tabs */}
      <div style={{ marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('my-jobs')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === 'my-jobs' ? '#28a745' : '#ddd',
            color: activeTab === 'my-jobs' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: '600',
          }}
        >
          My Jobs ({myJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('post-job')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'post-job' ? '#28a745' : '#ddd',
            color: activeTab === 'post-job' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: '600',
          }}
        >
          Post New Job
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'applications' ? '#28a745' : '#ddd',
            color: activeTab === 'applications' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: '600',
          }}
        >
          Applications ({applications.length})
        </button>
      </div>

      {/* My Jobs Tab */}
      {activeTab === 'my-jobs' && (
        <div>
          <h2>Your Posted Jobs</h2>
          {error && (
            <div style={{
              padding: '15px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              {error}
            </div>
          )}
          {loading ? (
            <p>Loading your jobs...</p>
          ) : myJobs.length > 0 ? (
            <div>
              {myJobs.map(job => (
                <div
                  key={job._id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '20px',
                    marginBottom: '15px',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 10px 0' }}>{job.title}</h3>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Category:</strong> {job.category}
                      </p>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Location:</strong> {job.location || 'Not specified'}
                      </p>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Job Type:</strong> {job.jobType}
                      </p>
                      {job.salary && (
                        <p style={{ margin: '5px 0', color: '#666' }}>
                          <strong>Salary:</strong> ${job.salary.min} - ${job.salary.max}
                        </p>
                      )}
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Applicants:</strong> {job.applicants?.length || 0}
                      </p>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Status:</strong>{' '}
                        <span style={{
                          padding: '2px 8px',
                          backgroundColor: job.status === 'active' ? '#28a745' : '#dc3545',
                          color: 'white',
                          borderRadius: '3px',
                          fontSize: '0.9em'
                        }}>
                          {job.status}
                        </span>
                      </p>
                      <p style={{ margin: '5px 0', fontSize: '0.85em', color: '#999' }}>
                        <strong>Job ID:</strong> {job._id}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', justifyContent: 'flex-start' }}>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        style={{
                          padding: '8px 15px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9em',
                        }}
                      >
                        Delete Job
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px', textAlign: 'center' }}>
              <p>You haven't posted any jobs yet.</p>
              <button
                onClick={() => setActiveTab('post-job')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Post Your First Job
              </button>
            </div>
          )}
        </div>
      )}

      {/* Post Job Tab */}
      {activeTab === 'post-job' && (
        <form onSubmit={handlePostJob} style={{ maxWidth: '600px' }}>
          <h2>Post a New Job</h2>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: '600' }}>Job Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g. Senior React Developer"
              style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: '600' }}>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="5"
              placeholder="Describe the job position..."
              style={{ width: '100%', padding: '8px', marginTop: '5px', fontFamily: 'Arial', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: '600' }}>Category:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              placeholder="e.g. Technology, Design, Marketing"
              style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: '600' }}>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. New York, NY"
              style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: '600' }}>Min Salary:</label>
              <input
                type="number"
                name="salary.min"
                value={formData.salary.min}
                onChange={handleInputChange}
                placeholder="80000"
                style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: '600' }}>Max Salary:</label>
              <input
                type="number"
                name="salary.max"
                value={formData.salary.max}
                onChange={handleInputChange}
                placeholder="120000"
                style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: '600' }}>Job Type:</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: '600' }}>Required Skills (comma separated):</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="e.g. React, Node.js, MongoDB"
              style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: '600' }}>Experience Required:</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="e.g. 3-5 years"
              style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: '600',
            }}
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div>
          <h2>Applications Received</h2>
          {applications.length > 0 ? (
            <div>
              {applications.map(app => (
                <div
                  key={app._id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '15px',
                    marginBottom: '15px',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <h4>{app.jobId.title}</h4>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Applicant:</strong> {app.userId.name}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Email:</strong> {app.userId.email}
                  </p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Status:</strong>{' '}
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor:
                        app.status === 'applied' ? '#007bff' :
                        app.status === 'shortlisted' ? '#28a745' :
                        app.status === 'rejected' ? '#dc3545' : '#ffc107',
                      color: 'white',
                      borderRadius: '3px',
                      fontSize: '0.9em'
                    }}>
                      {app.status}
                    </span>
                  </p>
                  {app.coverLetter && (
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Cover Letter:</strong> {app.coverLetter}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                      onClick={() => handleUpdateApplicationStatus(app._id, 'shortlisted')}
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9em',
                      }}
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => handleUpdateApplicationStatus(app._id, 'rejected')}
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9em',
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px', textAlign: 'center' }}>
              No applications received yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
