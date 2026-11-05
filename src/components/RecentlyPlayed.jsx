
import React from "react";
import { Play } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

function RecentlyPlayed() {
  const { recentlyPlayed, playTrack } = usePlayer();

  return (
    <section className="recent-section">
      <div className="recent-heading">
        <h2>Recently Played</h2>
        <span>{recentlyPlayed.length} songs</span>
      </div>

      {recentlyPlayed.length === 0 ? (
        <p className="empty-message">
          Play a song to see your listening history here.
        </p>
      ) : (
        <div className="recent-grid">
          {recentlyPlayed.map((track) => (
            <div
              className="recent-card"
              key={track.id}
              onClick={() => playTrack(track)}
              style={{ cursor: "pointer" }}
            >
              <img src={track.cover} alt={track.title} />

              <div className="recent-info">
                <h4>{track.title}</h4>
                <p>{track.artist}</p>
              </div>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  playTrack(track);
                }}
                aria-label={`Play ${track.title}`}
              >
                <Play size={18} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentlyPlayed;
