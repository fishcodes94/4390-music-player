


import "../styles/SearchForSongStyle.css";
import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

function SearchForSong({ placeholder = "Search (e.g song, artist, band)" }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);

    const token = localStorage.getItem('spotifyAccessToken');
    const url = `https://api.spotify.com/v1/search?q=${searchQuery}&type=artist,track&limit=10`;  // Search by artist and track

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(response.data.artists.items.slice(0, 4));  // Adjust results as needed
    } catch (error) {
      console.error('Error fetching data from Spotify API', error);
      if (error.response.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleArtistClick = (artistId) => {
    navigate(`/artist-page/${artistId}`);
    setSearchResults([]); // Clear search results after clicking
  };

  // Function to handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();  // Trigger search when Enter is pressed
    }
  };

  return (
    <div>
      <input
        placeholder={placeholder}
        className="user-music-search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}  // Listen for Enter key
      />

      {loading && <p>Loading...</p>}

      <div className="search-result-container">
        {searchResults.map((artist) => (
          <div
            key={artist.id}
            onClick={() => handleArtistClick(artist.id)}
          >
            <img
              src={artist.images[0]?.url || 'https://via.placeholder.com/150'}
              alt={artist.name}
            />
            <p>{artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchForSong;




