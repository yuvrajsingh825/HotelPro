import React from 'react';

const LoadingSpinner = ({ text = 'Loading details...', fullScreen = false }) => {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center p-5">
      <div
        className="spinner-border mb-3"
        role="status"
        style={{ width: '3rem', height: '3rem', color: '#c5a880', borderWidth: '3px' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted fw-medium small mb-0">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="d-flex align-items-center justify-content-center position-fixed top-0 start-0 w-100 h-100 bg-white"
        style={{ zIndex: 9999 }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
