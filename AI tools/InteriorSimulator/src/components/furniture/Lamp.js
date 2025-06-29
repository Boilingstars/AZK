import React from 'react';
import * as THREE from 'three';

export function Lamp({ position, rotation, scale, color, onClick, selected }) {
  // Создаем группу для лампы
  const lampRef = React.useRef();
  
  // Обработчик клика
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(e);
  };
  
  return (
    <group 
      ref={lampRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
    >
      {/* Основание лампы */}
      <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.1]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      
      {/* Ножка */}
      <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1]} />
        <meshStandardMaterial color="#9E9E9E" />
      </mesh>
      
      {/* Абажур */}
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <coneGeometry args={[0.3, 0.4, 16, 1, true]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Лампочка (источник света) */}
      <pointLight position={[0, 1.1, 0]} intensity={0.5} distance={3} color="#FFF9C4" />
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#FFEB3B" />
      </mesh>
      
      {/* Подсветка выбранного объекта */}
      {selected && (
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 1.6]} />
          <meshBasicMaterial color="#ffffff" wireframe={true} transparent={true} opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
