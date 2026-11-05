
import React from "react";
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Music,
} from "lucide-react";

function Sidebar({
  activePage,
  setActivePage,
  playlists = [],
  onCreatePlaylist,
  onSelectPlaylist,
}) {
  return (
    <aside className="sidebar">
      <h1 className="logo">♫ Spotify</h1>

      <nav className="sidebar-nav">
        <button
          className={activePage === "home" ? "active" : ""}
          onClick={() => setActivePage("home")}
        >
          <Home size={22} /> Home
        </button>

        <button
          className={activePage === "search" ? "active" : ""}
          onClick={() => setActivePage("search")}
        >
          <Search size={22} /> Search
        </button>

        <button
          className={activePage === "library" ? "active" : ""}
          onClick={() => setActivePage("library")}
        >
          <Library size={22} /> Your Library
        </button>
      </nav>

      <div className="sidebar-playlists">
        <button onClick={onCreatePlaylist}>
          <Plus size={22} /> Create Playlist
        </button>

        <button
          className={activePage === "liked" ? "active" : ""}
          onClick={() => setActivePage("liked")}
        >
          <Heart size={22} /> Liked Songs
        </button>
      </div>

      <div className="sidebar-footer">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            className="sidebar-playlist-item"
            onClick={() => onSelectPlaylist(playlist)}
          >
            <Music size={16} />
            {playlist.name}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
