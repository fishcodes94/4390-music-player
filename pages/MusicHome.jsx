
import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar.jsx";
import CustomizationSidebar from "../components/CustomizationSidebar.jsx";
import "../styles/MusicHomeStyle.css";
import logo from "../src/assets/logo.png";
import SearchForSong from "./SearchForSong.jsx";
import FooterPlayer from "../components/FooterPlayer.jsx";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from "../components/LanguageContext.jsx"; // Import the useLanguage hook

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

function MusicHome() {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [todaysHits, setTodaysHits] = useState([]);
  const [initialRandomSongs, setInitialRandomSongs] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [userFirstName, setUserFirstName] = useState('Guest');
  const [showCustomization, setShowCustomization] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('');
  const token = localStorage.getItem('spotifyAccessToken');

  const { language, toggleLanguage } = useLanguage(); // Access language and toggleLanguage function

  useEffect(() => {
    const firstName = localStorage.getItem("userFirstName");
    if (firstName) {
      setUserFirstName(firstName);
    }


    //get random songs from API
    const fetchRandomSongs = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/browse/new-releases?limit=6', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInitialRandomSongs(response.data.albums.items);
      } catch (error) {
        console.error('Error fetching random songs:', error);
      }
    };

    //get recently played songs from api
    const fetchRecentlyPlayed = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=6', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.items.length > 0) {
          setRecentlyPlayed(response.data.items);
        } else {
          fetchRandomSongs();
        }
      } catch (error) {
        console.error('Error fetching recently played:', error);
        fetchRandomSongs();
      }
    };

    //get todays hits from api
    const fetchTodaysHits = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/browse/new-releases?limit=6', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodaysHits(response.data.albums.items);
      } catch (error) {
        console.error('Error fetching today\'s hits:', error);
      }
    };

    fetchRecentlyPlayed();
    fetchTodaysHits();
  }, [token]);

  //when user clicks play button on track it updates footer and plays song
  const handleTrackClick = debounce((track) => {
    const newTrack = {
      name: track.track?.name || track.name || 'Unknown Track',
      artist: track.track?.artists[0]?.name || track.artists[0]?.name || 'Unknown Artist',
      image: track.track?.album.images[0]?.url || track.images[0]?.url || 'https://via.placeholder.com/150',
      preview_url: track.track?.preview_url || track.preview_url,
    };
    console.log(newTrack);
    setCurrentTrack(newTrack);
  }, 300);


  
  const handleColorChange = (color) => {
    setBackgroundColor(color); // Update the background color
  };

  const toggleCustomization = () => {
    setShowCustomization(!showCustomization); // Toggle between sidebar and customization
  };

  return (
    <div className="main-container" style={{ backgroundColor: backgroundColor || '#005035' }}>
      <div className="home-screen-page">
        {showCustomization ? (
          <CustomizationSidebar onColorChange={handleColorChange} /> // Show customization sidebar
        ) : (
          <Sidebar onToggleCustomization={toggleCustomization} /> // Pass toggle function to sidebar
        )}
        <div className="home-screen-container">
          <div className="input-language-logo-container">
            <SearchForSong />
            <button className="language-button" onClick={toggleLanguage}>

              {language === 'en' ? 'Arabic' : 'English'}
            </button>
            <img className="home-logo" src={logo} alt="Logo" />
          </div>
          <h1 className="main-title">

            {language === 'en' ? `Good Morning, ${userFirstName}` : `صباح الخير, ${userFirstName}`}
          </h1>
          <h3 className="recently-played-title">
    
            {language === 'en' ? 'Recently Played' : 'تم تشغيله مؤخرًا'}
          </h3>
          <div className="recently-played-container">
            {(recentlyPlayed.length > 0 ? recentlyPlayed : initialRandomSongs).map((track) => {
              const albumImages = track.track?.album.images || track.images || [];
              const trackImage = albumImages.length > 0 ? albumImages[0]?.url : 'https://via.placeholder.com/150';
              const trackName = track.track?.name || track.name || 'Unknown Track';
              const artistName = track.track?.artists[0]?.name || track.artists[0]?.name || 'Unknown Artist';

              return (
                <div className="recently-played-items" key={track.track?.id || track.id}>
                  <img className="artist-image" src={trackImage} alt={trackName} />
                  <div className="song-artist">
                    <h3 className="home-track-name">{trackName}</h3>
                    <h4 className="home-artist-name">{artistName}</h4>
                  </div>
                  <button className="play-button" onClick={() => handleTrackClick(track)}>
                    <FontAwesomeIcon className="play-icon" icon={faPlay} size="xs" />
                  </button>
                </div>
              );
            })}
          </div>
          <h3 className="todays-hits-title">
            {language === 'en' ? "Today's Hits" : 'أغاني اليوم'}
          </h3>
          <div className="todays-hits-container">
            {todaysHits.map((album) => (
              <div className="todays-hits-items" key={album.id}>
                <img
                  className="artist-image"
                  src={album.images[0]?.url || 'https://via.placeholder.com/150'}
                  alt={album.name}
                />
                <div className="song-artist">
                  <h3 className="home-track-name">{album.name}</h3>
                  <h4 className="home-artist-name">{album.artists[0]?.name || 'Unknown Artist'}</h4>
                </div>
                <button className="play-button" onClick={() => handleTrackClick(album)}>
                  <FontAwesomeIcon className="play-icon" icon={faPlay} size="xs" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="foot-container">
      <FooterPlayer track={currentTrack} trackList={recentlyPlayed} className="footer-style" />

      </div>
    </div>
  );
}

export default MusicHome;


