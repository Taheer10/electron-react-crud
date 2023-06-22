import React, { useState, useEffect } from "react";
const { ipcRenderer } = window.require("electron");

const App = () => {
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);

  useEffect(() => {
    ipcRenderer.send("request-mainprocess-action", "read");
    ipcRenderer.on("mainprocess-response", (event, data) => {
      if (data && Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    });
  }, []);

  const addNewPost = (name) => {
    const newPost = {
      name,
      description,
      id: posts.length + 1,
    };
    ipcRenderer.send("request-mainprocess-action", "add", newPost);
    setPosts([...posts, newPost]);
  };

  const editPost = (id) => {
    const post = posts.find((post) => post.id === id);
    if (post) {
      setName(post.name);
      setDescription(post.description);
      setEditingPostId(post.id);
    }
  };

  const deletePost = (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    ipcRenderer.send("request-mainprocess-action", "delete", id);
    setPosts(updatedPosts);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingPostId) {
      const updatedPosts = posts.map((post) => {
        if (post.id === editingPostId) {
          return { ...post, name, description };
        }
        return post;
      });

      ipcRenderer.send(
        "request-mainprocess-action",
        "edit",
        editingPostId,
        name,
        description
      );
      setPosts(updatedPosts);
      setEditingPostId(null);
    } else {
      addNewPost(name);
    }
    setName("");
    setDescription("");
  };

  return (
    <div>
      {posts &&
        posts.map((post) => (
          <div key={post.id}>
            <h2>{post.name}</h2>
            <p>{post.description}</p>
            <button onClick={() => editPost(post.id)}>Edit</button>
            <button onClick={() => deletePost(post.id)}>Delete</button>
          </div>
        ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter post name"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter post description"
        />
        <button type="submit">
          {editingPostId ? "Update Post" : "Add New Post"}
        </button>
      </form>
    </div>
  );
};

export default App;
