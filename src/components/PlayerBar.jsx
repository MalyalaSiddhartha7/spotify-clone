
import React, { useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  Repeat1,
} from "lucide-react";

import { usePlayer } from "../context/PlayerContext";

function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    togglePlay,
    currentTime,
    duration,
    audioRef,
    setCurrentTime,
    setDuration,
    seekTo,
    playNext,
    playPrevious,
    isShuffle,
    repeatMode,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [audioRef, setCurrentTime, setDuration]);

  const formatTime = (time) => {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <footer className="player-bar">
      <div className="now-playing">
        {currentTrack && (
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="player-cover"
          />
        )}

        <div>
          <h4>{currentTrack?.title || "No song selected"}</h4>
          <p>{currentTrack?.artist || "Choose a track to listen"}</p>
        </div>
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button
            onClick={toggleShuffle}
            className={isShuffle ? "active-control" : ""}
            title="Shuffle"
            aria-label="Toggle shuffle"
          >
            <Shuffle size={18} />
          </button>

          <button onClick={playPrevious} aria-label="Previous song">
            <SkipBack />
          </button>

          <button
            className="play-button"
            onClick={togglePlay}
            disabled={!currentTrack || isBuffering}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isBuffering ? "…" : isPlaying ? <Pause /> : <Play />}
          </button>

          <button onClick={playNext} aria-label="Next song">
            <SkipForward />
          </button>

          <button
            onClick={toggleRepeat}
            className={repeatMode !== "off" ? "active-control" : ""}
            title={`Repeat ${repeatMode}`}
            aria-label="Toggle repeat"
          >
            {repeatMode === "one" ? <Repeat1 size={18} /> : <Repeat size={18} />}
          </button>
        </div>

        <div className="progress-container">
          <span>{formatTime(currentTime)}</span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => seekTo(Number(event.target.value))}
            className="progress-slider"
          />

          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="volume-control">
        <Volume2 />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          defaultValue="0.7"
          onChange={(event) => {
            audioRef.current.volume = Number(event.target.value);
          }}
        />
      </div>
    </footer>
  );
}

export default PlayerBar;
