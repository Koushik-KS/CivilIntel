import { useState } from "react";
import API from "../services/api";

function Messaging() {
  const [formData, setFormData] = useState({
    citizenName: "",
    message: "",
    language: "en",
    platform: "WhatsApp",
    country: "India",
    state: "Karnataka",
    district: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setError("");

    try {
      const response = await API.post(
        "/messaging/receive",
        formData
      );

      setSuccessMessage(
        response.data.message ||
          "Message received and analyzed successfully!"
      );

      setFormData({
        citizenName: "",
        message: "",
        language: "en",
        platform: "WhatsApp",
        country: "India",
        state: "Karnataka",
        district: "",
      });
    } catch (err) {
      console.error("Messaging Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="messaging-page">
      <div className="page-header">
        <h1>Messaging Integration</h1>

        <p>
          Simulate citizen development requests received through
          messaging platforms such as WhatsApp and Telegram.
        </p>
      </div>

      <div className="request-form-card">
        <div className="form-card-header">
          <h2>Receive Citizen Message</h2>

          <p>
            Messages are automatically analyzed and converted into
            development intelligence.
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
                placeholder="Enter citizen name"
              />
            </div>

            <div className="form-group">
              <label>Messaging Platform</label>

              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Telegram">Telegram</option>
              </select>
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
          </div>

          <div className="form-group description-group">
            <label>Citizen Message</label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Example: Our village road is completely damaged and many people are facing problems..."
              rows="7"
              required
            />

            <p className="form-hint">
              The message will be analyzed automatically for category
              and priority.
            </p>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-request-btn"
              disabled={loading}
            >
              {loading
                ? "Receiving and Analyzing..."
                : "Receive Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Messaging;