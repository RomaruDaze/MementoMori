import React, { useState, useEffect } from "react";
import "./upload.styles.css";

interface UploadPageProps {
  onClose: () => void;
  isOpen: boolean;
}

const UploadPage: React.FC<UploadPageProps> = ({ onClose, isOpen }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCameraClick = () => {
    console.log("Camera button clicked");
  };

  const handlePhotoClick = () => {
    console.log("Photo button clicked");
  };

  if (!isVisible) return null;

  return (
    <div
      className={`upload-overlay ${isOpen ? "open" : "closing"}`}
      onClick={handleOverlayClick}
    >
      <div className={`upload-content ${isOpen ? "open" : "closing"}`}>
        <div className="upload-header">
          <h2>Upload Memory</h2>
        </div>
        <div className="upload-body">
          <div className="upload-buttons">
            <button
              className="upload-btn camera-btn"
              onClick={handleCameraClick}
            >
              <img
                src="https://img.icons8.com/sf-regular-filled/100/FFFFFF/camera.png"
                alt="Camera"
              />
            </button>
            <button className="upload-btn photo-btn" onClick={handlePhotoClick}>
              <img
                src="https://img.icons8.com/material-rounded/100/FFFFFF/stack-of-photos.png"
                alt="Photo"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
