import React from 'react';
import * as THREE from 'three';

export function Plant({ position, rotation, scale, color, onClick, selected }) {
  // Создаем группу для растения
  const plantRef = React.useRef();
  
  // Обработчик клика
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(e);
  };
  
  return (
    <group 
      ref={plantRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
    >
      {/* Горшок */}
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.3]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      
      {/* Земля */}
      <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.05]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
      
      {/* Стебель */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshStandardMaterial color="#33691E" />
      </mesh>
      
      {/* Листья */}
      {[0, 60, 120, 180, 240, 300].map((angle, index) => {
        const radians = (angle * Math.PI) / 180;
        const x = 0.15 * Math.cos(radians);
        const z = 0.15 * Math.sin(radians);
        const y = 0.5 + (index % 3) * 0.1;
        
        return (
          <mesh key={index} castShadow receiveShadow position={[x, y, z]} rotation={[0, -radians, 0]}>
            <boxGeometry args={[0.1, 0.01, 0.2]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
      
      {/* Подсветка выбранного объекта */}
      {selected && (
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1]} />
          <meshBasicMaterial color="#ffffff" wireframe={true} transparent={true} opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
