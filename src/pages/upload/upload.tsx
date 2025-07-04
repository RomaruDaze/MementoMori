import React, { useState, useEffect, useRef } from "react";
import "./upload.styles.css";

interface UploadPageProps {
  onClose: () => void;
  isOpen: boolean;
}

const UploadPage: React.FC<UploadPageProps> = ({ onClose, isOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    console.log("Take photo button clicked");
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
          <div className="upload-area" onClick={handleUploadAreaClick}>
            {selectedImage ? (
              <div className="image-preview">
                <img src={selectedImage} alt="Selected" />
                <button
                  className="change-image-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">📁</div>
                <p>Click to upload image</p>
              </div>
            )}
          </div>

          <button className="take-photo-btn" onClick={handleTakePhoto}>
            <img
              src="https://img.icons8.com/sf-regular-filled/100/FFFFFF/camera.png"
              alt="camera"
            />
            <h3>Take Photo</h3>
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UploadPage;
