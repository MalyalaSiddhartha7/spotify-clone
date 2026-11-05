
import React from "react";
import { Play, Heart } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

function TrackList({ tracks, likedSongs, toggleLike }) {
  const { playTrack } = usePlayer();

  return (
    <section className="track-section">
      <h2>Popular Tracks</h2>

      <div className="track-list">
        {tracks.map((track, index) => (
          <div
            className="track-row"
            key={track.id}
            onClick={() => playTrack(track)}
            style={{ cursor: "pointer" }}
          >
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
              className={`like-button ${
                likedSongs.includes(track.id) ? "liked" : ""
              }`}
              onClick={(event) => {
                event.stopPropagation();
                toggleLike(track.id);
              }}
              aria-label="Like or unlike song"
            >
              <Heart
                size={20}
                fill={
                  likedSongs.includes(track.id)
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

            <span className="track-duration">
              {track.duration}
            </span>

            <button
              className="track-play"
              onClick={(event) => {
                event.stopPropagation();
                playTrack(track);
              }}
              aria-label={`Play ${track.title}`}
            >
              <Play size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrackList;
