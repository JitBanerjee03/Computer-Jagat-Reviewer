import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReviewerAssignedJournals = ({ journalReview }) => {
  const getStatusBadge = (status) => {
    const statusClasses = {
      assigned: 'bg-primary',
      completed: 'bg-success',
      rejected: 'bg-danger'
    };
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const navigate = useNavigate();

  const handleReviewClick = (journalId) => {
    navigate(`/review-accept/${journalId}`);
  };

  const handleRejectClick = (journalId) => {
    navigate(`/review-reject/${journalId}`);
  };

  const handleViewJournal = (journalId) => {
    navigate(`/view-journal/${journalId}`);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h4 className="mb-0">Assigned Journals</h4>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Assigned Date</th>
                  <th>Submission Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {journalReview.map(review => (
                  <tr key={review.id}>
                    <td>{review.journal_id}</td>
                    <td>{review.title}</td>
                    <td>{review.author}</td>
                    <td>{getStatusBadge(review.status)}</td>
                    <td>{formatDate(review.assigned_date)}</td>
                    <td>{review.submission_date ? formatDate(review.submission_date) : 'N/A'}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <button 
                          className="btn btn-sm btn-outline-info"
                          onClick={() => handleViewJournal(review.journal_id)}
                        >
                          View
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-primary" 
                          onClick={() => handleReviewClick(review.journal_id)}
                        >
                          Review
                        </button>
                        {review.status === 'assigned' && (
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => handleRejectClick(review.journal_id)}
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .badge {
          padding: 0.35em 0.65em;
          font-size: 0.75em;
          font-weight: 500;
        }
        .table th {
          white-space: nowrap;
        }
        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
        }
        .gap-2 {
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default ReviewerAssignedJournals;