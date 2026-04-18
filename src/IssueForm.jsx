import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";


function IssueForm() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
  };

  const handleGenerateDescription = async () => {
    if (!title) {
      alert("Please enter a title first");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const templates = [
        `The issue regarding "${title}" has been observed at ${location || "the specified location"}. This problem has been affecting the surrounding area and may lead to inconvenience and safety concerns for residents and commuters. Immediate attention from the concerned authorities is requested.`,

        `A civic issue has been reported: "${title}". It is located at ${location || "the mentioned area"} and has persisted for some time. This situation may cause discomfort and potential hazards, and it is recommended that appropriate action be taken as soon as possible.`,

        `This is to report a problem identified as "${title}" near ${location || "the given location"}. The issue is impacting daily activities and could worsen if not addressed promptly. Kindly look into the matter and resolve it at the earliest.`
      ];

      const randomText = templates[Math.floor(Math.random() * templates.length)];
      setDescription(randomText);
      setIsGenerating(false);
    }, 1200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "issues"), {
        title,
        location,
        description,
        images: [],
        status: "open",
        createdAt: new Date(),
      });

      alert("✅ Issue reported successfully!");

      setTitle("");
      setLocation("");
      setDescription("");
      setImages([]);

    } catch (error) {
      console.error("Error adding document: ", error);
      alert("❌ Failed to submit issue");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Report a Civic Issue</h1>
        <p>Help your community by reporting problems in your area.</p>
      </div>

      <div className="card" style={{ maxWidth: "680px" }}>
        <div className="card-header">
          <span className="card-title">Issue Details</span>
          <span className="badge badge-blue">New Report</span>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">Issue Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Broken streetlight"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
  type="text"
  className="form-input"
  placeholder="Enter location"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  required
/>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Images</label>
            <input type="file" multiple onChange={handleImageChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="AI description will appear here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleGenerateDescription}
              disabled={isGenerating}
              style={{ marginTop: "5px" }}
            >
              {isGenerating ? "Generating..." : "✨ Generate with AI"}
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default IssueForm;