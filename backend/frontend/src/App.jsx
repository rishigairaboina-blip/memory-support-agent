import { useState } from "react";

function App() {
  const [customer, setCustomer] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [memories, setMemories] = useState([]);
  const [status, setStatus] = useState("");

  const saveMemory = async () => {
    if (!customer || !message) {
      setStatus("Please enter customer name and message.");
      return;
    }

    setStatus("Saving memory...");

    try {
      const response = await fetch("http://127.0.0.1:8000/memory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `Customer ${customer}: ${message}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save memory");
      }

      setStatus("Memory saved successfully!");
      setMessage("");
    } catch (error) {
      console.error(error);
      setStatus("Could not connect to backend.");
    }
  };

  const recallMemory = async () => {
    if (!query) {
      setStatus("Please enter something to search.");
      return;
    }

    setStatus("Searching memories...");

    try {
      const response = await fetch("http://127.0.0.1:8000/recall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to recall memory");
      }

      const data = await response.json();

      setMemories(data.memories || []);
      setStatus("Memories recalled successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Could not connect to backend.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>🧠 Memory Support Agent</h1>

        <p style={styles.subtitle}>
          Save and recall customer support memories
        </p>

        <label>Customer Name</label>
        <input
          type="text"
          placeholder="e.g. Alex"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />

        <label>Customer Message</label>
        <textarea
          placeholder="e.g. My Dell laptop is overheating"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={saveMemory}>Save Memory</button>

        <hr style={styles.divider} />

        <label>Recall Customer Memory</label>
        <input
          type="text"
          placeholder="e.g. What laptop does Alex own?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button onClick={recallMemory}>Recall Memory</button>

        {memories.length > 0 && (
          <div style={styles.results}>
            <h3>Recalled Memories</h3>

            {memories.map((memory, index) => (
              <div key={index} style={styles.memory}>
                {memory}
              </div>
            ))}
          </div>
        )}

        {status && <p style={styles.status}>{status}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },

  card: {
    width: "500px",
    background: "white",
    padding: "35px",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
  },

  subtitle: {
    color: "#666",
    marginBottom: "25px",
  },

  divider: {
    margin: "30px 0",
    border: "none",
    borderTop: "1px solid #ddd",
  },

  status: {
    marginTop: "20px",
    color: "#2563eb",
  },

  results: {
    marginTop: "25px",
  },

  memory: {
    background: "#f4f7fb",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "10px",
  },
};

export default App;
