import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import Frame from './Frame';
import { FrameData } from '../types';

// Simple room layout: 20x20
const FRAMES: FrameData[] = [
  // Back Wall (z = -10) - The Main Wall you face on spawn
  { id: 'f1', position: [0, 2, -9.9], rotation: [0, 0, 0], scale: [1, 1, 1], defaultImage: 'https://i.imgur.com/t5BVRHB.jpeg' },
  { id: 'f2', position: [-4, 2, -9.9], rotation: [0, 0, 0], scale: [1, 1, 1], defaultImage: 'https://i.imgur.com/csU5D87.jpeg' },
  { id: 'f3', position: [4, 2, -9.9], rotation: [0, 0, 0], scale: [1, 1, 1], defaultImage: 'https://i.imgur.com/UHhgZoE.jpeg' },

  // Right Wall (x = 10)
  { id: 'f4', position: [9.9, 2, 0], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], defaultImage: 'https://i.imgur.com/rMJlfqn.jpeg' },
  { id: 'f5', position: [9.9, 2, 4], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], defaultImage: 'https://i.imgur.com/jM030m5.jpeg' },
  { id: 'f6', position: [9.9, 2, -4], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], defaultImage: 'https://i.imgur.com/AvUwqDr.jpeg' },

  // Left Wall (x = -10)
  { id: 'f7', position: [-9.9, 2, 0], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], defaultImage: 'https://i.imgur.com/Os1bX0h.jpeg' },
  { id: 'f8', position: [-9.9, 2, 4], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], defaultImage: 'https://i.imgur.com/wO2nGLm.jpeg' },
  { id: 'f9', position: [-9.9, 2, -4], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], defaultImage: 'https://i.imgur.com/Tuzi4qn.jpeg' },
];

const Gallery: React.FC = () => {
  return (
    <group>
      {/* Floor - Matte concrete style */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#222" roughness={0.9} />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Walls - Solid Boxes to prevent visibility issues */}
      {/* Back Wall (North) */}
      <mesh position={[0, 3, -10.5]}>
        <boxGeometry args={[20, 6, 1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Front Wall (South) */}
      <mesh position={[0, 3, 10.5]}>
        <boxGeometry args={[20, 6, 1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Left Wall (West) */}
      <mesh position={[-10.5, 3, 0]}>
        <boxGeometry args={[1, 6, 22]} /> {/* Slightly wider to cover corners */}
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Right Wall (East) */}
      <mesh position={[10.5, 3, 0]}>
        <boxGeometry args={[1, 6, 22]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Render Frames */}
      {FRAMES.map((data) => (
        <Frame key={data.id} {...data} />
      ))}
    </group>
  );
};

export default Gallery;