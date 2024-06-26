import { useEffect, useState } from 'react';
import { LoginForm } from './components/Auth';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import API from "./API.mjs";
import NotFoundComponent from './components/NotFoundComponent';
import { GameHistory } from './components/GameHistory';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Game from './components/Game';
import Home from './components/Home';

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo(); // we have the user info here
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        console.log("User not logged in");
      }
    };
    checkAuth();
  }, []);

  /**
   * This function handles the login process.
   * It requires a username and a password inside a "credentials" object.
   */
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
      setUser(user);
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  };

  /**
   * This function handles the logout process.
   */
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage('');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "#282A36" }}>
      <Header loggedIn={loggedIn} logout={handleLogout} />
      <Container fluid className="flex-grow-1 d-flex flex-column">
        <Routes>
          <Route index element={<Home loggedIn={loggedIn} />} />
          <Route path="*" element={<NotFoundComponent />} />
          <Route path='/login' element={
            loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
          } />
          <Route path="/game" element={<Game loggedIn={loggedIn} user={user} />} />
          <Route path="/profile" element={<GameHistory user={user} />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
