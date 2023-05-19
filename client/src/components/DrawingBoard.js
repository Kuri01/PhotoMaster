import React, { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { Button } from '@material-ui/core';
import axios from 'axios';
import { API_URLs } from '../api/endpoints';

function DrawingBoard() {
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef();

  const handleMouseDown = () => {
    setIsDrawing(true);
    setLines([...lines, []]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const stage = stageRef.current.getStage();
    const point = stage.getPointerPosition();

    let lastLine = lines[lines.length - 1];
    lastLine = lastLine.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        API_URLs.boards,
        { content: JSON.stringify(lines) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Board saved successfully');
      setLines([]);
    } catch (error) {
      alert('Failed to save the board');
    }
  };

  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseup={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, i) => (
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
      <Button variant='contained' color='primary' onClick={handleSave}>
        Save Board
      </Button>
    </div>
  );
}

export default DrawingBoard;
