
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

import tracks from "../data/tracks";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const savedPlaybackRef = useRef(null);
  const requestIdRef = useRef(0);

  const [currentTrack, setCurrentTrack] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("savedPlayback"));
      savedPlaybackRef.current = saved;
      return tracks.find((track) => track.id === saved?.trackId) || null;
    } catch {
      return null;
    }
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recentlyPlayed")) || [];
    } catch {
      return [];
    }
  });

  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");

  useEffect(() => {
    localStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Save the current song position.
  const savePlayback = () => {
    if (!currentTrack) return;

    localStorage.setItem(
      "savedPlayback",
      JSON.stringify({
        trackId: currentTrack.id,
        currentTime: audioRef.current.currentTime || 0,
      })
    );
  };

  // Restore position only when the app first loads.
  useEffect(() => {
    if (!currentTrack) return;

    const audio = audioRef.current;
    const saved = savedPlaybackRef.current;

    audio.src = currentTrack.audio;

    const restorePosition = () => {
      const savedTime =
        saved?.trackId === currentTrack.id
          ? saved.currentTime || 0
          : 0;

      audio.currentTime = Math.min(
        savedTime,
        audio.duration || savedTime
      );

      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("loadedmetadata", restorePosition, {
      once: true,
    });

    return () => {
      audio.removeEventListener("loadedmetadata", restorePosition);
    };
  }, []);

  // Save position while listening and before refreshing.
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);

      if (currentTrack) {
        localStorage.setItem(
          "savedPlayback",
          JSON.stringify({
            trackId: currentTrack.id,
            currentTime: audio.currentTime,
          })
        );
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    window.addEventListener("beforeunload", savePlayback);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      window.removeEventListener("beforeunload", savePlayback);
    };
  }, [currentTrack]);

  // Play a newly selected song from the beginning.
  const playTrack = async (track) => {
    if (!track) return;

    const audio = audioRef.current;
    const requestId = ++requestIdRef.current;

    audio.pause();
    audio.removeAttribute("src");
    audio.load();

    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setIsBuffering(true);

    savedPlaybackRef.current = {
      trackId: track.id,
      currentTime: 0,
    };

    localStorage.setItem(
      "savedPlayback",
      JSON.stringify({
        trackId: track.id,
        currentTime: 0,
      })
    );

    setRecentlyPlayed((previous) => [
      track,
      ...previous.filter((item) => item.id !== track.id),
    ].slice(0, 20));

    audio.src = track.audio;
    audio.load();

    try {
      await new Promise((resolve, reject) => {
        const handleReady = () => {
          audio.removeEventListener("canplay", handleReady);
          audio.removeEventListener("error", handleError);

          if (requestId !== requestIdRef.current) {
            resolve();
            return;
          }

          audio.currentTime = 0;
          setCurrentTime(0);
          resolve();
        };

        const handleError = () => {
          audio.removeEventListener("canplay", handleReady);
          audio.removeEventListener("error", handleError);
          reject(new Error("Unable to load this song."));
        };

        audio.addEventListener("canplay", handleReady, { once: true });
        audio.addEventListener("error", handleError, { once: true });
      });

      if (requestId !== requestIdRef.current) return;

      await audio.play();

      if (requestId === requestIdRef.current) {
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback failed:", error);
      if (requestId === requestIdRef.current) {
        setIsPlaying(false);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsBuffering(false);
      }
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!currentTrack) return;

    if (audio.paused) {
      setIsBuffering(true);

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error(error);
      } finally {
        setIsBuffering(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const playNext = () => {
    if (!currentTrack) return;

    const index = tracks.findIndex(
      (track) => track.id === currentTrack.id
    );

    let nextIndex;

    if (isShuffle && tracks.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (nextIndex === index);
    } else {
      nextIndex = (index + 1) % tracks.length;
    }

    playTrack(tracks[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentTrack) return;

    const index = tracks.findIndex(
      (track) => track.id === currentTrack.id
    );

    const previousIndex =
      (index - 1 + tracks.length) % tracks.length;

    playTrack(tracks[previousIndex]);
  };

  const toggleShuffle = () => {
    setIsShuffle((previous) => !previous);
  };

  const toggleRepeat = () => {
    setRepeatMode((previous) => {
      if (previous === "off") return "all";
      if (previous === "all") return "one";
      return "off";
    });
  };

  const seekTo = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updateDuration = () => setDuration(audio.duration || 0);
    const handleWaiting = () => setIsBuffering(true);

    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };

    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else if (repeatMode === "all") {
        playNext();
      } else {
        const index = tracks.findIndex(
          (track) => track.id === currentTrack?.id
        );

        if (index < tracks.length - 1) {
          playNext();
        } else {
          setIsPlaying(false);
        }
      }
    };

    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrack, repeatMode, isShuffle]);

  const value = {
    currentTrack,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    recentlyPlayed,
    audioRef,
    isShuffle,
    repeatMode,
    playTrack,
    togglePlay,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
    seekTo,
    setCurrentTime,
    setDuration,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
