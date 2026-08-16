import { useState } from "react";
import API from "../services/api";

function Messaging() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I am CivilIntel AI. Describe a development problem in your area, and I will help analyze it.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = {
      type: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      // Demo AI analysis
      const response = await API.post("/intelligence/analyze-message", {
        message: userMessage.text,
      });

      const data = response.data.data;

      const botMessage = {
        type: "bot",
        text: response.data.message || "CivilIntel AI analyzed your request.",
        analysis: data,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(
        "Message analysis error:",
        error.response?.data || error.message
      );

      // Temporary fallback if backend API is not ready
      const botMessage = {
        type: "bot",
        text: "Your development request has been received. CivilIntel AI will analyze the issue based on category, urgency, location, and citizen demand.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="messaging-page">
      <div className="page-header">
        <h1>Citizen Messaging Intelligence</h1>

        <p>
          Submit development concerns through a conversational interface.
          CivilIntel AI analyzes citizen messages to identify infrastructure
          needs, urgency, and development priorities.
        </p>
      </div>

      <div className="messaging-layout">
        <section className="messaging-card">
          <div className="chat-header">
            <div className="chat-title">
              <div className="chat-ai-icon">✦</div>

              <div>
                <h2>CivilIntel AI Assistant</h2>
                <p>
                  <span className="online-dot"></span>
                  AI intelligence active
                </p>
              </div>
            </div>

            <span className="chat-status">
              LIVE
            </span>
          </div>

          <div className="messages-container">
            {messages.map((item, index) => (
              <div
                className={`message-row ${item.type}`}
                key={index}
              >
                {item.type === "bot" && (
                  <div className="message-avatar">
                    ✦
                  </div>
                )}

                <div className="message-content">
                  <div className="message-bubble">
                    {item.text}
                  </div>

                  {item.analysis && (
                    <div className="analysis-result">
                      <h4>AI Analysis</h4>

                      <div className="analysis-grid">
                        <div>
                          <span>Category</span>
                          <strong>
                            {item.analysis.category || "General"}
                          </strong>
                        </div>

                        <div>
                          <span>Urgency</span>
                          <strong>
                            {item.analysis.urgency || "Medium"}
                          </strong>
                        </div>

                        <div>
                          <span>Location</span>
                          <strong>
                            {item.analysis.location || "Not identified"}
                          </strong>
                        </div>

                        <div>
                          <span>Recommended Action</span>
                          <strong>
                            {item.analysis.recommendation ||
                              "Further analysis required"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {item.type === "user" && (
                  <div className="message-avatar user-avatar">
                    U
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="message-row bot">
                <div className="message-avatar">
                  ✦
                </div>

                <div className="message-bubble typing-message">
                  CivilIntel AI is analyzing your request...
                </div>
              </div>
            )}
          </div>

          <div className="message-input-area">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe a development problem in your area..."
              rows="3"
            />

            <div className="message-input-footer">
              <span>
                You can write in your preferred language
              </span>

              <button
                type="button"
                className="send-message-btn"
                onClick={handleSend}
                disabled={!message.trim() || loading}
              >
                {loading ? "Analyzing..." : "Send Request →"}
              </button>
            </div>
          </div>
        </section>

        <aside className="messaging-info-card">
          <div className="info-icon">💡</div>

          <h2>How CivilIntel Works</h2>

          <div className="info-step">
            <span>1</span>
            <div>
              <h3>Citizen Message</h3>
              <p>
                Citizens describe development needs using text or messaging.
              </p>
            </div>
          </div>

          <div className="info-step">
            <span>2</span>
            <div>
              <h3>AI Analysis</h3>
              <p>
                The system identifies category, location, urgency, and demand.
              </p>
            </div>
          </div>

          <div className="info-step">
            <span>3</span>
            <div>
              <h3>Priority Intelligence</h3>
              <p>
                Requests contribute to regional hotspots and project
                recommendations.
              </p>
            </div>
          </div>

          <div className="example-message">
            <span>EXAMPLE MESSAGE</span>

            <p>
              "Heavy rainfall causes flooding in our area because the drainage
              system is poor. Roads are also damaged."
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Messaging;