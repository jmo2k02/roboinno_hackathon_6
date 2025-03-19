import React, { useState, useRef, useEffect, MouseEvent } from 'react';

// Typdefinitionen
type Point = {
  x: number;
  y: number;
};

type ToolType = 'pencil' | 'line' | 'rectangle' | 'circle';

interface CanvasEditorProps {
  width?: number;
  height?: number;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ 
  width = 800, 
  height = 600 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(5);
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [tool, setTool] = useState<ToolType>('pencil');
  const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });

  // Initialisierung des Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Sauberes Canvas zu Beginn
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Ersten Schritt in der Historie speichern
    const initialState = context.getImageData(0, 0, canvas.width, canvas.height);
    setCanvasHistory([initialState]);
    setCurrentStep(0);
  }, []);

  // Zeichenfunktionen
  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    
    if (tool === 'pencil') {
      context.beginPath();
      context.moveTo(x, y);
      setIsDrawing(true);
    } else {
      setStartPoint({ x, y });
      setIsDrawing(true);
    }
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pencil') {
      context.lineTo(x, y);
      context.stroke();
    } else {
      // Für Formen: Vorschau zeichnen durch temporäres Überschreiben
      const prevState = canvasHistory[currentStep];
      if (!prevState) return;
      
      context.putImageData(prevState, 0, 0);
      
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      
      if (tool === 'line') {
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(x, y);
      } else if (tool === 'rectangle') {
        const width = x - startPoint.x;
        const height = y - startPoint.y;
        context.rect(startPoint.x, startPoint.y, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2));
        context.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      }
      
      context.stroke();
    }
  };

  const endDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    if (tool !== 'pencil') {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      
      if (tool === 'line') {
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(x, y);
      } else if (tool === 'rectangle') {
        const width = x - startPoint.x;
        const height = y - startPoint.y;
        context.rect(startPoint.x, startPoint.y, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2));
        context.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      }
      
      context.stroke();
    }
    
    setIsDrawing(false);
    
    // Neuen Zustand zur Historie hinzufügen
    const newState = context.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = canvasHistory.slice(0, currentStep + 1);
    newHistory.push(newState);
    setCanvasHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  // Undo-Funktion
  const undo = (): void => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      const prevState = canvasHistory[newStep];
      if (!prevState) return;
      
      context.putImageData(prevState, 0, 0);
      setCurrentStep(newStep);
    }
  };

  // Redo-Funktion
  const redo = (): void => {
    if (currentStep < canvasHistory.length - 1) {
      const newStep = currentStep + 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      const nextState = canvasHistory[newStep];
      if (!nextState) return;
      
      context.putImageData(nextState, 0, 0);
      setCurrentStep(newStep);
    }
  };

  // Canvas löschen
  const clearCanvas = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Neuen Zustand zur Historie hinzufügen
    const newState = context.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = [...canvasHistory, newState];
    setCanvasHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  // Export-Funktionen
  const exportAsPNG = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas-drawing.png';
    link.click();
  };

  const exportAsSVG = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const svg = svgRef.current;
    if (!svg) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    // Canvas in SVG konvertieren
    const svgWidth = canvas.width;
    const svgHeight = canvas.height;
    
    // SVG-Element zurücksetzen
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // SVG-Attribute setzen
    svg.setAttribute('width', svgWidth.toString());
    svg.setAttribute('height', svgHeight.toString());
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    
    // Hintergrund hinzufügen
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', svgWidth.toString());
    background.setAttribute('height', svgHeight.toString());
    background.setAttribute('fill', 'white');
    svg.appendChild(background);
    
    // Canvas-Inhalt als Bild in SVG einfügen
    const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    img.setAttribute('width', svgWidth.toString());
    img.setAttribute('height', svgHeight.toString());
    img.setAttribute('href', canvas.toDataURL());
    svg.appendChild(img);
    
    // SVG als String erstellen und herunterladen
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = svgUrl;
    link.download = 'canvas-drawing.svg';
    link.click();
    URL.revokeObjectURL(svgUrl);
  };

  return (
    <div className="flex flex-col p-4 bg-gray-100 w-full h-full">
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-4 mr-6">
          <button 
            onClick={() => setTool('pencil')}
            className={`p-2 rounded ${tool === 'pencil' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            Stift
          </button>
          <button 
            onClick={() => setTool('line')}
            className={`p-2 rounded ${tool === 'line' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            Linie
          </button>
          <button 
            onClick={() => setTool('rectangle')}
            className={`p-2 rounded ${tool === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            Rechteck
          </button>
          <button 
            onClick={() => setTool('circle')}
            className={`p-2 rounded ${tool === 'circle' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            Kreis
          </button>
        </div>

        <div className="flex items-center gap-2 mr-6">
          <label htmlFor="color-picker" className="mr-1">Farbe:</label>
          <input
            id="color-picker"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-10"
          />
        </div>

        <div className="flex items-center gap-2 mr-6">
          <label htmlFor="brush-size" className="mr-1">Stärke:</label>
          <input
            id="brush-size"
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-24"
          />
          <span>{brushSize}px</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={undo} className="p-2 bg-white rounded">Rückgängig</button>
          <button onClick={redo} className="p-2 bg-white rounded">Wiederherstellen</button>
          <button onClick={clearCanvas} className="p-2 bg-white rounded">Löschen</button>
        </div>
      </div>

      <div className="relative bg-white shadow-md rounded mb-4">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border border-gray-300 rounded touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
        />
      </div>

      <div className="flex gap-4">
        <button 
          onClick={exportAsPNG} 
          className="p-2 bg-green-500 text-white rounded"
        >
          Als PNG exportieren
        </button>
        <button 
          onClick={exportAsSVG} 
          className="p-2 bg-blue-500 text-white rounded"
        >
          Als SVG exportieren
        </button>
      </div>

      {/* Verstecktes SVG-Element für Export */}
      <svg ref={svgRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CanvasEditor;