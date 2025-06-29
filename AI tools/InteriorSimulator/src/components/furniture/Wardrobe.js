import React from 'react';
import * as THREE from 'three';

export function Wardrobe({ position, rotation, scale, color, onClick, selected }) {
  // Создаем группу для шкафа
  const wardrobeRef = React.useRef();
  
  // Обработчик клика
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(e);
  };
  
  return (
    <group 
      ref={wardrobeRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
    >
      {/* Основная часть шкафа */}
      <mesh castShadow receiveShadow position={[0, 1.25, 0]}>
        <boxGeometry args={[1.5, 2.5, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Двери */}
      <mesh castShadow receiveShadow position={[-0.375, 1.25, 0.325]}>
        <boxGeometry args={[0.74, 2.4, 0.05]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      
      <mesh castShadow receiveShadow position={[0.375, 1.25, 0.325]}>
        <boxGeometry args={[0.74, 2.4, 0.05]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      
      {/* Ручки */}
      <mesh castShadow receiveShadow position={[-0.1, 1.25, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15]} />
        <meshStandardMaterial color="#CFD8DC" />
      </mesh>
      
      <mesh castShadow receiveShadow position={[0.1, 1.25, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15]} />
        <meshStandardMaterial color="#CFD8DC" />
      </mesh>
      
      {/* Подсветка выбранного объекта */}
      {selected && (
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[1.6, 2.6, 0.7]} />
          <meshBasicMaterial color="#ffffff" wireframe={true} transparent={true} opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
