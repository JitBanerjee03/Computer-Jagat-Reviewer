import React, { useState, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import axios from 'axios';

const ReviewerProfile = ({ reviewer }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors }, setValue, getValues, control } = useForm();

  // Initialize form with reviewer data
  useEffect(() => {
    if (reviewer) {
      // Fetch subject areas
      const fetchSubjectAreas = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/journal/subject-areas/`);
          setSubjectAreas(response.data);
        } catch (error) {
          console.error('Error fetching subject areas:', error);
        }
      };

      fetchSubjectAreas();

      // Set form values
      reset({
        phone_number: reviewer.phone_number || '',
        institution: reviewer.institution || '',
        department: reviewer.department || '',
        position_title: reviewer.position_title || '',
        orcid_id: reviewer.orcid_id || '',
        research_interests: reviewer.research_interests || '',
        google_scholar_profile: reviewer.google_scholar_profile || '',
        personal_website: reviewer.personal_website || '',
        languages_spoken: reviewer.languages_spoken || '',
        subject_areas: reviewer.subject_areas?.map(sa => sa.id) || [],
        educations: reviewer.educations?.map(edu => ({
          degree: edu.degree,
          field_of_study: edu.field_of_study,
          institution: edu.institution,
          start_year: edu.start_year,
          end_year: edu.end_year,
          grade_or_score: edu.grade_or_score
        })) || []
      });

      setPreviewImage(`${import.meta.env.VITE_BACKEND_DJANGO_URL}${reviewer.profile_picture}` || '/default-profile.png');
      setIsLoading(false);
    }
  }, [reviewer, reset, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations"
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleAddEducation = () => {
    append({
      degree: '',
      field_of_study: '',
      institution: '',
      start_year: '',
      end_year: '',
      grade_or_score: ''
    });
  };

  {/*const onSubmit = async (data) => {
    //console.log(data)
    try {
      const formData = new FormData();

      // Append basic fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'subject_areas') {
          value.forEach(id => formData.append('subject_areas', id));
        } else if (key !== 'educations' && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Append files
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      // Append education data as JSON
      if (data.educations) {
        formData.append('educations', JSON.stringify(data.educations));
      }
      
      // Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_DJANGO_URL}/reviewer/update/${reviewer.id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.response?.data?.detail || error.message}`);
    }
  };*/}
  
    const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append basic fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'subject_areas') {
          value.forEach(id => formData.append('subject_areas', id));
        } else if (key !== 'educations' && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Append files
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      // Append education data as JSON string
      if (data.educations) {
        formData.append('educations', JSON.stringify(data.educations));
      }

      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_DJANGO_URL}/reviewer/update/${reviewer.id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.response?.data?.detail || error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="card shadow">
          <div className="card-body text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading reviewer data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Reviewer Profile</h3>
            <button 
              className={`btn ${isEditing ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 text-center mb-4">
                  <div className="position-relative">
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="img-thumbnail mb-2" 
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <input
                      type="file"
                      id="profilePicture"
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label 
                      htmlFor="profilePicture" 
                      className="btn btn-sm btn-outline-primary position-absolute bottom-0 start-50 translate-middle-x"
                    >
                      Change
                    </label>
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Resume (PDF/DOC)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                    />
                    {reviewer.resume && !resumeFile && (
                      <small className="text-muted">Current: {reviewer.resume.split('/').pop()}</small>
                    )}
                  </div>
                </div>

                <div className="col-md-9">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        {...register('phone_number')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <h5 className="mb-3">Affiliation</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Institution*</label>
                  <input
                    type="text"
                    className={`form-control ${errors.institution ? 'is-invalid' : ''}`}
                    {...register('institution', { required: 'Institution is required' })}
                  />
                  {errors.institution && <div className="invalid-feedback">{errors.institution.message}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register('department')}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Position/Title</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register('position_title')}
                  />
                </div>
              </div>

              <h5 className="mb-3">Academic Information</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">ORCID ID</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register('orcid_id')}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Google Scholar Profile</label>
                  <input
                    type="url"
                    className="form-control"
                    {...register('google_scholar_profile')}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Personal Website</label>
                  <input
                    type="url"
                    className="form-control"
                    {...register('personal_website')}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Research Interests</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    {...register('research_interests')}
                  ></textarea>
                </div>
              </div>

              <h5 className="mb-3">Subject Areas of Expertise</h5>
              <div className="mb-4">
                <div className="row">
                  {subjectAreas.map(subject => (
                    <div key={subject.id} className="col-md-4 mb-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`subject-${subject.id}`}
                          value={subject.id}
                          {...register('subject_areas')}
                        />
                        <label className="form-check-label" htmlFor={`subject-${subject.id}`}>
                          {subject.name}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h5 className="mb-3">Education Details</h5>
              <div className="mb-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <h6>Education #{index + 1}</h6>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Degree*</label>
                          <input
                            type="text"
                            className={`form-control ${errors.educations?.[index]?.degree ? 'is-invalid' : ''}`}
                            {...register(`educations.${index}.degree`, { required: 'Degree is required' })}
                          />
                          {errors.educations?.[index]?.degree && (
                            <div className="invalid-feedback">{errors.educations[index].degree.message}</div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Field of Study*</label>
                          <input
                            type="text"
                            className={`form-control ${errors.educations?.[index]?.field_of_study ? 'is-invalid' : ''}`}
                            {...register(`educations.${index}.field_of_study`, { required: 'Field of study is required' })}
                          />
                          {errors.educations?.[index]?.field_of_study && (
                            <div className="invalid-feedback">{errors.educations[index].field_of_study.message}</div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Institution*</label>
                          <input
                            type="text"
                            className={`form-control ${errors.educations?.[index]?.institution ? 'is-invalid' : ''}`}
                            {...register(`educations.${index}.institution`, { required: 'Institution is required' })}
                          />
                          {errors.educations?.[index]?.institution && (
                            <div className="invalid-feedback">{errors.educations[index].institution.message}</div>
                          )}
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Start Year*</label>
                          <input
                            type="number"
                            className={`form-control ${errors.educations?.[index]?.start_year ? 'is-invalid' : ''}`}
                            {...register(`educations.${index}.start_year`, { 
                              required: 'Start year is required',
                              valueAsNumber: true
                            })}
                          />
                          {errors.educations?.[index]?.start_year && (
                            <div className="invalid-feedback">{errors.educations[index].start_year.message}</div>
                          )}
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">End Year*</label>
                          <input
                            type="number"
                            className={`form-control ${errors.educations?.[index]?.end_year ? 'is-invalid' : ''}`}
                            {...register(`educations.${index}.end_year`, { 
                              required: 'End year is required',
                              valueAsNumber: true
                            })}
                          />
                          {errors.educations?.[index]?.end_year && (
                            <div className="invalid-feedback">{errors.educations[index].end_year.message}</div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Grade/Score</label>
                          <input
                            type="text"
                            className="form-control"
                            {...register(`educations.${index}.grade_or_score`)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button 
                  type="button" 
                  className="btn btn-outline-primary"
                  onClick={handleAddEducation}
                >
                  Add Education
                </button>
              </div>

              <h5 className="mb-3">Other Information</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Languages Spoken</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="English, French, etc."
                    {...register('languages_spoken')}
                  />
                </div>
              </div>
            </div>

            <div className="card-footer bg-light">
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary px-4">
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 text-center mb-4">
                <img 
                  src={`${import.meta.env.VITE_BACKEND_DJANGO_URL}${reviewer.profile_picture}` || '/default-profile.png'} 
                  alt="Profile" 
                  className="img-thumbnail" 
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                {reviewer.resume && (
                  <div className="mt-3">
                    <a 
                      href={`${import.meta.env.VITE_BACKEND_DJANGO_URL}${reviewer.resume}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Resume
                    </a>
                  </div>
                )}
              </div>

              <div className="col-md-9">
                <h4>{reviewer.full_name}</h4>
                {reviewer.position_title && <p className="text-muted mb-1">{reviewer.position_title}</p>}
                {reviewer.institution && <p className="text-muted mb-1">{reviewer.institution}</p>}
                {reviewer.department && <p className="text-muted mb-1">{reviewer.department}</p>}

                <ul className="list-unstyled mt-3">
                  {reviewer.phone_number && (
                    <li className="mb-1">
                      <i className="bi bi-telephone me-2"></i>
                      {reviewer.phone_number}
                    </li>
                  )}
                  {reviewer.email && (
                    <li className="mb-1">
                      <i className="bi bi-envelope me-2"></i>
                      {reviewer.email}
                    </li>
                  )}
                  {reviewer.orcid_id && (
                    <li className="mb-1">
                      <i className="bi bi-person-badge me-2"></i>
                      ORCID: {reviewer.orcid_id}
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <hr />

            <div className="row">
              <div className="col-md-6 mb-4">
                <h5>Academic Profiles</h5>
                <ul className="list-unstyled">
                  {reviewer.google_scholar_profile && (
                    <li>
                      <a href={reviewer.google_scholar_profile} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-google me-2"></i>Google Scholar
                      </a>
                    </li>
                  )}
                  {reviewer.personal_website && (
                    <li>
                      <a href={reviewer.personal_website} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-globe me-2"></i>Personal Website
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {reviewer.languages_spoken && (
                <div className="col-md-6 mb-4">
                  <h5>Languages Spoken</h5>
                  <p>{reviewer.languages_spoken}</p>
                </div>
              )}
            </div>

            {reviewer.research_interests && (
              <div className="mb-4">
                <h5>Research Interests</h5>
                <p>{reviewer.research_interests}</p>
              </div>
            )}

            {reviewer.subject_areas && reviewer.subject_areas.length > 0 && (
              <div className="mb-4">
                <h5>Subject Areas of Expertise</h5>
                <div className="d-flex flex-wrap gap-2">
                  {reviewer.subject_areas.map(subject => (
                    <span key={subject.id} className="badge bg-primary">{subject.name}</span>
                  ))}
                </div>
              </div>
            )}

            {reviewer.educations && reviewer.educations.length > 0 && (
              <div className="mb-4">
                <h5>Education</h5>
                <div className="list-group">
                  {reviewer.educations.map((edu, index) => (
                    <div key={index} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{edu.degree} in {edu.field_of_study}</h6>
                        <small>{edu.start_year} - {edu.end_year}</small>
                      </div>
                      <p className="mb-1">{edu.institution}</p>
                      {edu.grade_or_score && <small>Grade: {edu.grade_or_score}</small>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-muted small">
              Reviewer since: {new Date(reviewer.date_joined).toLocaleDateString()}
              {reviewer.is_approved && <span className="badge bg-success ms-2">Approved</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewerProfile;