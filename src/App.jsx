
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '../components/LanguageContext.jsx'; // Import the provider with .jsx extension

import LoginPage from '../pages/LoginPage.jsx';
import SignUpPage from '../pages/SignUpPage.jsx';
import MusicHome from '../pages/MusicHome.jsx';
import ArtistHistory from '../components/ArtistHistory.jsx';
import FooterPlayer from '../components/FooterPlayer.jsx';
import ArtistPage from '../components/ArtistPage.jsx';
import PlayList from '../components/PlayList.jsx';
import Customization from '../components/CustomizationSidebar.jsx';

import '../styles/SideBarStyle.css';
import '../src/App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="main-app">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/home" element={<MusicHome />} />
            <Route path="/artist-history" element={<ArtistHistory />} />
            <Route path="/footer-player" element={<FooterPlayer />} />
            <Route path="/artist-page/:artistId" element={<ArtistPage />} />
            <Route path="/playlist/:playlistName" element={<PlayList />} />
            <Route path="/customization" element={<Customization />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;

