import React from 'react';
import * as THREE from 'three';

export function Chair({ position, rotation, scale, color, onClick, selected }) {
  // Создаем группу для стула
  const chairRef = React.useRef();
  
  // Обработчик клика
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(e);
  };
  
  return (
    <group 
      ref={chairRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
    >
      {/* Сиденье */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Спинка */}
      <mesh castShadow receiveShadow position={[0, 0.9, -0.35]}>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Ножки */}
      {[
        [0.3, 0.25, 0.3],
        [-0.3, 0.25, 0.3],
        [0.3, 0.25, -0.3],
        [-0.3, 0.25, -0.3]
      ].map((pos, index) => (
        <mesh key={index} castShadow receiveShadow position={pos}>
          <cylinderGeometry args={[0.05, 0.05, 0.5]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
      ))}
      
      {/* Подсветка выбранного объекта */}
      {selected && (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.9, 1.8, 0.9]} />
          <meshBasicMaterial color="#ffffff" wireframe={true} transparent={true} opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
