import React, { useContext, useEffect, useRef } from 'react';
import { AlertContext } from './alertContext';
import './CustomAlert.css';

const CustomAlert = () => {
  const { alert, show, closeAlert } = useContext(AlertContext);
  const progressRef = useRef();

  useEffect(() => {
    if (show && progressRef.current) {
      progressRef.current.classList.remove('run');
      // Trigger reflow to restart animation
      void progressRef.current.offsetWidth;
      progressRef.current.classList.add('run');
    }
  }, [show, alert]);

  if (!show) return null;

  return (
    <div className="custom-toast">
      <div className="custom-toast-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#27ae60" />
          <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="custom-toast-message">{alert}</span>
      <button className="custom-toast-close" onClick={closeAlert}>&times;</button>
      <div className="custom-toast-progress" ref={progressRef}></div>
    </div>
  );
};

export default CustomAlert; 