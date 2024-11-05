
import "../styles/LoginPageStyle.css"; // Import styles for the Login Page
import logo from "../src/assets/logo.png"; // Import logo image
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation between routes
import { useEffect } from 'react'; // Import useEffect for side effects in the component

// Define Spotify authentication constants
const SPOTIFY_CLIENT_ID = "f7287b5c077d42c8908736a708386967"; // Your Spotify client ID
const SPOTIFY_REDIRECT_URI = "http://localhost:5173/"; // URI to redirect to after login
const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"; // Spotify authorization endpoint
const SPOTIFY_RESPONSE_TYPE = "token"; // Response type to receive an access token
// Define necessary scopes for the access token
const SPOTIFY_SCOPES = [
  "user-read-private", // Access to user's private info
  "user-read-email", // Access to user's email
  "user-read-recently-played" // New scope added to read recently played tracks
].join("%20"); // Join scopes with space for the URL

function LoginPage() {
  const navigate = useNavigate(); // Hook to programmatically navigate between routes

  // Effect to handle token retrieval from the URL after redirect
  useEffect(() => {
    const hash = window.location.hash; // Get the hash part of the URL
    if (hash) {
      const token = new URLSearchParams(hash.substring(1)).get("access_token"); // Extract the access token
      if (token) {
        localStorage.setItem('spotifyAccessToken', token); // Store the token in local storage
        navigate('/home'); // Redirect to homepage after login
      }
    }
  }, [navigate]); // Only re-run the effect if navigate changes

  // Function to handle login button click
  const handleLoginClick = () => {
    // Create the authentication URL
    const authUrl = `${SPOTIFY_AUTH_ENDPOINT}?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&response_type=${SPOTIFY_RESPONSE_TYPE}&scope=${SPOTIFY_SCOPES}`;
    window.location.href = authUrl; // Redirect the user to the Spotify login page
  };

  // Function to handle sign-up button click
  const handleSignUpClick = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  return (
    <div className="login-page-container"> {/* Main container for the Login Page */}
      <div className="image-container"> {/* Container for the logo image */}
        <img src={logo} alt="App Logo" /> {/* Display the app logo */}
      </div>
      <h1>Login</h1> {/* Login page title */}
      <button onClick={handleLoginClick} className="login-btn">Login</button> {/* Login button */}
      <button onClick={handleSignUpClick} className="signup-btn">Sign Up</button> {/* Sign Up button */}
    </div>
  );
}

export default LoginPage; // Export the LoginPage component
