import { useState } from "react";

function VoiceInput({ onTranscript, language = "en" }) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");

  const startListening = () => {
    setError("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    const languageMap = {
      en: "en-IN",
      kn: "kn-IN",
      hi: "hi-IN",
    };

    recognition.lang = languageMap[language] || "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }

      if (transcript.trim()) {
        onTranscript(transcript.trim(), true);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);

      if (event.error === "not-allowed") {
        setError("Microphone permission was denied.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Please try again.");
      } else {
        setError("Voice recognition failed. Please try again.");
      }
    };

    recognition.start();
  };

  return (
    <div className="voice-input">
      <button
        type="button"
        className={`voice-btn ${isListening ? "listening" : ""}`}
        onClick={startListening}
        disabled={isListening}
      >
        {isListening ? "🎙 Listening..." : "🎤 Speak Your Request"}
      </button>

      {isListening && (
        <p className="voice-status">
          Speak clearly. CivilIntel is converting your voice to text...
        </p>
      )}

      {error && (
        <p className="voice-error">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

export default VoiceInput;