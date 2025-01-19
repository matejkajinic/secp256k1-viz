import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { create, all } from 'mathjs';

const math = create(all);

interface Point {
  x: number;
  y: number;
}

const DetailedSECP256K1 = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [zoomRange, setZoomRange] = useState<number>(10);
  const [centerX, setCenterX] = useState<number>(0);
  const [centerY, setCenterY] = useState<number>(0);
  const [isZooming, setIsZooming] = useState<boolean>(false);

  const MIN_RESOLUTION = 0.000001;
  const MAX_ZOOM_IN = 0.0001;
  const MAX_ZOOM_OUT = 1000;

  const adaptiveResolution = useCallback((range: number): number => {
    return Math.max(MIN_RESOLUTION, range / 500);
  }, []);

  const generatePoints = useCallback(() => {
    const newPoints: Point[] = [];
    const start = centerX - zoomRange;
    const end = centerX + zoomRange;
    const resolution = adaptiveResolution(zoomRange);

    for (let x = start; x <= end; x = math.add(x, resolution)) {
      const x3 = math.chain(x).pow(3).done();
      const y2 = math.add(x3, 7);

      if (math.isPositive(y2) || math.isZero(y2)) {
        const y = math.sqrt(y2);
        if (math.abs(math.subtract(y, centerY)) <= zoomRange) {
          newPoints.push({ x: parseFloat(x), y: parseFloat(y) });
          newPoints.push({ x: parseFloat(x), y: parseFloat(math.unaryMinus(y)) });
        }
      }
    }
    return newPoints.sort((a, b) => a.x - b.x);
  }, [zoomRange, centerX, centerY, adaptiveResolution]);

  useEffect(() => {
    const generatePointsAndUpdate = () => {
      setIsZooming(true);
      const newPoints = generatePoints();
      setPoints(newPoints);
      setIsZooming(false);
    };
    
    generatePointsAndUpdate();
  }, [generatePoints]);

  const handleZoomIn = () => {
    if (zoomRange > MAX_ZOOM_IN) {
      setZoomRange((prev) => math.divide(prev, 2));
    }
  };

  const handleZoomOut = () => {
    if (zoomRange < MAX_ZOOM_OUT) {
      setZoomRange((prev) => math.multiply(prev, 2));
    }
  };

  const moveLeft = () => setCenterX((prev) => math.subtract(prev, zoomRange / 2));
  const moveRight = () => setCenterX((prev) => math.add(prev, zoomRange / 2));
  const moveUp = () => setCenterY((prev) => math.add(prev, zoomRange / 2));
  const moveDown = () => setCenterY((prev) => math.subtract(prev, zoomRange / 2));

  return (
    <div className="w-full h-full p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-black">
          Detailed SECP256K1 Elliptic Curve
        </h2>
        <p className="text-gray-600 mb-4">y² = x³ + 7</p>

        <div className="flex gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={handleZoomIn}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isZooming}
              >
                Zoom In
              </button>
              <button
                onClick={handleZoomOut}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isZooming}
              >
                Zoom Out
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={moveLeft}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isZooming}
              >
                ←
              </button>
              <div className="flex flex-col gap-2">
                <button
                  onClick={moveUp}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  disabled={isZooming}
                >
                  ↑
                </button>
                <button
                  onClick={moveDown}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  disabled={isZooming}
                >
                  ↓
                </button>
              </div>
              <button
                onClick={moveRight}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isZooming}
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
              Resolution: {adaptiveResolution(zoomRange).toFixed(8)}
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
                allowDataOverflow={true}
              />
              <YAxis
                domain={[centerY - zoomRange, centerY + zoomRange]}
                label={{ value: 'y', angle: -90, position: 'left' }}
                allowDataOverflow={true}
              />
              <Tooltip
                formatter={(value: number) => value.toFixed(8)}
                labelFormatter={(value: string) => `x: ${parseFloat(value).toFixed(8)}`}
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#2563eb"
                dot={false}
                name="y"
                strokeWidth={2}
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