import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneNumberRef = useRef();
  const institutionRef = useRef();
  const resumeRef = useRef();
  const subjectAreasRef = useRef();

  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState('+91');
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch country codes
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        const codes = data
          .map((country) => {
            const name = country.name?.common;
            const code = country.idd?.root && country.idd?.suffixes
              ? `${country.idd.root}${country.idd.suffixes[0]}`
              : null;
            return code ? { name, code } : null;
          })
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountryCodes(codes);
      })
      .catch((error) => {
        console.error('Error fetching country codes:', error);
      });

    // Fetch subject areas (you'll need to implement this endpoint)
    fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/journal/subject-areas/`)
      .then((response) => response.json())
      .then((data) => setSubjectAreas(data))
      .catch((error) => console.error('Error fetching subject areas:', error));
  }, []);

  const handleSubjectChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedSubjects([...selectedSubjects, value]);
    } else {
      setSelectedSubjects(selectedSubjects.filter(subject => subject !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const fullPhone = `${selectedCode}${phoneNumberRef.current.value}`;
    
    const formData = new FormData();
    formData.append('first_name', firstNameRef.current.value);
    formData.append('last_name', lastNameRef.current.value);
    formData.append('email', emailRef.current.value);
    formData.append('password', passwordRef.current.value);
    formData.append('phone_number', fullPhone);
    formData.append('institution', institutionRef.current.value);
    
    if (resumeRef.current.files[0]) {
      formData.append('resume', resumeRef.current.files[0]);
    }
    
    selectedSubjects.forEach(subject => {
      formData.append('subject_areas', subject);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/reviewer/register-reviewer/`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header when using FormData
        // The browser will set it automatically with the correct boundary
      });

      const isJson = response.headers.get("content-type")?.includes("application/json");
      const responseData = isJson ? await response.json() : null;

      if (!response.ok) {
        console.error('Error response:', responseData);
        
        if (response.status === 400 && responseData) {
          const errorMessages = Object.entries(responseData)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
          alert(errorMessages || 'Validation error occurred.');
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
        
        throw new Error(`Request failed with status ${response.status}`);
      }

      alert('Reviewer registration successful! Your application will be reviewed.');
      console.log('Success:', responseData);
      navigate('/login');
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="p-4 border border-primary rounded shadow-lg">
        <h2 className="mb-4 text-primary text-center">Reviewer Sign Up</h2>
        <form onSubmit={handleSubmit} className="row g-4">
          {/* Name Fields */}
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input type="text" ref={firstNameRef} className="form-control border-primary" required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input type="text" ref={lastNameRef} className="form-control border-primary" required />
          </div>

          {/* Account Fields */}
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" ref={emailRef} className="form-control border-primary" required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Password</label>
            <input type="password" ref={passwordRef} className="form-control border-primary" required />
          </div>

          {/* Phone Input */}
          <div className="col-md-6">
            <label className="form-label">Phone Number</label>
            <div className="input-group">
              <select
                className="form-select border-primary"
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                style={{ maxWidth: '120px' }}
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <input
                type="text"
                ref={phoneNumberRef}
                className="form-control border-primary"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Institution */}
          <div className="col-md-6">
            <label className="form-label">Institution</label>
            <input type="text" ref={institutionRef} className="form-control border-primary" required />
          </div>

          {/* Resume Upload */}
          <div className="col-md-6">
            <label className="form-label">Resume (PDF)</label>
            <input 
              type="file" 
              ref={resumeRef} 
              className="form-control border-primary" 
              accept=".pdf,.doc,.docx"
            />
          </div>

          {/* Subject Areas */}
          <div className="col-md-6">
            <label className="form-label">Subject Areas of Expertise</label>
            <div className="border border-primary rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {subjectAreas.map((subject) => (
                <div key={subject.id} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`subject-${subject.id}`}
                    value={subject.id}
                    onChange={handleSubjectChange}
                  />
                  <label className="form-check-label" htmlFor={`subject-${subject.id}`}>
                    {subject.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-12 text-center">
            <button 
              type="submit" 
              className="btn btn-outline-primary px-5"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;