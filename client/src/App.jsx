import './App.css'
import { useEffect, useState } from 'react'
import Card from './components/Card'
import { LoginForm } from './components/Auth'
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  /**
     * This function handles the login process.
     * It requires a username and a password inside a "credentials" object.
     */
  // const handleLogin = async (credentials) => {
  //   const user = await API.logIn(credentials);
  //   setUser(user); setLoggedIn(true);
  //   setFeedback("Welcome, " + user.name);
  // };

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
              imageUrl="src/assets/dudes-meme-with-sitting-sad-man.png"
              link="/game"
              button="Gioca"
            />
            <Card
              title="Utente registrato"
              description="Gioca tre round e salva i tuoi progressi."
              imageUrl="src/assets/dudes-gentleman-in-suit-raising-his-glass.png"
              link="/login"
              button="Accedi"
            />
          </div>
        </>
      } />
      <Route path="/login" element={ /* If the user is ALREADY logged-in, redirect to root */
        // loggedIn ? <Navigate replace to='/game' />
        //   : 
        <LoginForm />
      } />
    </Routes>
  );
}

export default App
