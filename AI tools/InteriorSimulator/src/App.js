import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls, PerspectiveCamera, Grid, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

// Компоненты мебели
import { Chair } from './components/furniture/Chair';
import { Table } from './components/furniture/Table';
import { Bed } from './components/furniture/Bed';
import { Wardrobe } from './components/furniture/Wardrobe';
import { Sofa } from './components/furniture/Sofa';
import { Lamp } from './components/furniture/Lamp';
import { Plant } from './components/furniture/Plant';

// Компоненты квартиры
import { Apartment } from './components/apartment/Apartment';

// Компонент для выбранного объекта
const SelectedObject = ({ object, mode }) => {
  if (!object) return null;
  
  return (
    <TransformControls object={object} mode={mode} />
  );
};

// Основной компонент приложения
function App() {
  // Состояния
  const [furniture, setFurniture] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [transformMode, setTransformMode] = useState('translate');
  const [selectedColor, setSelectedColor] = useState('#4a90e2');
  
  // Генерация уникального ID для мебели
  const generateId = () => `furniture_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // Добавление мебели
  const addFurniture = (type) => {
    const id = generateId();
    const position = [0, 0, 0]; // Начальная позиция перед камерой
    
    const newFurniture = {
      id,
      type,
      position,
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: selectedColor
    };
    
    setFurniture([...furniture, newFurniture]);
    setSelectedObject(newFurniture);
  };
  
  // Удаление выбранного объекта
  const deleteSelectedObject = () => {
    if (selectedObject) {
      setFurniture(furniture.filter(item => item.id !== selectedObject.id));
      setSelectedObject(null);
    }
  };
  
  // Изменение цвета выбранного объекта
  const changeObjectColor = (color) => {
    if (selectedObject) {
      setFurniture(furniture.map(item => 
        item.id === selectedObject.id ? { ...item, color } : item
      ));
      setSelectedObject({ ...selectedObject, color });
      setSelectedColor(color);
    }
  };
  
  // Обработчик клика по объекту
  const handleObjectClick = (e, item) => {
    e.stopPropagation();
    setSelectedObject(item);
  };
  
  // Обработчик клика по пустому месту
  const handleCanvasClick = () => {
    setSelectedObject(null);
  };
  
  // Рендеринг мебели
  const renderFurniture = () => {
    return furniture.map(item => {
      const props = {
        key: item.id,
        position: item.position,
        rotation: item.rotation,
        scale: item.scale,
        color: item.color,
        onClick: (e) => handleObjectClick(e, item),
        selected: selectedObject && selectedObject.id === item.id
      };
      
      switch (item.type) {
        case 'chair':
          return <Chair {...props} />;
        case 'table':
          return <Table {...props} />;
        case 'bed':
          return <Bed {...props} />;
        case 'wardrobe':
          return <Wardrobe {...props} />;
        case 'sofa':
          return <Sofa {...props} />;
        case 'lamp':
          return <Lamp {...props} />;
        case 'plant':
          return <Plant {...props} />;
        default:
          return null;
      }
    });
  };
  
  return (
    <div className="app">
      <div className="sidebar">
        <h1>Интерьер 3D</h1>
        <h2>Добавить мебель</h2>
        <div className="button-group">
          <button className="furniture-btn" onClick={() => addFurniture('chair')}>Стул</button>
          <button className="furniture-btn" onClick={() => addFurniture('table')}>Стол</button>
          <button className="furniture-btn" onClick={() => addFurniture('bed')}>Кровать</button>
          <button className="furniture-btn" onClick={() => addFurniture('wardrobe')}>Шкаф</button>
          <button className="furniture-btn" onClick={() => addFurniture('sofa')}>Диван</button>
          <button className="furniture-btn" onClick={() => addFurniture('lamp')}>Лампа</button>
          <button className="furniture-btn" onClick={() => addFurniture('plant')}>Растение</button>
        </div>
        
        {selectedObject && (
          <div className="control-panel">
            <h2>Управление объектом</h2>
            <div className="button-group">
              <button 
                className={`control-btn ${transformMode === 'translate' ? 'active' : ''}`}
                onClick={() => setTransformMode('translate')}
              >
                Перемещение
              </button>
              <button 
                className={`control-btn ${transformMode === 'rotate' ? 'active' : ''}`}
                onClick={() => setTransformMode('rotate')}
              >
                Вращение
              </button>
              <button 
                className={`control-btn ${transformMode === 'scale' ? 'active' : ''}`}
                onClick={() => setTransformMode('scale')}
              >
                Размер
              </button>
            </div>
            <div className="color-picker">
              <label htmlFor="color-picker">Цвет:</label>
              <input 
                type="color" 
                id="color-picker" 
                value={selectedObject.color || selectedColor}
                onChange={(e) => changeObjectColor(e.target.value)}
              />
            </div>
            <button className="delete-btn" onClick={deleteSelectedObject}>Удалить объект</button>
          </div>
        )}
      </div>
      
      <div className="canvas-container">
        <Canvas shadows onClick={handleCanvasClick}>
          <PerspectiveCamera makeDefault position={[0, 5, 10]} />
          <OrbitControls />
          
          {/* Освещение */}
          <ambientLight intensity={0.7} />
          <directionalLight 
            position={[5, 10, 7.5]} 
            intensity={1.0}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* Квартира */}
          <Apartment />
          
          {/* Мебель */}
          {renderFurniture()}
          
          {/* Контролы для выбранного объекта */}
          {selectedObject && (
            <SelectedObject 
              object={furniture.find(item => item.id === selectedObject.id)} 
              mode={transformMode} 
            />
          )}
          
          {/* Сетка для ориентации */}
          <Grid infiniteGrid fadeDistance={30} fadeStrength={5} />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
