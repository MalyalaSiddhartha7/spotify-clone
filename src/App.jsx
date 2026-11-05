
import React, { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TrackList from "./components/TrackList";
import LikedSongs from "./components/LikedSongs";
import PlaylistSection from "./components/PlaylistSection";
import RecentlyPlayed from "./components/RecentlyPlayed";
import PlayerBar from "./components/PlayerBar";
import Loader from "./components/Loader";

import { PlayerProvider } from "./context/PlayerContext";
import { Plus, Trash2 } from "lucide-react";
import tracks from "./data/tracks";

import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("playlists"));
      if (saved) return saved;
    } catch {}

    return [
      {
        id: "my-music",
        name: "My Music",
        trackIds: tracks.map((track) => track.id),
      },
      {
        id: "discover-weekly",
        name: "Discover Weekly",
        trackIds: tracks.slice(0, 3).map((track) => track.id),
      },
      {
        id: "chill-hits",
        name: "Chill Hits",
        trackIds: tracks.slice(1, 4).map((track) => track.id),
      },
      {
        id: "top-favorites",
        name: "Top Favorites",
        trackIds: tracks.slice(0, 2).map((track) => track.id),
      },
    ];
  });

  const [likedSongs, setLikedSongs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("likedSongs")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  }, [likedSongs]);

  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Clear search text whenever the user leaves the Search page.
  useEffect(() => {
    if (activePage !== "search") {
      setSearchQuery("");
    }
  }, [activePage]);

  const toggleLike = (trackId) => {
    setLikedSongs((previous) =>
      previous.includes(trackId)
        ? previous.filter((id) => id !== trackId)
        : [...previous, trackId]
    );
  };

  const handleCreatePlaylist = () => {
    const name = window.prompt("Enter your new playlist name:");

    if (!name || !name.trim()) return;

    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name: name.trim(),
      trackIds: [],
    };

    setPlaylists((previous) => [...previous, newPlaylist]);
    setSelectedPlaylist(newPlaylist);
    setActivePage("playlist");
  };

  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    setActivePage("playlist");
  };

  const currentPlaylist = playlists.find(
    (playlist) => playlist.id === selectedPlaylist?.id
  );

  const renamePlaylist = () => {
    if (!currentPlaylist) return;

    const newName = window.prompt(
      "Enter new playlist name:",
      currentPlaylist.name
    );

    if (!newName || !newName.trim()) return;

    setPlaylists((previous) =>
      previous.map((playlist) =>
        playlist.id === currentPlaylist.id
          ? { ...playlist, name: newName.trim() }
          : playlist
      )
    );
  };

  const deletePlaylist = () => {
    if (!currentPlaylist) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${currentPlaylist.name}"?`
    );

    if (!confirmDelete) return;

    setPlaylists((previous) =>
      previous.filter(
        (playlist) => playlist.id !== currentPlaylist.id
      )
    );

    setSelectedPlaylist(null);
    setActivePage("home");
  };

  const addSongToPlaylist = (trackId) => {
    if (!selectedPlaylist) return;

    setPlaylists((previous) =>
      previous.map((playlist) =>
        playlist.id === selectedPlaylist.id &&
        !playlist.trackIds.includes(trackId)
          ? {
              ...playlist,
              trackIds: [...playlist.trackIds, trackId],
            }
          : playlist
      )
    );
  };

  const removeSongFromPlaylist = (trackId) => {
    if (!selectedPlaylist) return;

    setPlaylists((previous) =>
      previous.map((playlist) =>
        playlist.id === selectedPlaylist.id
          ? {
              ...playlist,
              trackIds: playlist.trackIds.filter(
                (id) => id !== trackId
              ),
            }
          : playlist
      )
    );
  };

  const filteredTracks = tracks.filter((track) =>
    `${track.title} ${track.artist}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const playlistTracks = currentPlaylist
    ? tracks.filter((track) =>
        currentPlaylist.trackIds.includes(track.id)
      )
    : [];

  if (isLoading) return <Loader />;

  return (
    <PlayerProvider>
      <div className="spotify-app">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          playlists={playlists}
          onCreatePlaylist={handleCreatePlaylist}
          onSelectPlaylist={handleSelectPlaylist}
        />

        <main className="main-content">
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activePage={activePage}
          />

          {activePage === "home" && (
            <>
              <section className="welcome-section">
                <p>Welcome back</p>
                <h1>Good music. Good vibes.</h1>
                <p>Discover your next favourite song.</p>
              </section>

              <PlaylistSection tracks={tracks} />
              <RecentlyPlayed />

              <TrackList
                tracks={filteredTracks}
                likedSongs={likedSongs}
                toggleLike={toggleLike}
              />
            </>
          )}

          {activePage === "search" && (
            <TrackList
              tracks={filteredTracks}
              likedSongs={likedSongs}
              toggleLike={toggleLike}
            />
          )}

          {(activePage === "liked" || activePage === "library") && (
            <LikedSongs
              tracks={tracks}
              likedSongs={likedSongs}
              toggleLike={toggleLike}
            />
          )}

          {activePage === "playlist" && currentPlaylist && (
            <section className="track-section">
              <div className="playlist-title-row">
                <h2>{currentPlaylist.name}</h2>

                <div className="playlist-action-buttons">
                  <button
                    className="rename-playlist-button"
                    onClick={renamePlaylist}
                  >
                    Rename
                  </button>

                  <button
                    className="delete-playlist-button"
                    onClick={deletePlaylist}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>

              <h3 className="playlist-subheading">
                Songs in this playlist
              </h3>

              {playlistTracks.length > 0 ? (
                <div className="track-list">
                  {playlistTracks.map((track, index) => (
                    <div className="track-row" key={track.id}>
                      <span className="track-number">
                        {index + 1}
                      </span>

                      <img
                        src={track.cover}
                        alt={track.title}
                        className="track-cover"
                      />

                      <div className="track-info">
                        <h4>{track.title}</h4>
                        <p>{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">
                  This playlist is empty. Add some songs below!
                </p>
              )}

              <h3 className="playlist-subheading">Add songs</h3>

              <div className="track-list">
                {tracks.map((track) => {
                  const alreadyAdded =
                    currentPlaylist.trackIds.includes(track.id);

                  return (
                    <div className="track-row" key={track.id}>
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
                        className={
                          alreadyAdded
                            ? "add-song-button remove-song-button"
                            : "add-song-button"
                        }
                        onClick={() =>
                          alreadyAdded
                            ? removeSongFromPlaylist(track.id)
                            : addSongToPlaylist(track.id)
                        }
                      >
                        {alreadyAdded ? (
                          <>
                            <Trash2 size={17} />
                            Remove
                          </>
                        ) : (
                          <>
                            <Plus size={18} />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>

        <PlayerBar />
      </div>
    </PlayerProvider>
  );
}

export default App;
