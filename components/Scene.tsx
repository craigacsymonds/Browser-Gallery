import React from 'react';
import { Color } from 'three';
import Gallery from './Gallery';
import Player from './Player';

interface SceneProps {
  started: boolean;
  joystickRef?: React.MutableRefObject<{ x: number, y: number }>;
  touchLookRef?: React.MutableRefObject<{ x: number, y: number }>;
}

const Scene: React.FC<SceneProps> = ({ started, joystickRef, touchLookRef }) => {
  return (
    <>
      {/* Background color to avoid "void" look */}
      <color attach="background" args={['#111']} />

      {/* Basic performant lighting */}
      <ambientLight intensity={0.5} />
      
      {/* Main fill light from top */}
      <pointLight position={[0, 10, 0]} intensity={0.8} decay={2} distance={30} />
      
      {/* Accent lights for corners to give volume without shadows */}
      <pointLight position={[10, 5, 10]} intensity={0.4} color="#ccccff" />
      <pointLight position={[-10, 5, -10]} intensity={0.4} color="#ffcccc" />

      {/* The Gallery Room & Frames */}
      <Gallery />

      {/* Controller */}
      {started && <Player joystickRef={joystickRef} touchLookRef={touchLookRef} />}
    </>
  );
};

export default Scene;