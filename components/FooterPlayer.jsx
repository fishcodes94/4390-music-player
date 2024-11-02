

import React, { useEffect, useRef, useState } from "react";
import "../styles/FooterPlayerStyle.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle, faBackward, faForward, faPlay, faPause, faRepeat } from '@fortawesome/free-solid-svg-icons';

function FooterPlayer({ track }) {
  const audioRef = useRef(new Audio()); // Keep a persistent Audio instance
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    // Load the new track if available
    if (track?.preview_url) {
      audio.src = track.preview_url;
      audio.load();

      // Play the audio when the track changes
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    }

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("timeupdate", updateTime);
      audio.pause(); // Pause the audio on unmount
    };
  }, [track]);

  const handlePlayPause = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    }
  };

  // Seek functionality for the slider
  const handleSliderChange = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <footer className="footer-player">
      <div className="song-info">
        <img
          src={track?.image || "https://i.scdn.co/image/ab67616d00001e028a9dc89bd612b7f4670e2390"}
          alt="Song Thumbnail"
          className="song-thumbnail"
        />
        <div className="song-details">
          <p className="song-title">{track?.name || "Song Title"}</p>
          <p className="footer-artist-name">{track?.artist || "Artist Name"}</p>
        </div>
      </div>

      <div className="progress-bar">
        <div className="player-controls">
          <button className="shuffle-btn">
            <FontAwesomeIcon icon={faShuffle} size="xs" />
          </button>
          <button className="prev-btn">
            <FontAwesomeIcon icon={faBackward} size="xs"  /> 
          </button>
          <button className="play-btn" onClick={handlePlayPause}>
            {isPlaying ? (
              <FontAwesomeIcon icon={faPause} size="xs"  /> // Pause icon when playing
            ) : (
              <FontAwesomeIcon icon={faPlay} size="xs"  /> // Play icon when paused
            )}
          </button>
          <button className="next-btn">
            <FontAwesomeIcon icon={faForward} size="xs"  /> 
          </button>
          <button className="repeat-btn">
            <FontAwesomeIcon icon={faRepeat} size="xs"  /> 
          </button>
        </div>

        <div className="slider-container">
          <span className="current-time">{Math.floor(currentTime)}s</span>
          <input
            type="range"
            className="progress-slider"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSliderChange}
          />
          <span className="total-time">{Math.floor(duration)}s</span>
        </div>
      </div>
    </footer>
  );
}

export default FooterPlayer;




