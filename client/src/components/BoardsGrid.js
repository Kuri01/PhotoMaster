import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import {
  Grid,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Dialog,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import { API_URLs } from '../api/endpoints';

function BoardsGrid() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(API_URLs.boards, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(response.data);
    } catch (error) {
      alert('Błąd podczas pobierania tablic');
    }
  };

  const deleteBoard = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URLs.boards}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBoards();
    } catch (error) {
      alert('Błąd podczas usuwania tablicy');
    }
  };

  return (
    <Grid container spacing={2}>
      {boards.map((board) => (
        <Grid item xs={4} key={board.id}>
          <Card>
            <CardMedia
              component={() => (
                <Stage
                  width={600}
                  height={400}
                  scaleX={0.35}
                  scaleY={0.35}
                  onClick={() => setSelectedBoard(board)}
                >
                  <Layer>
                    {JSON.parse(board.content).map((line, i) => (
                      <Line
                        key={i}
                        points={line}
                        stroke='#df4b26'
                        strokeWidth={5}
                        tension={0.5}
                        lineCap='round'
                        globalCompositeOperation='source-over'
                      />
                    ))}
                  </Layer>
                </Stage>
              )}
            />
            <CardActions>
              <IconButton
                aria-label='delete'
                onClick={() => deleteBoard(board.id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
      <Dialog
        open={selectedBoard !== null}
        onClose={() => setSelectedBoard(null)}
        maxWidth='xl'
      >
        {selectedBoard && (
          <Stage width={1200} height={800} scaleX={0.55} scaleY={0.55}>
            <Layer>
              {JSON.parse(selectedBoard.content).map((line, i) => (
                <Line
                  key={i}
                  points={line}
                  stroke='#df4b26'
                  strokeWidth={5}
                  tension={0.5}
                  lineCap='round'
                  globalCompositeOperation='source-over'
                />
              ))}
            </Layer>
          </Stage>
        )}
      </Dialog>
    </Grid>
  );
}

export default BoardsGrid;
