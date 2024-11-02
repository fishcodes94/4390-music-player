
import React, { useState } from 'react';
import "../styles/CustomizationStyle.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from "@fortawesome/free-solid-svg-icons";

const CustomizationSidebar = ({ onColorChange }) => {
  const colors = [
    'red',
    'blue',
    'green',
    'yellow',
    'orange',
    'purple',
    'pink',
    'cyan',
  ];

  const [selectedColor, setSelectedColor] = useState('');

  const handleColorClick = (color) => {
    const newColor = selectedColor === color ? '' : color; // Toggle the selection
    setSelectedColor(newColor); // Update the state
    onColorChange(newColor); // Call the function passed as a prop to change the color
  };

  const handleGoHome = () => {
    window.location.reload(); // Refresh the entire page
  };

  return (
    <div className="customization-side-bar">
      <span className="customization-homeBtn" onClick={handleGoHome}>
        <FontAwesomeIcon className="customization-home-icon" icon={faHome} />
      </span>
      <h2> Customization</h2>

      <label>Select Colors:</label>
      <div className="customization-colorOptions">
        {colors.map((color) => (
          <div className="colorOption" key={color} onClick={() => handleColorClick(color)}>
            <div
              className="colorBox"
              style={{
                backgroundColor: color,
                width: '30px',
                height: '30px',
                border: '1px solid #000',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            />
            <label style={{ marginLeft: '10px', color: 'white' }}>{color}</label>
            <input
              className="checkBox"
              type="checkbox"
              checked={selectedColor === color} // Checkbox reflects the selected color
              onChange={() => handleColorClick(color)} // Toggle color on checkbox change
              style={{ marginLeft: '10px' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizationSidebar;
