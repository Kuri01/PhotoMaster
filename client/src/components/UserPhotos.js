import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardMedia,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@material-ui/core';
import { Delete, Edit } from '@mui/icons-material';
import { makeStyles } from '@material-ui/core/styles';
import AvatarEditor from 'react-avatar-editor';
import { API_URLs } from '../api/endpoints';

const useStyles = makeStyles({
  media: {
    height: '400px',
    objectFit: 'contain',
  },
});

const UserPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [editorRef, setEditorRef] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scale, setScale] = useState(1.2);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const movementDelta = 0.01;
  const scaleDelta = 0.01;
  const classes = useStyles();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!dialogOpen) return;
      switch (event.key) {
        case 'ArrowUp':
          setPosition((prev) => ({
            ...prev,
            y: Math.max(prev.y - movementDelta, 0),
          }));
          break;
        case 'ArrowDown':
          setPosition((prev) => ({
            ...prev,
            y: Math.min(prev.y + movementDelta, 1),
          }));
          break;
        case 'ArrowLeft':
          setPosition((prev) => ({
            ...prev,
            x: Math.max(prev.x - movementDelta, 0),
          }));
          break;
        case 'ArrowRight':
          setPosition((prev) => ({
            ...prev,
            x: Math.min(prev.x + movementDelta, 1),
          }));
          break;
        case '+':
          setScale((prev) => prev + scaleDelta);
          break;
        case '-':
          setScale((prev) => Math.max(prev - scaleDelta, 1));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogOpen]);

  const handleEdit = (photo) => {
    setCurrentPhoto(photo);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editorRef) {
      const canvas = editorRef.getImageScaledToCanvas().toDataURL();

      function base64ToBuffer(base64String) {
        const encodedData = base64String.split(',')[1];
        const decodedData = atob(encodedData);
        const buffer = new Uint8Array(decodedData.length);

        for (let i = 0; i < decodedData.length; i++) {
          buffer[i] = decodedData.charCodeAt(i);
        }

        return buffer;
      }

      const buffer = base64ToBuffer(canvas);
      handleUpload(currentPhoto.id, buffer);
      setDialogOpen(false);
    }
  };

  const handleUpload = (id, image) => {
    const token = localStorage.getItem('token');
    axios
      .put(
        `${API_URLs}/${id}}`,
        { image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setPhotos(
          photos.map((photo) =>
            photo.id === id
              ? { ...photo, image: { data: response.data } }
              : photo
          )
        );
      })
      .catch((error) => {
        alert('Błąd podczas ładowania zdjęcia: ', error);
      });
  };

  const getImageSrc = (imageBuffer) => {
    const buffer = new Uint8Array(imageBuffer);
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const objectUrl = URL.createObjectURL(blob);
    return objectUrl;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(API_URLs.photos, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPhotos(response.data);
      })
      .catch((error) => {
        alert('Błąd podczas pobierania zdjęć: ', error);
      });
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    axios
      .delete(`${API_URLs}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPhotos(photos.filter((photo) => photo.id !== id));
      })
      .catch((error) => {
        alert('Błąd podczas usuwania zdjęcia');
      });
  };

  return (
    <Grid container spacing={3}>
      {photos.map((photo) => (
        <Grid item key={photo.id} xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              className={classes.media}
              component='img'
              image={getImageSrc(photo.image.data)}
            />
            <IconButton onClick={() => handleEdit(photo)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDelete(photo.id)}>
              <Delete />
            </IconButton>
          </Card>
        </Grid>
      ))}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setScale(1.2);
          setPosition({ x: 0.5, y: 0.5 });
        }}
      >
        <DialogContent>
          {currentPhoto && (
            <AvatarEditor
              ref={setEditorRef}
              image={getImageSrc(currentPhoto.image.data)}
              width={250}
              height={250}
              border={50}
              color={[255, 255, 255, 0.6]}
              scale={scale}
              position={position}
              rotate={0}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color='primary'>
            Anuluj
          </Button>
          <Button onClick={handleSave} color='primary'>
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default UserPhotos;
