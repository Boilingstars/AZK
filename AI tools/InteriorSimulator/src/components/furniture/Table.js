import React from 'react';
import * as THREE from 'three';

export function Table({ position, rotation, scale, color, onClick, selected }) {
  // Создаем группу для стола
  const tableRef = React.useRef();
  
  // Обработчик клика
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(e);
  };
  
  return (
    <group 
      ref={tableRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
    >
      {/* Столешница */}
      <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[2, 0.1, 1.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Ножки */}
      {[
        [0.9, 0.375, 0.5],
        [-0.9, 0.375, 0.5],
        [0.9, 0.375, -0.5],
        [-0.9, 0.375, -0.5]
      ].map((pos, index) => (
        <mesh key={index} castShadow receiveShadow position={pos}>
          <boxGeometry args={[0.1, 0.75, 0.1]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
      ))}
      
      {/* Подсветка выбранного объекта */}
      {selected && (
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[2.1, 1, 1.3]} />
          <meshBasicMaterial color="#ffffff" wireframe={true} transparent={true} opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
