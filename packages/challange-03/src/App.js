import React, { useState, useEffect } from "react";

import api from "./services/api";

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get("/repositories").then((res) => setRepositories(res.data));
  }, []);

  async function handleAddRepository() {
    const res = await api.post("/repositories", {
      title: "tindev",
      url: "http://github.com/gabrielbartoczevicz/tindev",
      techs: ["NodeJS", "ReactJS", "React Native"],
    });

    setRepositories([...repositories, res.data]);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`);

    setRepositories(repositories.filter((r) => r.id !== id));
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map((r) => (
          <li key={r.id}>
            {r.title}
            <button onClick={() => handleRemoveRepository(r.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
