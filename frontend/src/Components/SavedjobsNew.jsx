import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { savedJobsAPI } from '../services/api';

export default function SavedjobsNew() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await savedJobsAPI.getSavedJobs();
      setSavedJobs(response);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSavedJob = async jobId => {
    try {
      await savedJobsAPI.removeSavedJob(jobId);
      setSavedJobs(savedJobs.filter(saved => saved.jobId._id !== jobId));
      alert('Job removed from saved');
    } catch (error) {
      console.error('Error removing saved job:', error);
    }
  };

  if (!user) {
    return <p>Please login to view saved jobs</p>;
  }

  if (loading) {
    return <p>Loading saved jobs...</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Saved Jobs</h1>

      {savedJobs.length > 0 ? (
        <div>
          {savedJobs.map(saved => {
            const job = saved.jobId;
            const postedBy = job.postedBy;
            const savedDate = new Date(saved.savedAt);
            const now = new Date();
            const diffMs = now - savedDate;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            return (
              <div
                key={job._id}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  marginBottom: '15px',
                  borderRadius: '4px',
                }}
              >
                <h3>{job.title}</h3>
                <p>
                  <strong>Company:</strong> {job.companyName || postedBy?.companyName}
                </p>
                <p>
                  <strong>Location:</strong> {job.location || 'Not specified'}
                </p>
                <p>
                  <strong>Category:</strong> {job.category}
                </p>
                <p>
                  <strong>Job Type:</strong> {job.jobType}
                </p>
                {job.salary && (
                  <p>
                    <strong>Salary:</strong> ${job.salary.min} - ${job.salary.max}
                  </p>
                )}
                <p>
                  <strong>Skills:</strong> {job.skills?.join(', ') || 'Not specified'}
                </p>
                <p style={{ color: '#666', fontSize: '0.9em' }}>Saved {diffDays} days ago</p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    onClick={() => (window.location.href = `/applyto/${job._id}`)}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleRemoveSavedJob(job._id)}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove from Saved
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No saved jobs yet. Start saving jobs to view them here.</p>
      )}
    </div>
  );
}
