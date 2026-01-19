import React, { useEffect, useState } from "react";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getAllPhotos() {
    try {
      // Fetch first two pages to get 20 photos
      const [page1, page2] = await Promise.all([
        fetch("https://boringapi.com/api/v1/photos/"),
        fetch("https://boringapi.com/api/v1/photos/?page=2")
      ]);
      
      if (!page1.ok || !page2.ok) {
        throw new Error("Failed to fetch photos");
      }
      
      const data1 = await page1.json();
      const data2 = await page2.json();
      
      console.log("API Data:", data1, data2);
      
      // Combine photos from both pages and take first 20
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
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h1>Please wait ....</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <h1>Photo Gallery</h1>

      <div className="photo-grid">
        {photos.map((photo) => (
          <div className="photo-card" key={photo.id}>
            <img
              src={photo.url}
              alt={photo.title}
              onError={(e) => {
                e.target.src = `https://picsum.photos/seed/photo${photo.id}/150/150.jpg`;
              }}
            />
            <h2 className="photo-title">
              {photo.id}. {photo.title}
            </h2>
            <p className="photo-description">{photo.title}</p>
          </div>
        ))}
      </div>
    </>
  );
}