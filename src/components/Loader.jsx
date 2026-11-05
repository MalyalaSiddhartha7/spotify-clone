import React from "react";

function Loader() {
  return (
    <div className="loader-screen">
      <div className="loader-logo">♫</div>
      <h2>Spotify Clone</h2>
      <div className="loader-bar">
        <div className="loader-progress"></div>
      </div>
      <p>Loading your music...</p>
    </div>
  );
}

export default Loader;