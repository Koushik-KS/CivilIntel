import { useEffect, useState } from "react";
import API from "../services/api";

function DPIImpact() {
  const [impacts, setImpacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchImpacts = async () => {
      try {
        setLoading(true);

        const response = await API.get("/dpi-impact");

        setImpacts(response.data.data || []);
      } catch (err) {
        console.error("DPI Impact Error:", err);

        setError("Failed to load DPI impact data.");
      } finally {
        setLoading(false);
      }
    };

    fetchImpacts();
  }, []);

  if (loading) {
    return (
      <div className="dpi-impact-page">
        <div className="page-header">
          <h1>DPI Impact Measurement</h1>
          <p>Loading Digital Public Infrastructure impact data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dpi-impact-page">
        <div className="page-header">
          <h1>DPI Impact Measurement</h1>
          <p className="error-message">⚠ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dpi-impact-page">
      <div className="page-header">
        <h1>DPI Impact Measurement</h1>
        <p>
          Measure the real-world impact of Digital Public Infrastructure
          initiatives using before and after development metrics.
        </p>
      </div>

      <div className="impact-summary">
        <div className="impact-summary-card">
          <span>Total Projects</span>
          <h2>{impacts.length}</h2>
        </div>

        <div className="impact-summary-card">
          <span>Average Impact Score</span>
          <h2>
            {impacts.length
              ? Math.round(
                  impacts.reduce(
                    (total, item) =>
                      total + (item.impact?.impactScore || 0),
                    0
                  ) / impacts.length
                )
              : 0}
          </h2>
        </div>

        <div className="impact-summary-card">
          <span>High Impact Projects</span>
          <h2>
            {
              impacts.filter(
                (item) =>
                  item.impact?.impactLevel === "High" ||
                  item.impact?.impactLevel === "Excellent"
              ).length
            }
          </h2>
        </div>
      </div>

      {impacts.length === 0 ? (
        <div className="empty-state">
          <h3>No DPI impact records found</h3>
          <p>
            Add a DPI impact record from the backend to start measuring
            development outcomes.
          </p>
        </div>
      ) : (
        <div className="impact-grid">
          {impacts.map((item) => (
            <div className="impact-card" key={item._id}>
              <div className="impact-card-header">
                <div>
                  <h2>{item.projectName}</h2>
                  <p>
                    {item.district}, {item.state}, {item.country}
                  </p>
                </div>

                <span className="impact-category">
                  {item.category}
                </span>
              </div>

              <div className="impact-status-row">
                <span>Status</span>
                <strong>{item.status || "Planned"}</strong>
              </div>

              <div className="impact-score-section">
                <span>Overall Impact Score</span>
                <h1>{item.impact?.impactScore || 0}/100</h1>
                <p>{item.impact?.impactLevel || "Low"} Impact</p>
              </div>

              <div className="metrics-comparison">
                <div>
                  <h4>Citizen Requests</h4>
                  <p>
                    {item.beforeMetrics?.citizenRequests || 0}
                    {" → "}
                    {item.afterMetrics?.citizenRequests || 0}
                  </p>
                  <small>
                    {item.impact?.requestReduction || 0}% reduction
                  </small>
                </div>

                <div>
                  <h4>Critical Issues</h4>
                  <p>
                    {item.beforeMetrics?.criticalIssues || 0}
                    {" → "}
                    {item.afterMetrics?.criticalIssues || 0}
                  </p>
                  <small>
                    {item.impact?.criticalReduction || 0}% reduction
                  </small>
                </div>

                <div>
                  <h4>Infrastructure Index</h4>
                  <p>
                    {item.beforeMetrics?.infrastructureIndex || 0}
                    {" → "}
                    {item.afterMetrics?.infrastructureIndex || 0}
                  </p>
                  <small>
                    +{item.impact?.infrastructureImprovement || 0} improvement
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DPIImpact;