import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [message, setMessage] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Auto load all todos on page load
  useEffect(() => {
    loadAllTodos();
  }, []);

  const loadAllTodos = async () => {
    try {
      const res = await axios.post(
        "https://ai-base-todo-app.vercel.app/api/agent",
        { message: "show all todos" }
      );
      setResults(res.data.results || []);
    } catch (error) {
      console.error("Auto load error:", error);
    }
  };

  const sendMessage = async () => {
    if (!message) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "https://ai-base-todo-app.vercel.app/api/agent",
        { message }
      );

      setMessage("");

      // 🔥 Always reload fresh todos after action
      await loadAllTodos();

    } catch (error) {
      console.error(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>🤖 AI Todo Agent</h1>

        <div style={styles.inputBox}>
          <input
            type="text"
            placeholder="Add buy milk and show milk todos"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} style={styles.button}>
            {loading ? "Processing..." : "Send"}
          </button>
        </div>

        <div style={styles.resultBox}>
          {results.length === 0 && (
            <p style={{ textAlign: "center", opacity: 0.6 }}>
              No todos found...
            </p>
          )}

          {results.map((item, index) => (
            <div key={index} style={styles.card}>
              <h3 style={styles.cardTitle}>{item.message}</h3>

              {item.todos &&
                item.todos.map((todo) => (
                  <p key={todo._id} style={styles.todoItem}>
                    📌 {todo.text} |{" "}
                    <strong>
                      {todo.completed ? "Completed" : "Pending"}
                    </strong>
                  </p>
                ))}

              {item.todo && (
                <p>
                  📝 {item.todo.text}
                </p>
              )}

              {item.updated && (
                <p>
                  ✏️ {item.updated.text}
                </p>
              )}

              {item.deleted && (
                <p style={{ color: "red" }}>
                  🗑️ Deleted: {item.deleted.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "650px",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#333",
  },
  inputBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#667eea",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "10px",
  },
  card: {
    background: "#f9f9f9",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },
  cardTitle: {
    marginBottom: "8px",
    color: "#444",
  },
  todoItem: {
    marginLeft: "10px",
  },
};
