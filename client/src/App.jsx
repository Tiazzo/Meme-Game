// import './App.css'
import { useEffect, useState } from 'react'
import Card from './components/Card'
import { LoginForm } from './components/Auth'
import { Routes, Route, Navigate } from 'react-router-dom';
import API from "./API.mjs";
import NotFoundComponent from './components/NotFoundComponent';
import GuestGame from './components/GuestGame';

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo();
      setLoggedIn(true);
      setUser(user);
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
  };
  return (
    <Routes>
      <Route index element={
        <>
          <h1>Benvenuto in <span style={{ color: 'red' }}>What Do You Meme</span>!</h1>
          <h2>Seleziona la modalità di gioco:</h2>
          <div className="card-container">
            <Card
              title="Ospite"
              description="Gioca un partida da un singolo round senza dover accedere."
              imageUrl="dudes-meme-with-sitting-sad-man.png"
              link="/guest-game"
              button="Gioca"
            />
            <Card
              title="Utente registrato"
              description="Gioca tre round e salva i tuoi progressi."
              imageUrl="dudes-gentleman-in-suit-raising-his-glass.png"
              link="/login"
              button="Accedi"
            />
          </div>
        </>
      } />
      <Route path="*" element={<NotFoundComponent/>}/>
      <Route path='/login' element={
        loggedIn ? <Navigate replace to='/game' /> : <LoginForm login={handleLogin} />
      } />
       <Route path="/guest-game" element={<GuestGame />} />
    </Routes>
  );
}

export default App
