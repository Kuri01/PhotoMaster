import React from 'react';
import { Button } from '@material-ui/core';

const UserNavigationBar = ({ setSelectedTab }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
      }}
    >
      <Button
        variant='contained'
        color='primary'
        onClick={() => setSelectedTab('photos')}
      >
        Moje zdjęcia
      </Button>
      <Button
        variant='contained'
        color='primary'
        onClick={() => setSelectedTab('drawings')}
      >
        Nowe rysunki
      </Button>
      <Button
        variant='contained'
        color='primary'
        onClick={() => setSelectedTab('boardsgrid')}
      >
        Moje rysunki
      </Button>
      <Button
        variant='contained'
        color='secondary'
        onClick={() => setSelectedTab('upload')}
      >
        Wrzuć nowe zdjęcie
      </Button>
    </div>
  );
};

export default UserNavigationBar;
