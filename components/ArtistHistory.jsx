
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import to get data passed from the previous page
import axios from "axios"; // Import axios for making API requests
import "../styles/ArtistHistoryStyle.css"; // Import the component's CSS styling
import logo from "../src/assets/logo.png"; // Import the logo image
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome for icons
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // Import left arrow icon

function ArtistHistory() {
  const location = useLocation(); // Access the current location
  const { artistData } = location.state || {}; // Get artistData from location state (if available)

  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track any errors
  const [artistDetails, setArtistDetails] = useState(null); // State to hold detailed artist information
  const [albums, setAlbums] = useState([]); // State to hold albums of the artist
  const [topTracks, setTopTracks] = useState([]); // State to hold top tracks of the artist

  useEffect(() => {
    const fetchArtistData = async () => {
      const token = localStorage.getItem('spotifyAccessToken'); // Retrieve Spotify access token from local storage
      if (artistData) {
        try {
          // Fetch additional artist details
          const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistData.id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Set authorization header
            },
          });
          setArtistDetails(artistResponse.data); // Set artist details state

          // Fetch albums
          const albumsResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistData.id}/albums`, {
            headers: {
              Authorization: `Bearer ${token}`, // Set authorization header
            },
          });
          setAlbums(albumsResponse.data.items); // Set albums state

          // Fetch top tracks
          const tracksResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistData.id}/top-tracks?market=US`, {
            headers: {
              Authorization: `Bearer ${token}`, // Set authorization header
            },
          });
          setTopTracks(tracksResponse.data.tracks); // Set top tracks state
        } catch (err) {
          console.error('Error fetching data from Spotify API', err); // Log any errors encountered during API calls
          setError('Failed to fetch data.'); // Set error state
        } finally {
          setLoading(false); // Set loading state to false regardless of success or failure
        }
      }
    };

    fetchArtistData(); // Call the function to fetch artist data
  }, [artistData]); // Run effect when artistData changes

  const handleBackClick = () => {
    window.history.back(); // Navigate back to the previous page
  };

  if (loading) {
    return <div>Loading...</div>; // Render loading state
  }

  if (error) {
    return <div>{error}</div>; // Render error message if there's an error
  }

  return (
    <div className="history-container"> {/* Main container for the artist history page */}
      <div className="image-back"> {/* Back button and logo section */}
        <span className="backBtn" onClick={handleBackClick}>
          <FontAwesomeIcon icon={faArrowLeft} /> {/* Left arrow icon for back navigation */}
        </span>
        <img className="logo" src={logo} alt="Logo" /> {/* Logo image */}
      </div>

      <div className="artist-history-container"> {/* Container for artist history details */}
        <div className="artist-container"> {/* Artist information section */}
          <img className="artist-img" src={artistData.images[0]?.url || "https://via.placeholder.com/150"} alt={artistData.name} /> {/* Artist image */}
          <h2 className="artist-name">{artistData.name}</h2> {/* Artist name */}
        </div>
        <div className="history-description"> {/* Description of artist's history */}
          <h1>History</h1>
          <p className="history-paragraph">
          {artistDetails && (
            <p>Genres: {artistDetails.genres.join(', ')}</p> // Display genres if available
          )}
          {artistDetails && (
            <p>Popularity: {artistDetails.popularity}</p> // Display popularity if available
          )}
          </p>
        </div>
      </div>
      <div className="more-info-container"> {/* Additional information about the artist */}
        <div className="albums-container"> {/* Albums section */}
          <h2>More About {artistData.name}</h2>
          <h4 className="album-title">Albums</h4>
          <div className="artist-albums"> {/* Container for albums */}
            {albums && albums.length > 0 ? (
              albums.map((album, index) => (
                <div className="album-item" key={index}> {/* Album item */}
                  <img
                    className="album-item-img"
                    src={album.images[0]?.url || "https://via.placeholder.com/50"} // Album cover image
                    alt={album.name} // Alt text for album image
                  />
                  <p>{album.name}</p> {/* Album name */}
                </div>
              ))
            ) : (
              <p>No albums available.</p> // Message if no albums found
            )}
          </div>
        </div>

        <div className="more-songs-container"> {/* Songs section */}
          <h2 className="song-title">Songs</h2>
          <div className="song-item"> {/* Header for song list */}
            <p>Name</p>
            <p>Album</p>
            <p>Time</p>
          </div>
          {topTracks && topTracks.length > 0 ? (
            topTracks.map((track) => (
              <div className="song-item" key={track.id}> {/* Track item */}
                <img className="song-cover" src={track.album.images[0]?.url || "https://via.placeholder.com/50"} alt={track.name} /> {/* Track cover image */}
                <p>{track.name}</p> {/* Track name */}
                <p>{track.album.name}</p> {/* Album name for the track */}
                <p>{Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}</p> {/* Duration in minutes and seconds */}
              </div>
            ))
          ) : (
            <p>No tracks available.</p> // Message if no tracks found
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtistHistory; // Export the ArtistHistory component
