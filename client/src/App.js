import React, { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import axios from 'axios';
import { Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { API_URLs } from './api/endpoints';
import UserProfilePage from './components/UserProfilePage';

function App() {
  const [user, setUser] = useState({
    data: null,
    error: { isError: false, message: '' },
    isLoading: false,
    isSuccess: false,
  });
  const [showPage, setShowPage] = useState('home');

  useEffect(() => {
    localStorage.setItem('token', '');
  }, []);

  const setUserToStart = () => {
    setUser({
      data: null,
      error: {
        isError: false,
        message: '',
      },
      isLoading: false,
      isSuccess: false,
    });
  };

  const handleSetLoginPage = () => {
    setShowPage('login');
    setUserToStart();
  };

  const handleSetRegisterPage = () => {
    setShowPage('register');
    setUserToStart();
  };

  const handleLogin = async (credentials) => {
    setUser({
      data: null,
      error: { isError: false, message: '' },
      isLoading: true,
    });
    try {
      const response = await axios.post(API_URLs.login, credentials);
      setUser({
        data: response.data,
        error: { isError: false, message: '' },
        isLoading: false,
        isSuccess: true,
      });

      localStorage.setItem('token', response.data.token);
    } catch (error) {
      setUser({
        data: null,
        error: {
          isError: true,
          message: error.response.data.error,
        },
        isLoading: false,
        isSuccess: false,
      });
    }
  };

  const handleRegister = async (credentials) => {
    setUser({
      data: null,
      error: { isError: false, message: '' },
      isLoading: true,
    });

    try {
      const response = await axios.post(API_URLs.register, credentials);
      setUser({
        data: null,
        error: { isError: false, message: '' },
        isLoading: false,
        isSuccess: null,
      });

      if (response.status === 201) {
        alert('User created successfully');
        handleSetLoginPage();
      }
    } catch (error) {
      setUser({
        data: null,
        error: {
          isError: true,
          message: error.response.data.error,
        },
        isLoading: false,
        isSuccess: false,
      });
    }
  };

  const handleShowPage = () => {
    if (showPage === 'login') {
      return (
        <LoginForm
          onLogin={handleLogin}
          user={user}
          handleSetRegisterPage={handleSetRegisterPage}
        />
      );
    } else if (showPage === 'register') {
      return (
        <SignUpForm
          user={user}
          handleSetLoginPage={handleSetLoginPage}
          handleRegister={handleRegister}
        />
      );
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      {user.data && user.isSuccess ? (
        <UserProfilePage />
      ) : (
        <div
          style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Grid container spacing={2}>
            {showPage === 'home' && (
              <>
                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <h2>Register</h2>
                      <p>Join us to have fun with our photos</p>
                    </CardContent>
                    <CardActions>
                      <Button onClick={handleSetRegisterPage}>Register</Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <h2>Login</h2>
                      <p>If you already have an account</p>
                    </CardContent>
                    <CardActions>
                      <Button onClick={handleSetLoginPage}>Login</Button>
                    </CardActions>
                  </Card>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              {handleShowPage()}
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}

export default App;
