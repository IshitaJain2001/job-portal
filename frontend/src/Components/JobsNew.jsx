import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jobsAPI, savedJobsAPI } from '../services/api';

export default function JobsNew() {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchSavedJobs();
    }
  }, [decodedCategory, user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAllJobs(decodedCategory);
      setFilteredJobs(response);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await savedJobsAPI.getSavedJobs();
      const ids = new Set(response.map(saved => saved.jobId._id));
      setSavedJobIds(ids);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const handleSaveJob = async jobId => {
    if (!user) {
      alert('Please login to save jobs');
      return;
    }

    try {
      await savedJobsAPI.saveJob(jobId);
      setSavedJobIds(new Set([...savedJobIds, jobId]));
      alert('Job saved!');
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleRemoveSavedJob = async jobId => {
    try {
      await savedJobsAPI.removeSavedJob(jobId);
      const newSet = new Set(savedJobIds);
      newSet.delete(jobId);
      setSavedJobIds(newSet);
      alert('Job removed from saved');
    } catch (error) {
      console.error('Error removing saved job:', error);
    }
  };

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Jobs in {decodedCategory}</h1>

      {filteredJobs.length > 0 ? (
        <div>
          {filteredJobs.map(job => {
            const isSaved = savedJobIds.has(job._id);
            const postedBy = job.postedBy || {};
            const createdDate = new Date(job.createdAt);
            const now = new Date();
            const diffMs = now - createdDate;
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
                <Link to={`/applyto/${job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{job.title}</h3>
                </Link>

                <p>
                  <strong>Company:</strong> {job.companyName || postedBy.companyName || 'Not specified'}
                </p>
                <p>
                  <strong>Location:</strong> {job.location || 'Not specified'}
                </p>
                <p>
                  <strong>Job Type:</strong> {job.jobType}
                </p>

                {job.salary && (
                  <p>
                    <strong>Salary:</strong> ${job.salary.min} - ${job.salary.max}
                  </p>
                )}

                {job.skills && job.skills.length > 0 && (
                  <p>
                    <strong>Skills:</strong> {job.skills.join(', ')}
                  </p>
                )}

                <p style={{ color: '#666', fontSize: '0.9em' }}>Posted {diffDays} days ago</p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <Link to={`/applyto/${job._id}`}>
                    <button
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      View & Apply
                    </button>
                  </Link>

                  {isSaved ? (
                    <button
                      onClick={() => handleRemoveSavedJob(job._id)}
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#ffc107',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Unsave
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSaveJob(job._id)}
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No jobs found in {decodedCategory}. Try another category.</p>
      )}
    </div>
  );
}
