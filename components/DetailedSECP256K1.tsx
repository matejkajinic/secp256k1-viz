import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { create, all } from 'mathjs';

const math = create(all);

const DetailedSECP256K1 = () => {
  const [points, setPoints] = useState([]);
  const [zoomRange, setZoomRange] = useState(10);
  const [resolution, setResolution] = useState(0.01);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);

  const generatePoints = useCallback(() => {
    const newPoints = [];
    const start = centerX - zoomRange;
    const end = centerX + zoomRange;
    
    for (let x = start; x <= end; x += resolution) {
      const x3 = math.pow(x, 3);
      const y2 = x3 + 7;
      
      if (y2 >= 0) {
        const y = math.sqrt(y2);
        if (Math.abs(y - centerY) <= zoomRange) {
          newPoints.push({ x, y: y });
          newPoints.push({ x, y: -y });
        }
      }
    }
    return newPoints.sort((a, b) => a.x - b.x);
  }, [zoomRange, resolution, centerX, centerY]);

  useEffect(() => {
    setPoints(generatePoints());
  }, [generatePoints]);

  const handleZoomIn = () => {
    if (zoomRange > 0.1) {
      setZoomRange(prev => prev / 2);
      setResolution(prev => prev / 2);
    }
  };

  const handleZoomOut = () => {
    if (zoomRange < 1000) {
      setZoomRange(prev => prev * 2);
      setResolution(prev => prev * 2);
    }
  };

  const moveLeft = () => setCenterX(prev => prev - zoomRange / 2);
  const moveRight = () => setCenterX(prev => prev + zoomRange / 2);
  const moveUp = () => setCenterY(prev => prev + zoomRange / 2);
  const moveDown = () => setCenterY(prev => prev - zoomRange / 2);

  return (
    <div className="w-full h-full p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-black">Detailed SECP256K1 Elliptic Curve</h2>
        <p className="text-gray-600 mb-4">y² = x³ + 7</p>
        
        <div className="flex gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <button 
                onClick={handleZoomIn}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Zoom In
              </button>
              <button 
                onClick={handleZoomOut}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Zoom Out
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={moveLeft}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ←
              </button>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={moveUp}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  ↑
                </button>
                <button 
                  onClick={moveDown}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  ↓
                </button>
              </div>
              <button 
                onClick={moveRight}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                →
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              View Range: ±{zoomRange.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              Center: ({centerX.toFixed(2)}, {centerY.toFixed(2)})
            </p>
            <p className="text-sm text-gray-600">
              Resolution: {resolution.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={points} 
              margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="x" 
                domain={[centerX - zoomRange, centerX + zoomRange]} 
                type="number"
                label={{ value: 'x', position: 'bottom' }}
              />
              <YAxis 
                domain={[centerY - zoomRange, centerY + zoomRange]}
                label={{ value: 'y', angle: -90, position: 'left' }}
              />
              <Tooltip 
                formatter={(value) => value.toFixed(4)}
                labelFormatter={(value) => `x: ${parseFloat(value).toFixed(4)}`}
              />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#2563eb" 
                dot={false} 
                name="y"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <h3 className="font-bold mb-2">Key Properties of SECP256K1:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Equation: y² = x³ + 7</li>
            <li>Point at infinity (∞) serves as the identity element</li>
            <li>The curve is symmetric about the x-axis</li>
            <li>Every x-coordinate either has two corresponding y-coordinates (positive and negative) or none</li>
            <li>The curve has no singularities (smooth everywhere)</li>
            <li>When used in Bitcoin, coordinates are reduced modulo p where p = 2²⁵⁶ - 2³² - 977</li>
            <li>The base point G has order n (a prime number)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetailedSECP256K1;