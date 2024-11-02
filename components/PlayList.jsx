import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to access URL parameters
import axios from "axios";
import logo from "../src/assets/logo.png"; // Import app logo
import FooterPlayer from "../components/FooterPlayer"; // Import FooterPlayer component
import SearchForSong from "../pages/SearchForSong"; // Import SearchForSong component
import Sidebar from "./SideBar"; // Import Sidebar component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome for icons
import { faBars, faTrash } from "@fortawesome/free-solid-svg-icons"; // Import specific icons
import "../styles/playlist.css"; // Import styles for the playlist

function PlayList() {
  const { playlistName } = useParams(); // Get the playlist name from the URL parameters
  const [playlist, setPlaylist] = useState([]); // State for storing playlist songs
  const [playlistImage, setPlaylistImage] = useState("https://via.placeholder.com/150"); // Default image for the playlist
  const [currentTrack, setCurrentTrack] = useState(null); // State for the currently selected track
  const [language, setLanguage] = useState("en"); // State for language, default is English
  const token = localStorage.getItem('spotifyAccessToken'); // Retrieve Spotify access token from local storage

  // Fetch a random album image from Spotify's new releases
  const fetchRandomAlbumImage = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
        headers: {
          Authorization: `Bearer ${token}`, // Set authorization header with token
        },
      });

      const albums = response.data.albums.items; // Get albums from the response
      const randomAlbumIndex = Math.floor(Math.random() * albums.length); // Get a random album index
      const randomAlbum = albums[randomAlbumIndex]; // Select a random album

      // Set the playlist image to the random album image
      setPlaylistImage(randomAlbum.images[0]?.url || "https://via.placeholder.com/150");
    } catch (error) {
      console.error("Error fetching random album image:", error); // Log any errors
    }
  };

  useEffect(() => {
    fetchRandomAlbumImage(); // Call the function to fetch a random album image when the component mounts
  }, []);

  // Function to add a random song to the playlist
  const addRandomSong = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
        headers: {
          Authorization: `Bearer ${token}`, // Set authorization header with token
        },
      });

      const albums = response.data.albums.items; // Get albums from the response
      const randomAlbumIndex = Math.floor(Math.random() * albums.length); // Get a random album index
      const randomAlbum = albums[randomAlbumIndex]; // Select a random album

      // Fetch the tracks for the selected random album
      const tracksResponse = await axios.get(`https://api.spotify.com/v1/albums/${randomAlbum.id}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`, // Set authorization header with token
        },
      });

      const tracks = tracksResponse.data.items; // Get tracks from the response
      const randomTrackIndex = Math.floor(Math.random() * tracks.length); // Get a random track index
      const randomTrack = tracks[randomTrackIndex]; // Select a random track

      // Create a new song object to add to the playlist
      const newSong = {
        id: randomTrack.id,
        title: randomTrack.name,
        album: randomAlbum.name,
        artist: randomTrack.artists[0].name,
        time: "3:30", // Placeholder for track duration
        image: randomAlbum.images[0]?.url || "https://via.placeholder.com/150", // Set image or placeholder
        preview_url: randomTrack.preview_url, // Track preview URL
      };

      // Update the playlist state with the new song
      setPlaylist((prevPlaylist) => [...prevPlaylist, newSong]);
      setPlaylistImage(randomAlbum.images[0]?.url || "https://via.placeholder.com/150"); // Update playlist image
    } catch (error) {
      console.error("Error fetching random song:", error); // Log any errors
    }
  };

  // Function to remove a song from the playlist by id
  const removeSong = (id) => {
    setPlaylist(playlist.filter(song => song.id !== id)); // Filter out the song with the given id
  };

  // Handle song click to play in FooterPlayer
  const handleSongClick = (song) => {
    setCurrentTrack(song); // Set the current track when a song is clicked
  };

  // Handle language change to toggle between English and Arabic
  const handleLanguageChange = () => {
    setLanguage(language === "en" ? "ar" : "en"); // Toggle between English and Arabic
  };

  return (
    <div className="playlist-container">
      <div>
        <div className="playlist-input-logo-container">
          <SearchForSong /> {/* SearchForSong component for searching songs */}
          <button className="playlist-language-button" onClick={handleLanguageChange}>
            {language === "en" ? "Arabic" : "English"} {/* Button to change language */}
          </button>
          <img className="playList-logo" src={logo} alt="App Logo" /> {/* App logo */}
        </div>

        <div className="playlist-body">
          <div className="created-info-playlist">
            <img
              className="main-playlist-image"
              src={playlistImage}
              alt="Playlist Cover" // Image for the playlist cover
            />
            <div className="my-playlist-container">
              <p className="my-playlist-title">
                {language === "en" ? playlistName : "اسم قائمة التشغيل"} 
              </p>
              <p className="artist-playlist">
                {playlist.length > 0 ? playlist[0].artist : (language === "en" ? "Unknown Artist" : "فنان غير معروف")}
              </p>
            </div>

            <div className="playlist-btns-container">
              <button className="playlist-buttons" onClick={addRandomSong}>＋</button> {/* Button to add a random song */}
            </div>
          </div>

          <div className="playlist-table-container">
            <SearchForSong /> {/* SearchForSong component for searching songs */}
            <table id="songTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th></th>
                  <th>{language === "en" ? "Title" : "العنوان"}</th>
                  <th>{language === "en" ? "Album" : "الألبوم"}</th>
                  <th>{language === "en" ? "Artist" : "الفنان"}</th>
                  <th>{language === "en" ? "Time" : "المدة"}</th>
                  <th>{language === "en" ? "Action" : "إجراء"}</th>
                </tr>
              </thead>
              <tbody>
                {playlist.map((song, index) => (
                  <tr key={song.id} onClick={() => handleSongClick(song)}> 
                    <td>{index + 1}</td> {/* Display song index */}
                    <td>
                      <img className="table-image" src={song.image} alt={song.title} /> {/* Song image */}
                    </td>
                    <td>{song.title}</td> {/* Song title */}
                    <td>{song.album}</td> {/* Song album */}
                    <td>{song.artist}</td> {/* Song artist */}
                    <td>{song.time}</td> {/* Song duration */}
                    <td>
                      <button className="playlist-action-btn" onClick={() => removeSong(song.id)}>
                        <FontAwesomeIcon icon={faTrash} /> {/* Trash icon for removing song */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Sidebar /> {/* Sidebar component for navigation */}
        <div className="fps">
          <FooterPlayer track={currentTrack} />  {/* FooterPlayer component to play the current track */}
        </div>
      </div>
    </div>
  );
}

export default PlayList; // Export the PlayList component
