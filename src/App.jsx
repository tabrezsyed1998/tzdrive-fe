import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const BASE_URL = "http://localhost:3000";
  const [directoryItems, setDirectoryItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [newFilename, setNewFilename] = useState("");

  async function getDirectoryItems() {
    const response = await fetch(`${BASE_URL}/directory`);
    const data = await response.json();
    setDirectoryItems(data);
  }
  useEffect(() => {
    getDirectoryItems();
  }, []);

  async function uploadFile(e) {
    const file = e.target.files[0];
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/files/${file.name}`, true);
    xhr.addEventListener("load", () => {
      console.log(xhr.response);
      getDirectoryItems();
    });
    xhr.upload.addEventListener("progress", (e) => {
      const totalProgress = (e.loaded / e.total) * 100;
      setProgress(totalProgress.toFixed(2));
    });
    xhr.send(file);
  }

  async function handleDelete(filename) {
    const response = await fetch(`${BASE_URL}/files/${filename}`, {
      method: "DELETE",
    });
    const data = await response.text();
    console.log(data);
    getDirectoryItems();
  }

  async function renameFile(oldFilename) {
    console.log({ oldFilename, newFilename });
    setNewFilename(oldFilename);
  }

  async function saveFilename(oldFilename) {
    setNewFilename(oldFilename);
    const response = await fetch(`${BASE_URL}/files/${oldFilename}`, {
      method: "PATCH",
      headers: {
         "Content-Type" : "application/json"
      },
      body: JSON.stringify({newFilename}),

    });
    const data = await response.text();
    console.log(data);
    setNewFilename("");
    getDirectoryItems();
  }

  return (
    <>
      <h1>My Files</h1>
      <input type="file" onChange={uploadFile} />
      <input
        type="text"
        onChange={(e) => setNewFilename(e.target.value)}
        value={newFilename}
      />
      <p>Progress: {progress}%</p>
      {directoryItems.map((item, i) => (
        <div key={i}>
          {item} <a href={`${BASE_URL}/files/${item}?action=open`}>Open</a>{" "}
          <a href={`${BASE_URL}/files/${item}?action=download`}>Download</a>
          <button onClick={() => renameFile(item)}>Rename</button>
          <button onClick={() => saveFilename(item)}>Save</button>
          <button
            onClick={() => {
              handleDelete(item);
            }}
          >
            Delete
          </button>
          <br />
        </div>
      ))}
    </>
  );
}

export default App;
