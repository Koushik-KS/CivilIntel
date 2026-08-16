import { useState } from "react";
import API from "../services/api";
import VoiceInput from "../components/VoiceInput";

function SubmitRequest() {
  const [formData, setFormData] = useState({
    citizenName: "",
    description: "",
    country: "India",
    state: "Karnataka",
    district: "",
    language: "en",
    source: "Text",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Voice transcript → Description
  const handleVoiceTranscript = (transcript, isFinal) => {
    if (!transcript) return;

    setFormData((prev) => ({
      ...prev,
      description: isFinal
        ? `${prev.description} ${transcript}`.trim()
        : transcript,
      source: "Voice",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setError("");

    try {
      const requestData = {
        citizenName: formData.citizenName,
        message: formData.description,
        language: formData.language,
        source: formData.source,
        location: {
          country: formData.country,
          state: formData.state,
          district: formData.district,
        },
      };

      console.log("Sending request:", requestData);

      const response = await API.post("/requests", requestData);

      console.log("Request submitted:", response.data);

      setSuccessMessage(
        "Development request submitted and analyzed successfully!"
      );

      setFormData({
        citizenName: "",
        description: "",
        country: "India",
        state: "Karnataka",
        district: "",
        language: "en",
        source: "Text",
      });
    } catch (err) {
      console.error("Submit Request Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to submit request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-request-page">
      <div className="page-header">
        <h1>Submit Development Request</h1>

        <p>
          Report a development need in your region. Your request will help
          CivilIntel identify infrastructure gaps and citizen priorities.
        </p>
      </div>

      <div className="request-form-card">
        <div className="form-card-header">
          <h2>Citizen Development Request</h2>

          <p>
            Describe your development issue. CivilIntel will automatically
            analyze the category and priority.
          </p>
        </div>

        {successMessage && (
          <div className="success-message">
            ✓ {successMessage}
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Citizen Name</label>

              <input
                type="text"
                name="citizenName"
                value={formData.citizenName}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Country</label>

              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>State</label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />
            </div>

            <div className="form-group">
              <label>District</label>

              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter district"
                required
              />
            </div>

            <div className="form-group">
              <label>Language</label>

              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
              >
                <option value="en">English</option>
                <option value="kn">Kannada</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <div className="form-group">
              <label>Request Source</label>

              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
              >
                <option value="Text">Text</option>
                <option value="Voice">Voice</option>
                <option value="Messaging">Messaging</option>
              </select>
            </div>
          </div>

          <div className="form-group description-group">
            <label>Describe the Development Issue</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Type your request or use the microphone to speak..."
              rows="7"
              required
            />

            <VoiceInput
              language={formData.language}
              onTranscript={handleVoiceTranscript}
            />

            <p className="form-hint">
              Type your request or speak using the microphone. CivilIntel will
              convert your voice into text and analyze the development issue.
            </p>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-request-btn"
              disabled={loading}
            >
              {loading
                ? "Analyzing and Submitting..."
                : "Submit Development Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubmitRequest;