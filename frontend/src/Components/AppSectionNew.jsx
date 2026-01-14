import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jobsAPI, applicationsAPI } from '../services/api';

export default function AppSectionNew() {
  const { jobId } = useParams();
  const { user } = useSelector(state => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobById(jobId);
      setJob(response);
    } catch (error) {
      console.error('Error fetching job:', error);
      alert('Error loading job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async e => {
    e.preventDefault();

    if (!user) {
      alert('Please login to apply');
      return;
    }

    if (user.userType !== 'job_seeker') {
      alert('Only job seekers can apply for jobs');
      return;
    }

    try {
      setApplying(true);
      await applicationsAPI.applyToJob(jobId, coverLetter);
      alert('Application submitted successfully!');
      setCoverLetter('');
    } catch (error) {
      alert('Error applying: ' + error.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <p>Loading job details...</p>;
  }

  if (!job) {
    return <p>Job not found</p>;
  }

  const postedBy = job.postedBy || {};

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '4px' }}>
        <h1>{job.title}</h1>
        <p>
          <strong>Company:</strong> {job.companyName || postedBy.companyName}
        </p>
        <p>
          <strong>Location:</strong> {job.location || 'Not specified'}
        </p>
        <p>
          <strong>Job Type:</strong> {job.jobType}
        </p>
        <p>
          <strong>Experience:</strong> {job.experience || 'Not specified'}
        </p>

        {job.salary && (
          <p>
            <strong>Salary:</strong> ${job.salary.min} - ${job.salary.max}
          </p>
        )}

        {job.skills && job.skills.length > 0 && (
          <p>
            <strong>Required Skills:</strong> {job.skills.join(', ')}
          </p>
        )}

        <h3>Job Description</h3>
        <p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>

        <p style={{ color: '#666', marginTop: '20px' }}>
          Posted by: {postedBy.name} ({postedBy.email})
        </p>
      </div>

      {user && user.userType === 'job_seeker' ? (
        <form onSubmit={handleApply} style={{ maxWidth: '600px' }}>
          <h2>Apply for this Job</h2>

          <div style={{ marginBottom: '15px' }}>
            <label>Cover Letter:</label>
            <textarea
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              placeholder="Tell the employer why you're a great fit for this position..."
              rows="6"
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
                fontFamily: 'Arial',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={applying}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {applying ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      ) : (
        <p>
          {!user
            ? 'Please login as a job seeker to apply for this position.'
            : 'Only job seekers can apply for jobs.'}
        </p>
      )}
    </div>
  );
}
