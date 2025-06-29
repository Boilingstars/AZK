import React from 'react';
import * as THREE from 'three';

export function Apartment({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  // Создаем группу для квартиры
  const apartmentRef = React.useRef();
  
  return (
    <group 
      ref={apartmentRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {/* Пол */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#E0E0E0" />
      </mesh>
      
      {/* Стены */}
      {/* Задняя стена */}
      <mesh castShadow receiveShadow position={[0, 1.5, -10]}>
        <boxGeometry args={[20, 3, 0.2]} />
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>
      
      {/* Левая стена */}
      <mesh castShadow receiveShadow position={[-10, 1.5, 0]}>
        <boxGeometry args={[0.2, 3, 20]} />
        <meshStandardMaterial color="#EEEEEE" />
      </mesh>
      
      {/* Правая стена */}
      <mesh castShadow receiveShadow position={[10, 1.5, 0]}>
        <boxGeometry args={[0.2, 3, 20]} />
        <meshStandardMaterial color="#EEEEEE" />
      </mesh>
      
      {/* Передняя стена с проемом для двери */}
      <mesh castShadow receiveShadow position={[-5, 1.5, 10]}>
        <boxGeometry args={[10, 3, 0.2]} />
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>
      
      <mesh castShadow receiveShadow position={[7.5, 1.5, 10]}>
        <boxGeometry args={[5, 3, 0.2]} />
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>
      
      {/* Внутренняя перегородка с проемом */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[10, 3, 0.2]} />
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>
      
      <mesh castShadow receiveShadow position={[-7.5, 1.5, 0]}>
        <boxGeometry args={[5, 3, 0.2]} />
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>
      
      {/* Окна */}
      <mesh position={[0, 1.5, -9.9]}>
        <planeGeometry args={[3, 1.5]} />
        <meshStandardMaterial color="#90CAF9" transparent opacity={0.5} />
      </mesh>
      
      <mesh position={[-5, 1.5, -9.9]}>
        <planeGeometry args={[3, 1.5]} />
        <meshStandardMaterial color="#90CAF9" transparent opacity={0.5} />
      </mesh>
      
      {/* Дверной проем */}
      <mesh position={[2.5, 1, 10]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.1, 2, 1]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
    </group>
  );
}
