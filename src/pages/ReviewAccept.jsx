import React, { useContext, useState } from 'react';
import { contextProviderDeclare } from '../store/ContextProvider';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReviewAccept = () => {
  const { reviewer } = useContext(contextProviderDeclare);
  const { journalId } = useParams();
  const navigate = useNavigate();
  
  const getContextProvider=useContext(contextProviderDeclare);
  const {setjournalReview}=getContextProvider;

  const [formData, setFormData] = useState({
    feedback_text: '',
    rating: 3,
    confidential_comments: '',
    recommendation: 'accept',
    file_upload: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file_upload: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('feedback_text', formData.feedback_text);
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('confidential_comments', formData.confidential_comments);
      formDataToSend.append('recommendation', formData.recommendation);
      if (formData.file_upload) {
        formDataToSend.append('file_upload', formData.file_upload);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_DJANGO_URL}/reviewer/review-feedback/${journalId}/${reviewer.reviewer_id}/`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccessMessage('Review submitted successfully!');
      await setjournalReview(reviewer.reviewer_id);
      alert('Review submitted successfully!');
      
      setTimeout(() => navigate('/assigned-journals'), 2000);
      
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ non_field_errors: 'An error occurred. Please try again.' });
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
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Submit Journal Review</h3>
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
                {/* Rating Selection */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Overall Rating</label>
                  <div className="d-flex justify-content-between">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="rating"
                          id={`rating-${rating}`}
                          value={rating}
                          checked={formData.rating == rating}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor={`rating-${rating}`}>
                          {rating} - {getRatingLabel(rating)}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.rating && <div className="text-danger">{errors.rating}</div>}
                </div>
                
                {/* Recommendation */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Recommendation</label>
                  <select
                    className="form-select"
                    name="recommendation"
                    value={formData.recommendation}
                    onChange={handleChange}
                  >
                    <option value="accept">Accept</option>
                    <option value="minor_revision">Minor Revision</option>
                    <option value="major_revision">Major Revision</option>
                    <option value="reject">Reject</option>
                  </select>
                  {errors.recommendation && <div className="text-danger">{errors.recommendation}</div>}
                </div>
                
                {/* Feedback Text */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Detailed Feedback</label>
                  <textarea
                    className="form-control"
                    name="feedback_text"
                    rows="8"
                    value={formData.feedback_text}
                    onChange={handleChange}
                    placeholder="Provide detailed feedback about the manuscript..."
                    required
                  ></textarea>
                  {errors.feedback_text && <div className="text-danger">{errors.feedback_text}</div>}
                </div>
                
                {/* Confidential Comments */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Confidential Comments (to Editor)</label>
                  <textarea
                    className="form-control"
                    name="confidential_comments"
                    rows="4"
                    value={formData.confidential_comments}
                    onChange={handleChange}
                    placeholder="Any comments you'd like to share only with the editor..."
                  ></textarea>
                  {errors.confidential_comments && <div className="text-danger">{errors.confidential_comments}</div>}
                </div>
                
                {/* File Upload */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Upload File (Optional)</label>
                  <input
                    type="file"
                    className="form-control"
                    name="file_upload"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <small className="text-muted">You can upload annotated manuscript or additional comments (PDF, Word, or text)</small>
                  {errors.file_upload && <div className="text-danger">{errors.file_upload}</div>}
                </div>
                
                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => navigate('/assigned-journals')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
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

// Helper function to get rating labels
const getRatingLabel = (rating) => {
  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };
  return ratingLabels[rating] || '';
};

export default ReviewAccept;