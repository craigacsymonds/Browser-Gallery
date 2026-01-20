import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib';
import { PointerLockControls, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerProps {
  joystickRef?: React.MutableRefObject<{ x: number, y: number }>;
  touchLookRef?: React.MutableRefObject<{ x: number, y: number }>;
}

const Player: React.FC<PlayerProps> = ({ joystickRef, touchLookRef }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const [, get] = useKeyboardControls();
  
  // Physics / Movement state
  const direction = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());
  const speed = useRef(new THREE.Vector3());
  
  // Touch look sensitivity
  const LOOK_SPEED = 0.005;

  // Set camera rotation order to YXZ for FPS style (yaw matches world Y)
  useEffect(() => {
    camera.rotation.order = 'YXZ';
  }, [camera]);

  useFrame((state, delta) => {
    // 1. Handle Touch Look (Mobile)
    if (touchLookRef && touchLookRef.current) {
      const { x, y } = touchLookRef.current;
      if (x !== 0 || y !== 0) {
        // Apply rotation based on touch delta
        camera.rotation.y -= x * LOOK_SPEED;
        camera.rotation.x -= y * LOOK_SPEED;
        
        // Clamp pitch (look up/down) to avoid flipping
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
        
        // Reset delta after applying (consume the event)
        touchLookRef.current.x = 0;
        touchLookRef.current.y = 0;
      }
    }

    // 2. Calculate Movement Input
    const { forward, backward, left, right } = get();
    
    // Joystick Input
    const joyX = joystickRef?.current.x || 0;
    const joyY = joystickRef?.current.y || 0; // -1 is up usually, need to check direction

    // Combine inputs: Keyboard (0/1) + Joystick (-1 to 1)
    // Forward in ThreeJS is usually -Z. 
    // Keyboard: Forward = 1, Backward = 0. We want z-movement to be negative.
    // Joystick: Y is negative when Up? Let's assume joystick Y is positive when dragged down.
    
    // Normalize keyboard values to -1 to 1
    const keyboardZ = Number(backward) - Number(forward);
    const keyboardX = Number(right) - Number(left);

    // Final input vector
    // Joystick Y: usually negative is UP on screen. So pushing stick UP (negative Y) should move Forward (negative Z).
    // So we add them. 
    // If joystick Y is positive (down), we move backward (positive Z).
    const inputZ = keyboardZ + joyY;
    const inputX = keyboardX + joyX;

    // 3. Apply Movement relative to Camera Looking Direction
    frontVector.current.set(0, 0, inputZ);
    sideVector.current.set(inputX, 0, 0);

    direction.current.subVectors(frontVector.current, sideVector.current).normalize();

    // Determine move speed (don't move if no input)
    const isMoving = Math.abs(inputZ) > 0.1 || Math.abs(inputX) > 0.1;
    const moveSpeed = 5.0; // Meters per second

    if (isMoving) {
      // Get forward direction projected on XZ plane (so we don't fly up/down)
      const forwardDir = new THREE.Vector3();
      camera.getWorldDirection(forwardDir);
      forwardDir.y = 0;
      forwardDir.normalize();

      // Get right direction
      const rightDir = new THREE.Vector3();
      rightDir.crossVectors(forwardDir, new THREE.Vector3(0, 1, 0)).normalize();

      // Calculate translation vector
      const translation = new THREE.Vector3();
      // inputZ is Forward/Back. If inputZ is negative (Forward), we want to go along forwardDir
      // Actually standard: Forward input is usually 'forward'. 
      // Let's stick to: negative Z input means "Go Forward".
      
      // Move Forward/Back
      translation.addScaledVector(forwardDir, -inputZ * moveSpeed * delta);
      // Move Left/Right
      translation.addScaledVector(rightDir, inputX * moveSpeed * delta);

      camera.position.add(translation);
    }

    // 4. Boundary / Height Constraints
    camera.position.y = 1.7; // Walking height

    // Simple room bounds
    const LIMIT = 14; 
    if (camera.position.x > LIMIT) camera.position.x = LIMIT;
    if (camera.position.x < -LIMIT) camera.position.x = -LIMIT;
    if (camera.position.z > LIMIT) camera.position.z = LIMIT;
    if (camera.position.z < -LIMIT) camera.position.z = -LIMIT;
  });

  return (
    // PointerLockControls is for Desktop Mouse Look.
    // It shouldn't interfere with manual rotation if unlocked, but best to keep it.
    // On mobile, user won't click to lock, so it stays inactive.
    <PointerLockControls ref={controlsRef} />
  );
};

export default Player;