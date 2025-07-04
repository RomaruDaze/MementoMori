import React, { useState } from "react";
import "./home.styles.css";
import UploadPage from "../upload/upload";

const HomePage: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);

  const handleCreateClick = () => {
    setShowUpload(true);
  };

  const handleCloseUpload = () => {
    setShowUpload(false);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Let's create a Memory</h1>
        <button className="create-button" onClick={handleCreateClick}>
          Create
        </button>
      </div>

      <UploadPage isOpen={showUpload} onClose={handleCloseUpload} />
    </div>
  );
};

export default HomePage;
