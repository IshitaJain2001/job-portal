import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jobsAPI, savedJobsAPI } from '../services/api';
import { useSelector } from 'react-redux';

export default function TitleJobNew() {
  const { title } = useParams();
  const decodedTitle = decodeURIComponent(title);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchSearchResults();
    if (user) {
      fetchSavedJobs();
    }
  }, [decodedTitle, user]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Searching for:', decodedTitle);
      
      // Get all jobs and filter by keyword
      const allJobs = await jobsAPI.getAllJobs();
      
      // Filter jobs by title, description, category, and skills (case-insensitive)
      const filtered = allJobs.filter(job => {
        const searchTerm = decodedTitle.toLowerCase();
        return (
          job.title.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm) ||
          job.category.toLowerCase().includes(searchTerm) ||
          (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchTerm)))
        );
      });
      
      console.log('✅ Found jobs:', filtered.length);
      setFilteredJobs(filtered);
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError('Error loading search results: ' + err.message);
      setFilteredJobs([]);
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

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1>Search Results for: "<strong>{decodedTitle}</strong>"</h1>

      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          Searching jobs...
        </p>
      ) : filteredJobs.length > 0 ? (
        <div>
          <p style={{ marginBottom: '20px', color: '#666', fontWeight: '600' }}>
            Found <span style={{ color: '#007bff', fontSize: '1.2em' }}>{filteredJobs.length}</span> job(s)
          </p>
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
                  padding: '20px',
                  marginBottom: '15px',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{job.title}</h3>
                
                <p style={{ margin: '5px 0', color: '#666' }}>
                  <strong>Company:</strong> {job.companyName || postedBy?.companyName || 'Not specified'}
                </p>
                
                <p style={{ margin: '5px 0', color: '#666' }}>
                  <strong>Location:</strong> {job.location || 'Remote'}
                </p>
                
                <p style={{ margin: '5px 0', color: '#666' }}>
                  <strong>Category:</strong> {job.category}
                </p>
                
                <p style={{ margin: '5px 0', color: '#666' }}>
                  <strong>Job Type:</strong> {job.jobType}
                </p>
                
                {job.salary && (
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Salary:</strong> ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}
                  </p>
                )}
                
                {job.experience && (
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Experience:</strong> {job.experience}
                  </p>
                )}
                
                {job.skills && job.skills.length > 0 && (
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Skills:</strong> {job.skills.join(', ')}
                  </p>
                )}
                
                <p style={{ margin: '10px 0 0 0', fontSize: '0.9em', color: '#999' }}>
                  Posted {diffDays} days ago
                </p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button
                    onClick={() => window.location.href = `/applyto/${job._id}`}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.95em',
                      fontWeight: '600',
                    }}
                  >
                    View & Apply
                  </button>
                  
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
                        fontSize: '0.95em',
                        fontWeight: '600',
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
                        fontSize: '0.95em',
                        fontWeight: '600',
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
        <div style={{
          padding: '40px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#666'
        }}>
          <p style={{ fontSize: '1.1em', marginBottom: '10px' }}>
            No jobs found matching "<strong>{decodedTitle}</strong>"
          </p>
          <p>Try searching with different keywords or browse by category</p>
        </div>
      )}
    </div>
  );
}
