import React from 'react';
import * as THREE from 'three';

export function Bed({ position, rotation, scale, color, onClick, selected }) {
  // Создаем группу для кровати
  const bedRef = React.useRef();
  
  // Обработчик клика
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(e);
  };
  
  return (
    <group 
      ref={bedRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
    >
      {/* Матрас */}
      <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.3, 3]} />
        <meshStandardMaterial color="#ECEFF1" />
      </mesh>
      
      {/* Подушки */}
      <mesh castShadow receiveShadow position={[0.5, 0.45, -1.2]}>
        <boxGeometry args={[0.6, 0.1, 0.4]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      <mesh castShadow receiveShadow position={[-0.5, 0.45, -1.2]}>
        <boxGeometry args={[0.6, 0.1, 0.4]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Одеяло */}
      <mesh castShadow receiveShadow position={[0, 0.45, 0.5]}>
        <boxGeometry args={[1.8, 0.05, 1.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Каркас */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[2.2, 0.2, 3.2]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      
      {/* Изголовье */}
      <mesh castShadow receiveShadow position={[0, 0.6, -1.55]}>
        <boxGeometry args={[2.2, 1, 0.1]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      
      {/* Подсветка выбранного объекта */}
      {selected && (
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[2.3, 1.5, 3.3]} />
          <meshBasicMaterial color="#ffffff" wireframe={true} transparent={true} opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
