import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [recommendations, setRecommendations] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalRequests: 0,
    activeHotspots: 0,
    criticalIssues: 0,
    highPriorityProjects: 0,
    categoryDemand: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        console.log("Fetching CivilIntel dashboard data...");

        // Fetch recommendations and statistics together
        const [recommendationsResponse, statsResponse] = await Promise.all([
          API.get("/intelligence/recommendations"),
          API.get("/intelligence/stats"),
        ]);

        console.log(
          "Recommendations:",
          recommendationsResponse.data
        );

        console.log(
          "Dashboard Stats:",
          statsResponse.data
        );

        setRecommendations(
          recommendationsResponse.data.data || []
        );

        setDashboardStats(
          statsResponse.data.data || {
            totalRequests: 0,
            activeHotspots: 0,
            criticalIssues: 0,
            highPriorityProjects: 0,
            categoryDemand: [],
          }
        );
      } catch (error) {
        console.error(
          "Dashboard API Error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Dashboard statistics from API
  const stats = [
    {
      title: "Total Citizen Requests",
      value: dashboardStats.totalRequests,
      description: "Development needs reported",
      icon: "📨",
    },
    {
      title: "Active Demand Hotspots",
      value: dashboardStats.activeHotspots,
      description: "Regions requiring attention",
      icon: "📍",
    },
    {
      title: "Critical Issues",
      value: dashboardStats.criticalIssues,
      description: "Urgent citizen concerns",
      icon: "⚠️",
    },
    {
      title: "High Priority Projects",
      value: dashboardStats.highPriorityProjects,
      description: "Recommended for action",
      icon: "🎯",
    },
  ];

  // Convert recommendation API data for priority table
  const regions = recommendations.map((item, index) => ({
    rank: index + 1,
    district: item.district,
    category: item.category,
    requests: item.citizenDemand?.requestCount || 0,
    score: item.priority?.totalScore || 0,
    level: item.priority?.level || "Low",
    project: item.recommendedProject,
  }));

  // Category demand from API
  const categoryDemand = dashboardStats.categoryDemand || [];

  // Find highest category count for percentage calculation
  const maxCategoryCount =
    categoryDemand.length > 0
      ? Math.max(...categoryDemand.map((item) => item.count))
      : 1;

  return (
    <div className="dashboard">

      {/* Dashboard Header */}
      <section className="dashboard-intro">
        <div>
          <h1>Good Morning, Policymaker</h1>

          <p>
            Real-time intelligence from citizen development requests and
            regional infrastructure data.
          </p>
        </div>

        <div className="country-select">
          🇮🇳 India
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.title}>
            <div className="stat-top">
              <span>{stat.icon}</span>
            </div>

            <p className="stat-title">
              {stat.title}
            </p>

            <h2>
              {loading ? "..." : stat.value.toLocaleString()}
            </h2>

            <p className="stat-description">
              {stat.description}
            </p>
          </div>
        ))}
      </section>

      {/* Demand Overview + AI Insight */}
      <section className="dashboard-grid">

        {/* Category Demand */}
        <div className="dashboard-card chart-card">
          <div className="card-heading">
            <div>
              <h2>Citizen Demand Overview</h2>

              <p>
                Requests across development categories
              </p>
            </div>
          </div>

          <div className="category-chart">

            {loading ? (
              <p>Loading citizen demand data...</p>
            ) : categoryDemand.length > 0 ? (
              categoryDemand.map((item, index) => {
                const percentage = Math.round(
                  (item.count / maxCategoryCount) * 100
                );

                return (
                  <div
                    className="chart-row"
                    key={item._id || index}
                  >
                    <span>
                      {item._id || "Other"}
                    </span>

                    <div className="bar">
                      <div
                        className={`bar-fill bar-${(index % 5) + 1}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>

                    <strong>
                      {item.count}
                    </strong>
                  </div>
                );
              })
            ) : (
              <p>
                No citizen demand data available yet.
              </p>
            )}

          </div>
        </div>

        {/* AI Insight */}
        <div className="dashboard-card ai-card">
          <div className="ai-icon">
            ✦
          </div>

          <span className="ai-label">
            CIVILINTEL AI INSIGHT
          </span>

          <h2>
            {loading
              ? "Analyzing development intelligence..."
              : recommendations.length > 0
              ? recommendations[0].recommendedProject
              : "No recommendation available yet"}
          </h2>

          <p>
            {recommendations.length > 0
              ? `${recommendations[0].district} shows significant citizen demand for ${recommendations[0].category.toLowerCase()} infrastructure. CivilIntel recommends prioritizing this development project based on citizen demand, urgency, infrastructure gaps, population impact, and public investment data.`
              : "CivilIntel AI is analyzing citizen requests and regional infrastructure data."}
          </p>

          <div className="ai-location">
            📍{" "}
            {recommendations.length > 0
              ? `${recommendations[0].district}, ${recommendations[0].state}`
              : "Analyzing location..."}
          </div>
        </div>

      </section>

      {/* Priority Regions */}
      <section className="dashboard-card priority-section">

        <div className="card-heading">
          <div>
            <h2>Top Priority Regions</h2>

            <p>
              Ranked using citizen demand and regional intelligence
            </p>
          </div>

          <span className="live-badge">
            ● LIVE INTELLIGENCE
          </span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>District</th>
                <th>Category</th>
                <th>Requests</th>
                <th>Priority Score</th>
                <th>Level</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="6">
                    Loading priority intelligence...
                  </td>
                </tr>
              ) : regions.length > 0 ? (
                regions.map((region) => (
                  <tr key={region.rank}>

                    <td>
                      #{region.rank}
                    </td>

                    <td>
                      <strong>
                        {region.district}
                      </strong>
                    </td>

                    <td>
                      {region.category}
                    </td>

                    <td>
                      {region.requests}
                    </td>

                    <td>
                      <div className="score">

                        <div className="score-track">
                          <div
                            className="score-fill"
                            style={{
                              width: `${region.score}%`,
                            }}
                          ></div>
                        </div>

                        <strong>
                          {region.score}/100
                        </strong>

                      </div>
                    </td>

                    <td>
                      <span
                        className={`priority-badge ${region.level.toLowerCase()}`}
                      >
                        {region.level}
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    No priority regions available yet.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

      </section>

    </div>
  );
}

export default Dashboard;