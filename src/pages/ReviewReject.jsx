import React, { useContext, useState, useEffect } from 'react';
import { contextProviderDeclare } from '../store/ContextProvider';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReviewReject = () => {
  const { reviewer } = useContext(contextProviderDeclare);
  const { journalId } = useParams();
  const navigate = useNavigate();
  
  const getContextProvider=useContext(contextProviderDeclare);
  const {setjournalReview}=getContextProvider;

  const [formData, setFormData] = useState({
    rejection_reason: '',
    subject_area_id: ''
  });
  
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch subject areas on component mount
  useEffect(() => {
    const fetchSubjectAreas = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_DJANGO_URL}/journal/subject-areas/`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (Array.isArray(response.data)) {
          setSubjectAreas(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
          setErrors({ non_field_errors: 'Invalid data format from server' });
        }
      } catch (error) {
        console.error('Error fetching subject areas:', error);
        setErrors({ 
          non_field_errors: 'Failed to load subject areas. Please try again later.' 
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubjectAreas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    if (!formData.rejection_reason) {
      setErrors({ rejection_reason: 'Rejection reason is required' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_DJANGO_URL}/reviewer/reject/${journalId}/${reviewer.reviewer_id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setSuccessMessage('Journal review assignment rejected successfully!');
      await setjournalReview(reviewer.reviewer_id);
      alert('Journal review assignment rejected successfully!');
      setTimeout(() => navigate('/assigned-journals'), 2000);
      
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setErrors({ non_field_errors: 'Assignment not found or already completed/rejected' });
        } else if (error.response.data) {
          setErrors(error.response.data);
        }
      } else {
        setErrors({ non_field_errors: 'Network error. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-danger text-white">
              <h3 className="mb-0">Reject Journal Assignment</h3>
            </div>
            
            <div className="card-body">
              {successMessage && (
                <div className="alert alert-success">
                  {successMessage}
                </div>
              )}
              
              {errors.non_field_errors && (
                <div className="alert alert-danger">
                  {errors.non_field_errors}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    Reason for Rejection <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${errors.rejection_reason ? 'is-invalid' : ''}`}
                    name="rejection_reason"
                    rows="5"
                    value={formData.rejection_reason}
                    onChange={handleChange}
                    placeholder="Please provide a detailed reason for rejecting this journal assignment..."
                    required
                  ></textarea>
                  {errors.rejection_reason && (
                    <div className="invalid-feedback">{errors.rejection_reason}</div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    Suggested Alternative Subject Area (Optional)
                  </label>
                  <select
                    className="form-select"
                    name="subject_area_id"
                    value={formData.subject_area_id}
                    onChange={handleChange}
                  >
                    <option value="">Select a subject area...</option>
                    {isLoading ? (
                      <option disabled>Loading subject areas...</option>
                    ) : (
                      subjectAreas.map(area => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))
                    )}
                  </select>
                  {subjectAreas.length === 0 && !isLoading && (
                    <div className="text-danger mt-2">
                      No subject areas available
                    </div>
                  )}
                  <small className="text-muted">
                    If this journal was assigned in error, please suggest a more appropriate subject area
                  </small>
                </div>
                
                <div className="alert alert-warning">
                  <strong>Warning:</strong> Rejecting this assignment will notify the editor and 
                  this journal will be reassigned to another reviewer. Please ensure your reason 
                  for rejection is valid and clearly stated.
                </div>
                
                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Confirm Rejection'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewReject;