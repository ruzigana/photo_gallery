import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getAllPhotos() {
    try {
      const [page1, page2] = await Promise.all([
        fetch("https://boringapi.com/api/v1/photos/"),
        fetch("https://boringapi.com/api/v1/photos/?page=2")
      ]);

      if (!page1.ok || !page2.ok) {
        throw new Error("Failed to fetch photos");
      }

      const data1 = await page1.json();
      const data2 = await page2.json();

      const allPhotos = [...data1.photos, ...data2.photos];
      setPhotos(allPhotos.slice(0, 20));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllPhotos();
  }, []);

  if (loading) {
    return <h2 className="center">Loading photos...</h2>;
  }

  if (error) {
    return <h2 className="center error">Error: {error}</h2>;
  }

  return (
    <div className="container">
      <h1 className="gallery-title">Photo Gallery</h1>

      <div className="photo-grid">
        {photos.map((photo) => (
          <div className="photo-card" key={photo.id}>
            <img
              src={photo.url}
              alt={photo.title}
              onError={(e) => {
                e.target.src = `https://picsum.photos/seed/${photo.id}/300/200`;
              }}
            />
            <p className="photo-title">{photo.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}