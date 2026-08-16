import { useEffect, useState } from "react";
import API from "../services/api";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/requests");

        console.log("Citizen Requests:", response.data);

        setRequests(response.data.data || []);
      } catch (err) {
        console.error("Fetch Requests Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load citizen requests."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getPriorityClass = (priority) => {
    return priority ? priority.toLowerCase().replace(/\s/g, "-") : "medium";
  };

  return (
    <div className="requests-page">
      <div className="page-header">
        <h1>Citizen Requests</h1>
        <p>
          View and monitor development issues submitted by citizens across
          different regions.
        </p>
      </div>

      <div className="requests-card">
        <div className="requests-card-header">
          <div>
            <h2>All Development Requests</h2>
            <p>
              {loading
                ? "Loading requests..."
                : `${requests.length} request${
                    requests.length !== 1 ? "s" : ""
                  } found`}
            </p>
          </div>

          <span className="live-badge">● LIVE DATA</span>
        </div>

        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div className="requests-loading">
            Loading citizen requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <h3>No Requests Found</h3>
            <p>
              No citizen development requests have been submitted yet.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Citizen</th>
                  <th>Development Issue</th>
                  <th>District</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td>
                      <strong>
                        {request.citizenName || "Anonymous Citizen"}
                      </strong>
                    </td>

                    <td className="request-message">
                      {request.message}
                    </td>

                    <td>
                      {request.location?.district || "-"}
                    </td>

                    <td>
                      <span className="category-badge">
                        {request.category || "Other"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`priority-badge ${getPriorityClass(
                          request.priority
                        )}`}
                      >
                        {request.priority || "Medium"}
                      </span>
                    </td>

                    <td>
                      <span className="status-badge">
                        {request.status || "New"}
                      </span>
                    </td>

                    <td>
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Requests;