
import React from "react";
import { Play } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

const playlists = [
  {
    id: 1,
    name: "Chill Vibes",
    description: "Relax and enjoy your day",
    image: "https://picsum.photos/seed/chill/300/300",
    trackIndexes: [0, 1],
  },
  {
    id: 2,
    name: "Daily Mix",
    description: "Music picked for you",
    image: "https://picsum.photos/seed/daily/300/300",
    trackIndexes: [1, 2],
  },
  {
    id: 3,
    name: "Top Hits",
    description: "Popular music collection",
    image: "https://picsum.photos/seed/hits/300/300",
    trackIndexes: [0, 2, 3],
  },
  {
    id: 4,
    name: "Focus Music",
    description: "Stay focused and productive",
    image: "https://picsum.photos/seed/focus/300/300",
    trackIndexes: [3, 4],
  },
];

function PlaylistSection({ tracks = [] }) {
  const { playTrack } = usePlayer();

  const handlePlaylistClick = (playlist) => {
    const firstTrack = playlist.trackIndexes
      .map((index) => tracks[index])
      .find(Boolean);

    if (firstTrack) {
      playTrack(firstTrack);
    } else {
      alert("No songs available in this playlist.");
    }
  };

  return (
    <section className="playlist-section">
      <h2>Made for You</h2>

      <div className="playlist-grid">
        {playlists.map((playlist) => (
          <div
            className="playlist-card"
            key={playlist.id}
            onClick={() => handlePlaylistClick(playlist)}
            style={{ cursor: "pointer" }}
          >
            <img src={playlist.image} alt={playlist.name} />

            <h3>{playlist.name}</h3>
            <p>{playlist.description}</p>

            <button
              aria-label={`Play ${playlist.name}`}
              onClick={(event) => {
                event.stopPropagation();
                handlePlaylistClick(playlist);
              }}
            >
              <Play size={20} fill="currentColor" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PlaylistSection;
