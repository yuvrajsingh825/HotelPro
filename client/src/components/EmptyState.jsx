import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble } from 'lucide-react';

const EmptyState = ({
  icon: Icon = BedDouble,
  title = 'No Records Found',
  description = 'There are no items to display at this time.',
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <div className="card luxury-card text-center p-5 my-4 border-dashed">
      <div className="d-flex justify-content-center mb-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: '68px', height: '68px', backgroundColor: '#fbf7f2', color: '#c5a880' }}
        >
          <Icon size={34} />
        </div>
      </div>
      <h4 className="fw-bold text-dark font-serif mb-2">{title}</h4>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: '440px' }}>
        {description}
      </p>
      {actionText && (
        <div>
          {actionLink ? (
            <Link to={actionLink} className="btn btn-gold px-4 py-2">
              {actionText}
            </Link>
          ) : (
            <button onClick={onAction} className="btn btn-gold px-4 py-2">
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
