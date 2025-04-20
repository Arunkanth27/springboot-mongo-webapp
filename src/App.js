import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/Login/AuthContext';
import Header from './components/Homepage/Header';
import Sidebar from './components/Homepage/Sidebar';
import Feed from './components/Feed/Feed';
import PostCreation from './components/Post/PostCreationPage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Chat from './components/Chat/Chat';
import CommunityPage from './components/Community/CommunityPage'; // Uncommented
import CommunityDetails from './components/Community/CommunityDetails';
import UserActivity from './components/UserActivity/UserActivity';
import ProfilePage from './components/Profile/ProfilePage';
import Notifications from './components/Notification/Notifications';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import Opportunity from './components/Homepage/Opportunity';
import NewsNavbar from './components/Feed/NewsNavbar';
import OverallRankers from './components/Feed/OverallRankers';
import CreateCommunityPage from './components/Community/CreateCommunityPage';
import './App.css';

const PrivateRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return (
    <>
      {isLoggedIn && (
        <>
          <Header />
          <Sidebar />
        </>
      )}
      <div className="app__content">{children}</div>

      {(location.pathname === '/feed' || location.pathname === '/') && isLoggedIn && (
        <div className="app__sidebars">
          <NewsNavbar />
          <OverallRankers />
        </div>
      )}
    </>
  );
};

const AppContent = () => {
  const { isLoggedIn } = useAuth();
  const [posts, setPosts] = useState([
    // ... your existing posts data
  ]);

  const addNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/feed" element={<Feed posts={posts} />} />
        <Route path="/create-post" element={<PostCreation addNewPost={addNewPost} />} />
        <Route path="/communities" element={<CommunityPage />} />
        <Route path="/create-community" element={<CreateCommunityPage />} />
        <Route path="/communities/:name" element={<CommunityDetails />} />
        <Route path="/community/:name" element={<CommunityDetails posts={posts} setPosts={setPosts} />} />
        <Route path="/activity" element={<UserActivity />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/opportunity" element={<Opportunity />} />
        <Route path="/" element={<Feed posts={posts} />} />
      </Routes>
    </AppLayout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;