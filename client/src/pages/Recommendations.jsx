import { useEffect, useState } from "react";
import API from "../services/api";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/intelligence/recommendations");

      setRecommendations(response.data.data || []);
    } catch (err) {
      console.error("Recommendations Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load project recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="recommendations-page">
      <div className="page-header">
        <div>
          <h1>Project Recommendations</h1>
          <p>
            AI-powered infrastructure recommendations ranked using citizen
            demand, urgency, regional infrastructure, population impact, and
            public investment data.
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchRecommendations}
          disabled={loading}
        >
          ↻ Refresh Intelligence
        </button>
      </div>

      {loading && (
        <div className="loading-message">
          Analyzing development intelligence...
        </div>
      )}

      {error && (
        <div className="error-message">
          ⚠ {error}
        </div>
      )}

      {!loading && !error && recommendations.length === 0 && (
        <div className="empty-state">
          <h3>No recommendations available</h3>
          <p>
            Submit citizen development requests and add regional data to
            generate project recommendations.
          </p>
        </div>
      )}

      <div className="recommendations-grid">
        {recommendations.map((item, index) => (
          <div className="recommendation-card" key={`${item.district}-${item.category}-${index}`}>
            
            <div className="recommendation-top">
              <span className="recommendation-rank">
                #{index + 1}
              </span>

              <span
                className={`priority-badge ${item.priority?.level
                  ?.toLowerCase()
                  .replace(" ", "-")}`}
              >
                {item.priority?.level || "Low"} Priority
              </span>
            </div>

            <div className="recommendation-icon">
              ✦
            </div>

            <p className="recommendation-label">
              AI RECOMMENDED PROJECT
            </p>

            <h2>{item.recommendedProject}</h2>

            <div className="recommendation-location">
              📍 {item.district}, {item.state}
            </div>

            <p className="recommendation-description">
              Based on citizen demand for{" "}
              <strong>{item.category}</strong> infrastructure,
              CivilIntel recommends prioritizing this project.
            </p>

            <div className="recommendation-stats">
              <div>
                <span>Citizen Requests</span>
                <strong>
                  {item.citizenDemand?.requestCount || 0}
                </strong>
              </div>

              <div>
                <span>Critical Issues</span>
                <strong>
                  {item.citizenDemand?.criticalCount || 0}
                </strong>
              </div>

              <div>
                <span>High Priority</span>
                <strong>
                  {item.citizenDemand?.highCount || 0}
                </strong>
              </div>
            </div>

            <div className="priority-score-section">
              <div className="priority-score-header">
                <span>Priority Intelligence Score</span>

                <strong>
                  {item.priority?.totalScore || 0}/100
                </strong>
              </div>

              <div className="score-track">
                <div
                  className="score-fill"
                  style={{
                    width: `${Math.min(
                      item.priority?.totalScore || 0,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="recommendation-footer">
              <span>
                Population:{" "}
                {item.regionalContext?.population?.toLocaleString() || "N/A"}
              </span>

              <span>
                Infrastructure Index:{" "}
                {item.regionalContext?.infrastructureIndex || "N/A"}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;