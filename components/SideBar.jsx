
import React, { useState } from 'react'; // Import useState for managing state
import { Link } from 'react-router-dom'; // Import Link for navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon for icons
import { faHome, faSearch, faHeart, faPalette, faLandmark } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons

const Sidebar = ({ onToggleCustomization }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A6", "#33FFF3", "#C733FF", "#FF8333"]; // Array of color options

  // Function to toggle the dropdown for color customization
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown open state
  };

  return (
    <div className="sidebar"> {/* Main sidebar container */}
      <div className="sidebar__logo"></div> {/* Placeholder for sidebar logo */}
      <div className="sidebar__menu"> {/* Menu container */}
        {/* Menu item for Home navigation */}
        <div className="sidebar__menuItem">
          <Link className="link" to="/home">
            <span className="icon-container">
              <span className="icon">
                <FontAwesomeIcon className="all-icon" icon={faHome} /> {/* Home icon */}
              </span>
              Home
            </span>
          </Link>
        </div>
        {/* Menu item for Search */}
        <div className="sidebar__menuItem">
          <span>
            <span className="icon">
              <FontAwesomeIcon className="all-icon" icon={faSearch} /> {/* Search icon */}
            </span>
            Search
          </span>
        </div>
        {/* Menu item for Customize, triggering dropdown */}
        <div className="sidebar__menuItem" onClick={onToggleCustomization}>
          <span>
            <span className="icon">
              <FontAwesomeIcon icon={faPalette} /> {/* Palette icon for customization */}
            </span>
            Customize
          </span>
        </div>
        {/* Menu item for Favorites */}
        <div className="sidebar__menuItem">
          <span>
            <span className="icon">
              <FontAwesomeIcon className="all-icon" icon={faHeart} /> {/* Heart icon */}
            </span>
            Favorites
          </span>
        </div>
      </div>
      {/* Render dropdown if it's open */}
      {isDropdownOpen && (
        <div className="color-dropdown">
          {colors.map((color, index) => ( // Map through colors array to create options
            <div
              key={index} // Unique key for each color option
              className="color-option"
              style={{ backgroundColor: color }} // Set background color
              onClick={() => onColorChange(color)} // Handle color selection
            />
          ))}
        </div>
      )}
      
      {/* Wrap all the following elements in a single parent div */}
      <div>
        <div className="sidebar__menuItem">
          <span>
            <span className="icon">
              <FontAwesomeIcon className="all-icon" icon={faLandmark} /> {/* Landmark icon */}
            </span>
            Your Library
          </span>
        </div>
        <div className="sidebar__playlist">
          {/* Menu item for creating a new playlist */}
          <div className="sidebar__menuItem">
            <Link className="link" to="/playlist/CreatePlaylist">
              <span className="icon-container">
                <span className="icon">
                  <FontAwesomeIcon className="all-icon" icon={faHome} /> {/* Icon reused for creating playlist */}
                </span>
                Create Playlist
              </span>
            </Link>
          </div>
          {/* Other playlist menu items */}
          <div className="sidebar__menuItem">
            <span className="icon">
              <FontAwesomeIcon className="all-icon" icon={faHome} />
            </span>
            Liked Songs
          </div>
          <div className="sidebar__menuItem">
            <span className="icon">
              <FontAwesomeIcon className="all-icon" icon={faHome} />
            </span>
            Today's Hits
          </div>
          {/* List of specific playlists */}
          <ul className="playlist-items">
            <li><Link className="link" to="/playlist/Jazz">Jazz</Link></li>
            <li><Link className="link" to="/playlist/HangoverCore">Hangover Core</Link></li>
            <li><Link className="link" to="/playlist/YourTopSongs2022">Your Top Songs 2022</Link></li>
            <li><Link className="link" to="/playlist/Indie">Indie</Link></li>
            <li><Link className="link" to="/playlist/Rock">Rock</Link></li>
            <li><Link className="link" to="/playlist/HangoverCure">Hangover Cure</Link></li>
            <li><Link className="link" to="/playlist/RADAR">RADAR</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; // Export the Sidebar component
