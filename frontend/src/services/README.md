# API Service Documentation

## Overview
The `api.js` file provides a centralized API service for all backend communications. It handles authentication, request/response management, and error handling.

## Configuration

### API Base URL
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

Set in `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Authentication

Tokens are automatically added to all requests when available:
- Tokens stored in localStorage as `authToken`
- Automatically added to `Authorization: Bearer {token}` header
- Login/Register endpoints set the token

## Available API Methods

### Auth API

#### Register User
```javascript
authAPI.register(email, password, name, userType, companyName)
// userType: 'job_seeker' or 'employer'
// companyName: required for 'employer', optional for 'job_seeker'

// Example:
authAPI.register('john@example.com', 'pass123', 'John Doe', 'job_seeker')

// Response:
{
  message: "User registered successfully",
  token: "jwt_token_here",
  user: { id, name, email, userType }
}
```

#### Login User
```javascript
authAPI.login(email, password)

// Example:
authAPI.login('john@example.com', 'pass123')

// Response:
{
  message: "Login successful",
  token: "jwt_token_here",
  user: { id, name, email, userType }
}
```

#### Get Current User
```javascript
authAPI.getCurrentUser()

// Response:
{
  _id: "user_id",
  name: "John Doe",
  email: "john@example.com",
  userType: "job_seeker",
  skills: ["React", "JavaScript"],
  ...
}
```

### Jobs API

#### Get All Jobs
```javascript
jobsAPI.getAllJobs(category, location, search)

// Examples:
jobsAPI.getAllJobs()                           // All jobs
jobsAPI.getAllJobs('Technology')               // By category
jobsAPI.getAllJobs('Technology', 'New York')   // By category and location
jobsAPI.getAllJobs(null, null, 'React')        // By search term

// Response:
[
  {
    _id: "job_id",
    title: "React Developer",
    description: "...",
    category: "Technology",
    location: "New York, NY",
    salary: { min: 80000, max: 120000 },
    jobType: "full-time",
    skills: ["React", "JavaScript"],
    experience: "3+ years",
    companyName: "Tech Corp",
    postedBy: { _id, name, email, companyName },
    applicants: [],
    status: "active",
    createdAt: "2024-01-01T00:00:00Z"
  },
  ...
]
```

#### Get Single Job
```javascript
jobsAPI.getJobById(jobId)

// Example:
jobsAPI.getJobById('507f1f77bcf86cd799439011')

// Response:
{ /* same as above */ }
```

#### Create Job (Employer Only)
```javascript
jobsAPI.createJob(jobData)

// jobData structure:
{
  title: "Senior React Developer",
  description: "We're looking for...",
  category: "Technology",
  location: "New York, NY",
  salary: { min: 100000, max: 150000 },
  jobType: "full-time",
  skills: ["React", "Node.js", "MongoDB"],
  experience: "5+ years"
}

// Response:
{ /* newly created job with _id */ }
```

#### Update Job (Owner Only)
```javascript
jobsAPI.updateJob(jobId, jobData)

// Example:
jobsAPI.updateJob('507f...', { title: "Updated Title", ... })

// Response:
{ /* updated job */ }
```

#### Delete Job (Owner Only)
```javascript
jobsAPI.deleteJob(jobId)

// Response:
{ message: "Job deleted successfully" }
```

### Saved Jobs API

#### Get Saved Jobs
```javascript
savedJobsAPI.getSavedJobs()

// Response:
[
  {
    _id: "saved_job_id",
    userId: "user_id",
    jobId: { /* full job object */ },
    savedAt: "2024-01-01T00:00:00Z"
  },
  ...
]
```

#### Save a Job
```javascript
savedJobsAPI.saveJob(jobId)

// Example:
savedJobsAPI.saveJob('507f...')

// Response:
{ /* saved job object */ }
```

#### Remove Saved Job
```javascript
savedJobsAPI.removeSavedJob(jobId)

// Response:
{ message: "Job removed from saved" }
```

### Applications API

#### Apply to Job
```javascript
applicationsAPI.applyToJob(jobId, coverLetter, resume)

// Example:
applicationsAPI.applyToJob('507f...', 'I am very interested in...', 'resume.pdf')

// Response:
{
  _id: "application_id",
  userId: "user_id",
  jobId: "job_id",
  coverLetter: "...",
  resume: "...",
  status: "applied",
  appliedAt: "2024-01-01T00:00:00Z"
}
```

#### Get My Applications (Job Seeker)
```javascript
applicationsAPI.getMyApplications()

// Response:
[
  {
    _id: "app_id",
    userId: "user_id",
    jobId: { title, description, ... },
    coverLetter: "...",
    status: "applied|shortlisted|rejected|accepted",
    appliedAt: "2024-01-01T00:00:00Z"
  },
  ...
]
```

#### Get Received Applications (Employer)
```javascript
applicationsAPI.getReceivedApplications()

// Response:
[
  {
    _id: "app_id",
    userId: { name, email, phone },
    jobId: { _id, title },
    coverLetter: "...",
    status: "applied|shortlisted|rejected|accepted",
    appliedAt: "2024-01-01T00:00:00Z"
  },
  ...
]
```

#### Update Application Status (Employer Only)
```javascript
applicationsAPI.updateApplicationStatus(applicationId, status)

// status: 'applied' | 'shortlisted' | 'rejected' | 'accepted'

// Example:
applicationsAPI.updateApplicationStatus('app_id', 'shortlisted')

// Response:
{ /* updated application */ }
```

## Error Handling

All API methods throw errors that should be caught:

```javascript
try {
  const response = await jobsAPI.getAllJobs('Technology');
  console.log(response);
} catch (error) {
  console.error('Error:', error.message);
  // Handle error - show user-friendly message
}
```

Common errors:
- 400: Bad request (missing fields, validation error)
- 401: Unauthorized (no token or invalid token)
- 403: Forbidden (not authorized for this action)
- 404: Not found
- 500: Server error

## Usage Examples

### In React Components

#### Using in useEffect
```javascript
import { useEffect, useState } from 'react';
import { jobsAPI } from '../services/api';

function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobsAPI.getAllJobs('Technology');
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  return loading ? <p>Loading...</p> : <div>{/* render jobs */}</div>;
}
```

#### Using in Event Handler
```javascript
import { jobsAPI } from '../services/api';

function PostJobForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await jobsAPI.createJob({
        title: 'React Developer',
        description: 'Looking for...',
        category: 'Technology',
        location: 'New York',
        salary: { min: 80000, max: 120000 },
        jobType: 'full-time',
        skills: ['React', 'JavaScript'],
        experience: '3+ years'
      });
      alert('Job posted successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

## Token Management

Tokens are automatically managed:

```javascript
// After login/register, token is stored
localStorage.setItem('authToken', token);

// Token is automatically included in all requests
// No need to manually add it

// To logout, remove token
localStorage.removeItem('authToken');
localStorage.removeItem('user');
```

## Rate Limiting

Consider implementing rate limiting for production:

```javascript
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // ms

async function rateLimitedCall(fn) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return fn();
}
```

## Testing API

### With curl
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123","userType":"job_seeker"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'

# Get jobs (requires token)
curl http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### With Postman
1. Create collection
2. Add requests for each endpoint
3. Use environment variables for token and base URL
4. Test each endpoint manually

## Debugging

Enable logging in api.js:

```javascript
// Add to apiCall function
console.log('Request:', method, endpoint, body);
console.log('Response:', data);
```

Or use browser DevTools:
- Network tab to see HTTP requests
- Application tab to check localStorage tokens
- Console for error messages
