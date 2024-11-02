
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import hooks for routing
import axios from "axios"; // Import axios for API requests
import SearchForSong from "../pages/SearchForSong"; // Import the song search component
import FooterPlayer from "./FooterPlayer"; // Import the footer player component
import Sidebar from "./SideBar"; // Import the sidebar component
import logo from "../src/assets/logo.png"; // Import logo image
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome for icons
import { faPlay } from "@fortawesome/free-solid-svg-icons"; // Import the play icon
import "../styles/ArtistPage.css"; // Import component-specific styles

function ArtistPage() {
  const { artistId } = useParams(); // Get the artist ID from the URL parameters
  const [artistData, setArtistData] = useState(null); // State to store artist details
  const [topTracks, setTopTracks] = useState([]); // State to store top tracks of the artist
  const [albums, setAlbums] = useState([]); // State to store albums of the artist
  const [relatedArtists, setRelatedArtists] = useState([]); // State to store related artists
  const [currentTrack, setCurrentTrack] = useState(null); // State for the currently playing track
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchArtistData = async () => {
      const token = localStorage.getItem('spotifyAccessToken'); // Get access token from local storage
      try {
        // Fetch artist details from Spotify API
        const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArtistData(artistResponse.data); // Set artist data in state

        // Fetch artist's top tracks
        const topTracksResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTopTracks(topTracksResponse.data.tracks.slice(0, 5)); // Limit to top 5 tracks

        // Fetch artist's albums
        const albumsResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=US`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAlbums(albumsResponse.data.items.slice(0, 6)); // Limit to top 6 albums

        // Fetch related artists
        const relatedArtistsResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRelatedArtists(relatedArtistsResponse.data.artists.slice(0, 6)); // Limit to 6 related artists
      } catch (error) {
        console.error('Error fetching artist data', error); // Log any errors
      }
    };

    fetchArtistData(); // Call the fetch function on component mount
  }, [artistId]); // Dependency array to re-run effect if artistId changes

  const handleHistoryClick = () => {
    if (artistData) {
      navigate("/artist-history", { state: { artistData } }); // Navigate to artist history page with artist data
    }
  };

  const handleTrackClick = (track) => {
    // Create a new track object with the image and artist name included
    const trackWithImage = {
      ...track,
      image: track.album.images[0]?.url || "https://via.placeholder.com/300", // Ensure image property is set
      artist: track.artists.map(artist => artist.name).join(", "), // Join artist names into a single string
    };
    setCurrentTrack(trackWithImage); // Set the current track when clicked
  };

  // New function to play the top track on button click
  const handlePlayTopTrack = () => {
    if (topTracks.length > 0) {
      handleTrackClick(topTracks[0]); // Play the top track
    }
  };

  return (
    <div className="app-container">
      <div>
        <div className="input-logo-container">
          <SearchForSong /> {/* Search for songs component */}
          <img className="artist-page-logo" src={logo} alt="Logo" /> {/* Logo */}
        </div>
      </div>

      <div className="top-result-song">
        <div className="label-container">
          <p className="top-result-label">Top Result</p>
          <p className="song-result-label">Song Result</p>
        </div>

        <div className="top-result-main-container">
          {artistData && (
            <div className="top-result-container">
              <div className="artist-song-info-container">
                <img className="main-artist-pic" src={artistData.images[0]?.url || "https://via.placeholder.com/300"} alt={artistData.name} /> {/* Main artist image */}
                <p>{topTracks[0]?.name || "Top Song"}</p> {/* Display top track name */}
                <p>{artistData.name}</p> {/* Display artist name */}
                <p className="main-album-top-name">{topTracks[0]?.album.name || "Album Name"}</p> {/* Display album name */}
                <button className="historyBtn" onClick={handleHistoryClick}>History</button> {/* Button to view artist history */}
                <button className="artist-play-button" onClick={handlePlayTopTrack}>
                  <FontAwesomeIcon className="artist-play-icon" icon={faPlay} size="1x" /> {/* Play icon button */}
                </button>
              </div>
            </div>
          )}

          <div className="song-result-container">
            {topTracks.map((track, index) => (
              <div className="song-item" key={track.id} onClick={() => handleTrackClick(track)}>
                <p>{index + 1}</p> {/* Track index */}
                <img src={track.album.images[0]?.url || "https://via.placeholder.com/300"} alt={track.name} /> {/* Track image */}
                <div className="song-name-info">
                  <p className="track-name">{track.name}</p> {/* Track name */}
                  <p>{track.artists.map(artist => artist.name).join(", ")}</p> {/* Display artist names */}
                </div>
                <p>{track.album.name}</p> {/* Album name */}
                <p>{Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}</p> {/* Track duration in minutes:seconds */}
              </div>
            ))}
          </div>
        </div>

        <p className="album-title">Albums</p>
        <div className="artist-album-container">
          {albums.map(album => (
            <div className="artist-album" key={album.id}>
              <img src={album.images[0]?.url || "https://via.placeholder.com/300"} alt={album.name} /> {/* Album cover image */}
              <p className="album-name-all">{album.name}</p> {/* Album name */}
            </div>
          ))}
        </div>

        <p className="song-title">Related Artists</p>
        <div className="featured-artist-container">
          {relatedArtists.length > 0 ? (
            relatedArtists.map(relatedArtist => (
              <div className="artist-feature" key={relatedArtist.id}>
                <img src={relatedArtist.images[0]?.url || "https://via.placeholder.com/300"} alt={relatedArtist.name} /> {/* Related artist image */}
                <p className="related-name-all">{relatedArtist.name}</p> {/* Related artist name */}
              </div>
            ))
          ) : (
            <p>No related artists available.</p> // Message if no related artists are found
          )}
        </div>
      </div>

      <Sidebar /> {/* Sidebar component */}

      <div className="fp">
        <FooterPlayer track={currentTrack} /> {/* Pass the current track to FooterPlayer */}
      </div>
    </div>
  );
}

export default ArtistPage; // Export the ArtistPage component
