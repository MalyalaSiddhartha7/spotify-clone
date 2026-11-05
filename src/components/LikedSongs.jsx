import React from "react";
import { Heart, Play } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

function LikedSongs({ tracks, likedSongs, toggleLike }) {
  const { playTrack } = usePlayer();

  const likedTracks = tracks.filter((track) =>
    likedSongs.includes(track.id)
  );

  return (
    <section className="track-section">
      <h2>❤️ Liked Songs ({likedTracks.length})</h2>

      {likedTracks.length === 0 ? (
        <p className="empty-message">
          You haven't liked any songs yet. Tap the heart to save a song!
        </p>
      ) : (
        <div className="track-list">
          {likedTracks.map((track, index) => (
            <div className="track-row" key={track.id}>
              <span className="track-number">{index + 1}</span>

              <img
                src={track.cover}
                alt={track.title}
                className="track-cover"
              />

              <div className="track-info">
                <h4>{track.title}</h4>
                <p>{track.artist}</p>
              </div>

              <button
                className="like-button liked"
                onClick={() => toggleLike(track.id)}
                aria-label="Unlike song"
              >
                <Heart fill="currentColor" />
              </button>

              <button
                className="track-play"
                onClick={() => playTrack(track)}
                aria-label={`Play ${track.title}`}
              >
                <Play size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default LikedSongs;