import { useEffect, useState } from "react";
import API from "../services/api";

function Hotspots() {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHotspots = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/intelligence/hotspots");

      console.log("Demand Hotspots:", response.data);

      setHotspots(response.data.data || []);
    } catch (err) {
      console.error("Fetch Hotspots Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load demand hotspots."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotspots();
  }, []);

  return (
    <div className="hotspots-page">
      <div className="page-header">
        <h1>Demand Hotspots</h1>

        <p>
          Identify regions with the highest concentration of citizen
          development needs and urgent infrastructure demands.
        </p>
      </div>

      <div className="hotspots-card">
        <div className="requests-card-header">
          <div>
            <h2>Regional Demand Intelligence</h2>

            <p>
              {loading
                ? "Analyzing citizen demand..."
                : `${hotspots.length} demand hotspot${
                    hotspots.length !== 1 ? "s" : ""
                  } identified`}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              type="button"
              onClick={fetchHotspots}
              disabled={loading}
              className="refresh-btn"
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>

            <span className="live-badge">● LIVE INTELLIGENCE</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div className="requests-loading">
            Analyzing demand hotspots...
          </div>
        ) : hotspots.length === 0 ? (
          <div className="empty-state">
            <h3>No Demand Hotspots Found</h3>

            <p>
              Submit more citizen development requests to generate regional
              demand intelligence.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="hotspots-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>District</th>
                  <th>State</th>
                  <th>Category</th>
                  <th>Total Requests</th>
                  <th>Critical</th>
                  <th>High Priority</th>
                  <th>Demand Level</th>
                </tr>
              </thead>

              <tbody>
                {hotspots.map((hotspot, index) => {
                  const total = hotspot.requestCount || 0;
                  const critical = hotspot.criticalCount || 0;
                  const high = hotspot.highCount || 0;

                  let demandLevel = "Low";

                  if (critical > 0 || total >= 10) {
                    demandLevel = "Critical";
                  } else if (high > 0 || total >= 5) {
                    demandLevel = "High";
                  } else if (total >= 2) {
                    demandLevel = "Medium";
                  }

                  return (
                    <tr
                      key={`${hotspot.district}-${hotspot.state}-${hotspot.category}-${index}`}
                    >
                      <td>
                        <strong>#{index + 1}</strong>
                      </td>

                      <td>
                        <strong>{hotspot.district || "-"}</strong>
                      </td>

                      <td>{hotspot.state || "-"}</td>

                      <td>
                        <span className="category-badge">
                          {hotspot.category || "Other"}
                        </span>
                      </td>

                      <td>
                        <strong>{total}</strong>
                      </td>

                      <td>{critical}</td>

                      <td>{high}</td>

                      <td>
                        <span
                          className={`priority-badge ${demandLevel.toLowerCase()}`}
                        >
                          {demandLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hotspots;