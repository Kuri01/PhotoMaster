import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { API_URLs } from '../api/endpoints';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  input: {
    display: 'none',
  },
}));

const PhotoUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onFileUpload = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('image', selectedFile);

    const token = localStorage.getItem('token');

    axios
      .post(API_URLs.photos, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        alert('Zdjęcie zostało przesłane pomyślnie!');
        setLoading(false);
        setOpen(false);
      })
      .catch((error) => {
        alert('Błąd podczas przesyłania zdjęcia: ', error);
        setLoading(false);
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box className={classes.root}>
      <Button variant='outlined' color='primary' onClick={handleClickOpen}>
        Prześlij nowe zdjęcie
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Prześlij nowe zdjęcie</DialogTitle>
        <DialogContent>
          <form onSubmit={onFileUpload} encType='multipart/form-data'>
            <input
              accept='image/*'
              className={classes.input}
              id='contained-button-file'
              multiple
              type='file'
              onChange={onFileChange}
            />
            <label htmlFor='contained-button-file'>
              <Button variant='contained' color='primary' component='span'>
                Wybierz zdjęcie
              </Button>
            </label>
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
                Anuluj
              </Button>
              <Button type='submit' color='primary'>
                {loading ? <CircularProgress size={24} /> : 'Prześlij'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PhotoUpload;
