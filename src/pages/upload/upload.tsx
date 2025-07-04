import React, { useState, useEffect, useRef } from "react";
import "./upload.styles.css";
import { AIService } from "../../services/aiService";
import type { AIAnalysisResult } from "../../services/aiService";

interface UploadPageProps {
  onClose: () => void;
  isOpen: boolean;
}

const UploadPage: React.FC<UploadPageProps> = ({ onClose, isOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    if (e.target === e.currentTarget && !selectedImage) {
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
        setShowPreview(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL("image/jpeg");
        setSelectedImage(imageData);

        // Stop camera stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        setIsCameraActive(false);
        setShowPreview(true);
      }
    }
  };

  const handleCloseCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
    setIsCameraActive(false);
  };

  const handleRetake = () => {
    setSelectedImage(null);
    setShowPreview(false);
    setAiResult(null);
  };

  const handleNext = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const result = await AIService.analyzeImage(selectedImage);
      setAiResult(result);
      console.log("AI Analysis Result:", result);

      // You can now use the AI result to create the memory
      // For example, save to database, show results, etc.
      alert(
        `AI Analysis Complete!\nDescription: ${
          result.description
        }\nTags: ${result.tags.join(", ")}`
      );
    } catch (error) {
      console.error("Error during AI analysis:", error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
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
          {!isCameraActive && !showPreview ? (
            <>
              <div className="upload-area" onClick={handleUploadAreaClick}>
                <div className="upload-placeholder">
                  <div className="upload-icon">📁</div>
                  <p>Click to upload image</p>
                </div>
              </div>

              <button className="take-photo-btn" onClick={handleTakePhoto}>
                <img
                  src="https://img.icons8.com/sf-regular-filled/100/FFFFFF/camera.png"
                  alt="camera"
                />
                <h3>Take Photo</h3>
              </button>
            </>
          ) : isCameraActive ? (
            <div className="camera-view">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="camera-video"
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <div className="camera-controls">
                <button
                  className="capture-btn"
                  onClick={handleCapturePhoto}
                ></button>
                <button
                  className="close-camera-btn"
                  onClick={handleCloseCamera}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className="preview-section">
              <div className="image-preview-container">
                <img
                  src={selectedImage!}
                  alt="Preview"
                  className="preview-image"
                />
              </div>
              <div className="preview-buttons">
                <button className="retake-btn" onClick={handleRetake}>
                  Retake
                </button>
                <button
                  className="next-btn"
                  onClick={handleNext}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Next"}
                </button>
              </div>
              {isAnalyzing && (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <p>AI is analyzing your image...</p>
                </div>
              )}
              {aiResult && (
                <div className="ai-result">
                  <h3>AI Analysis Result:</h3>
                  <p>
                    <strong>Description:</strong> {aiResult.description}
                  </p>
                  <p>
                    <strong>Tags:</strong> {aiResult.tags.join(", ")}
                  </p>
                  <p>
                    <strong>Confidence:</strong>{" "}
                    {(aiResult.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          )}
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
