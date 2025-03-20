import { getPreviewApiV1RobotGetPreviewPostMutation } from '@/client/@tanstack/react-query.gen';
import useEditorStore from '@/stores/editor-store';
import { useMutation } from '@tanstack/react-query';
import React, { useState, useRef, useEffect, MouseEvent } from 'react';

// Define interfaces
interface Point {
    x: number;
    y: number;
}

interface Path {
    points: Point[];
    strokeColor: string;
    strokeWidth: number;
}

interface DrawingPaths {
    paths: Path[];
}

type ToolType = 'pencil' | 'line' | 'rectangle' | 'circle';

interface CanvasEditorProps {
    width?: number;
    height?: number;
    setShouldReloadIframe: (value: boolean) => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
    width = 800,
    height = 400,
    setShouldReloadIframe
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

    // Store all drawing paths for SVG export
    const [drawingData, setDrawingData] = useState<DrawingPaths>({ paths: [] });
    // Current path being drawn
    const [currentPath, setCurrentPath] = useState<Path | null>(null);

    const editorStore = useEditorStore()

    const mutation = useMutation({
        ...getPreviewApiV1RobotGetPreviewPostMutation()
    })

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

        // Create a new path for SVG export
        const newPath: Path = {
            points: [{ x, y }],
            strokeColor: color,
            strokeWidth: brushSize
        };

        setCurrentPath(newPath);

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

            // Add the new point to the current path for SVG export
            if (currentPath) {
                setCurrentPath({
                    ...currentPath,
                    points: [...currentPath.points, { x, y }]
                });
            }
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

            let finalPath: Path | null = null;

            if (tool === 'line') {
                context.moveTo(startPoint.x, startPoint.y);
                context.lineTo(x, y);

                // Create a path for the line
                finalPath = {
                    points: [startPoint, { x, y }],
                    strokeColor: color,
                    strokeWidth: brushSize
                };
            } else if (tool === 'rectangle') {
                const width = x - startPoint.x;
                const height = y - startPoint.y;
                context.rect(startPoint.x, startPoint.y, width, height);

                // Create a path for the rectangle
                finalPath = {
                    points: [
                        startPoint,
                        { x: startPoint.x + width, y: startPoint.y },
                        { x: startPoint.x + width, y: startPoint.y + height },
                        { x: startPoint.x, y: startPoint.y + height },
                        startPoint // Close the path
                    ],
                    strokeColor: color,
                    strokeWidth: brushSize
                };
            } else if (tool === 'circle') {
                const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2));
                context.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);

                // Create points for a circle approximation
                finalPath = {
                    points: generateCirclePoints(startPoint, radius),
                    strokeColor: color,
                    strokeWidth: brushSize
                };
            }

            context.stroke();

            // Add the final shape path to the drawing data
            if (finalPath) {
                setDrawingData(prevData => ({
                    paths: [...prevData.paths, finalPath!]
                }));
            }
        } else {
            // Add the completed freehand path to the drawing data
            if (currentPath) {
                setDrawingData(prevData => ({
                    paths: [...prevData.paths, currentPath]
                }));
            }
        }

        setIsDrawing(false);
        setCurrentPath(null);

        // Neuen Zustand zur Historie hinzufügen
        const newState = context.getImageData(0, 0, canvas.width, canvas.height);
        const newHistory = canvasHistory.slice(0, currentStep + 1);
        newHistory.push(newState);
        setCanvasHistory(newHistory);
        setCurrentStep(newHistory.length - 1);
    };

    // Helper function to generate points for a circle
    const generateCirclePoints = (center: Point, radius: number): Point[] => {
        const points: Point[] = [];
        const segments = 36; // Number of segments to approximate a circle

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * 2 * Math.PI;
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            points.push({ x, y });
        }

        return points;
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

            // Remove the last path for SVG export
            if (drawingData.paths.length > 0) {
                setDrawingData(prevData => ({
                    paths: prevData.paths.slice(0, -1)
                }));
            }
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

            // We would need to store removed paths for redo SVG
            // This is a simplification that would need to be extended
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

        // Clear drawing data for SVG export
        setDrawingData({ paths: [] });
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

    const buildSvgBlob = (): Blob => {
        const svg = svgRef.current;
        if (!svg) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const svgWidth = canvas.width;
        const svgHeight = canvas.height;

        // Reset SVG element
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        // Set SVG attributes
        svg.setAttribute('width', svgWidth.toString());
        svg.setAttribute('height', svgHeight.toString());
        svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

        // Optional: Add background
        // const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        // background.setAttribute('width', svgWidth.toString());
        // background.setAttribute('height', svgHeight.toString());
        // background.setAttribute('fill', 'white');
        // svg.appendChild(background);

        // Convert each drawing path to an SVG path element
        drawingData.paths.forEach(path => {
            if (path.points.length < 2) return; // Skip paths with insufficient points

            const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            // Create path data string
            let pathData = `M ${path.points[0].x} ${path.points[0].y}`;

            // Add line segments
            for (let i = 1; i < path.points.length; i++) {
                pathData += ` L ${path.points[i].x} ${path.points[i].y}`;
            }

            svgPath.setAttribute('d', pathData);
            svgPath.setAttribute('fill', 'none');
            svgPath.setAttribute('stroke', path.strokeColor);
            svgPath.setAttribute('stroke-width', path.strokeWidth.toString());
            svgPath.setAttribute('stroke-linecap', 'round');
            svgPath.setAttribute('stroke-linejoin', 'round');

            svg.appendChild(svgPath);
        });

        // Create SVG string and download
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        // const svgUrl = URL.createObjectURL(svgBlob);
        return svgBlob
    }
    const exportAsSVG = (): void => {
        const svgBlob = buildSvgBlob()
        const svgUrl = URL.createObjectURL(svgBlob);
        const link = document.createElement('a');
        link.href = svgUrl;
        link.download = 'vector-drawing.svg';
        link.click();
        URL.revokeObjectURL(svgUrl);
    };
    const uploadSvgBlob = (): void => {
        const svgBlob = buildSvgBlob()
        console.log(svgBlob.type)
        mutation.mutate({
            body: {
                svg_file: svgBlob
            },
            query: {
                token: "test"
            }
        })
    }

    const handleStartSimulation = (): void => {
        editorStore.invertCreatedSvg()
        uploadSvgBlob()
        setShouldReloadIframe(true);
    }

    return (
        <div className="flex flex-col p-4 bg-gray-100 w-full">
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

            <div className="bg-white shadow-md rounded mb-4">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="border border-gray-300 rounded touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    style={{ touchAction: 'none' }}
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
                <button
                    onClick={handleStartSimulation}
                    className="p-2 bg-blue-500 text-white rounded"
                >
                    Show in Simulation
                </button>
            </div>

            {/* Verstecktes SVG-Element für Export */}
            <svg ref={svgRef} style={{ display: 'none' }} />
        </div>
    );
};

export default CanvasEditor;