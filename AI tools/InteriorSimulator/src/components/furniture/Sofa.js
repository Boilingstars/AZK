import React from 'react';
import * as THREE from 'three';

export function Sofa({ position, rotation, scale, color, onClick, selected }) {
  // Создаем группу для дивана
  const sofaRef = React.useRef();
  
  // Обработчик клика
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(e);
  };
  
  return (
    <group 
      ref={sofaRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
    >
      {/* Сиденье */}
      <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
        <boxGeometry args={[2.5, 0.5, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Спинка */}
      <mesh castShadow receiveShadow position={[0, 0.65, -0.65]}>
        <boxGeometry args={[2.5, 0.8, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Подлокотники */}
      <mesh castShadow receiveShadow position={[-1.4, 0.35, 0]}>
        <boxGeometry args={[0.3, 0.7, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      <mesh castShadow receiveShadow position={[1.4, 0.35, 0]}>
        <boxGeometry args={[0.3, 0.7, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Ножки */}
      {[
        [1.2, 0.05, 0.4],
        [-1.2, 0.05, 0.4],
        [1.2, 0.05, -0.4],
        [-1.2, 0.05, -0.4]
      ].map((pos, index) => (
        <mesh key={index} castShadow receiveShadow position={pos}>
          <cylinderGeometry args={[0.05, 0.05, 0.1]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
      ))}
      
      {/* Подсветка выбранного объекта */}
      {selected && (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.8, 1.5, 1.3]} />
          <meshBasicMaterial color="#ffffff" wireframe={true} transparent={true} opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
