import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentEvent } from '../slices/appSlice';
import OneDollar from '../lib/OneDollar';

interface Gesture {
  name: string;
  score: number;
  recognized: boolean;
  path: {
    start: any[];
    end: any[];
    centroid: any;
  };
  ranking: {
    name: string;
    score: number;
  }[];
}

const GestureCanvas = () => {
  const dispatch = useDispatch();
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const [paint, setPaint] = useState(false);
  const [clickX, setClickX] = useState<number[]>([]);
  const [clickY, setClickY] = useState<number[]>([]);
  const [clickDrag, setClickDrag] = useState<boolean[]>([]);
  const [gesturePoints, setGesturePoints] = useState<number[][]>([]);
  const [gesture, setGesture] = useState<Gesture | null>(null);

  // Configuration du recognizer
  const options = {
    score: 80,
    parts: 64,
    step: 2,
    angle: 45,
    size: 250,
  };
  const recognizer = new OneDollar(options);

  // Ajout des gestes prédéfinis
  useEffect(() => {
    recognizer.add("triangle", [
      [627, 213], [626, 217], [617, 234], [611, 248], [603, 264],
      [590, 287], [552, 329], [524, 358], [489, 383], [461, 410],
      [426, 444], [416, 454], [407, 466], [405, 469], [411, 469],
      [428, 469], [453, 470], [513, 478], [555, 483], [606, 493],
      [658, 499], [727, 505], [762, 507], [785, 508], [795, 508],
      [796, 505], [796, 503], [796, 502], [796, 495], [790, 473],
      [785, 462], [776, 447], [767, 430], [742, 390], [724, 362],
      [708, 340], [695, 321], [673, 289], [664, 272], [660, 263],
      [659, 261], [658, 256], [658, 255], [658, 255]
    ]);

    recognizer.add("circle", [
      [621, 225], [616, 225], [608, 225], [601, 225], [594, 227],
      [572, 235], [562, 241], [548, 251], [532, 270], [504, 314],
      [495, 340], [492, 363], [492, 385], [494, 422], [505, 447],
      [524, 470], [550, 492], [607, 523], [649, 531], [689, 531],
      [751, 523], [782, 510], [807, 495], [826, 470], [851, 420],
      [859, 393], [860, 366], [858, 339], [852, 311], [833, 272],
      [815, 248], [793, 229], [768, 214], [729, 198], [704, 191],
      [678, 189], [655, 188], [623, 188], [614, 188], [611, 188],
      [611, 188]
    ]);

    // Ajout des gestes pour la navigation
    recognizer.add("next", [
      [500, 100], [600, 200], [500, 300]
    ]);

    recognizer.add("previous", [
      [500, 100], [400, 200], [500, 300]
    ]);
  }, []);

  const addClick = (x: number, y: number, dragging: boolean) => {
    setClickX(prev => [...prev, x]);
    setClickY(prev => [...prev, y]);
    setClickDrag(prev => [...prev, dragging]);
  };

  const redraw = () => {
    if (!refCanvas.current) return;

    const context = refCanvas.current.getContext("2d");
    if (!context) return;

    const width = refCanvas.current.getBoundingClientRect().width;
    const height = refCanvas.current.getBoundingClientRect().height;

    refCanvas.current.setAttribute("width", width.toString());
    refCanvas.current.setAttribute("height", height.toString());
    context.clearRect(0, 0, width, height);

    // Dessiner le tracé
    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 2;

    for (let i = 0; i < clickX.length; i++) {
      context.beginPath();
      if (clickDrag[i] && i) {
        context.moveTo(clickX[i - 1] * width, clickY[i - 1] * height);
      } else {
        context.moveTo(clickX[i] * width - 1, clickY[i] * height);
      }
      context.lineTo(clickX[i] * width, clickY[i] * height);
      context.stroke();
    }

    // Dessiner le geste reconnu
    if (gesture) {
      context.strokeStyle = "#666";
      context.lineJoin = "round";
      context.lineWidth = 5;

      context.beginPath();
      context.moveTo(gesturePoints[0][0] * width, gesturePoints[0][1] * height);
      for (let i = 1; i < gesturePoints.length; i++) {
        context.lineTo(gesturePoints[i][0] * width - 1, gesturePoints[i][1] * height);
      }
      context.stroke();
    }
  };

  const pointerDownHandler = (ev: PointerEvent) => {
    if (ev.pointerType !== 'touch' && ev.pointerType !== 'mouse') return;

    const width = refCanvas.current?.getBoundingClientRect().width || 1;
    const height = refCanvas.current?.getBoundingClientRect().height || 1;
    const mouseX = (ev.pageX - (refCanvas.current?.offsetLeft || 0)) / width;
    const mouseY = (ev.pageY - (refCanvas.current?.offsetTop || 0)) / height;

    setPaint(true);
    addClick(mouseX, mouseY, false);
    setGesturePoints([[mouseX, mouseY]]);
    redraw();
  };

  const pointerMoveHandler = (ev: PointerEvent) => {
    if (!paint || !refCanvas.current) return;

    const width = refCanvas.current.getBoundingClientRect().width;
    const height = refCanvas.current.getBoundingClientRect().height;
    const x = (ev.pageX - refCanvas.current.offsetLeft) / width;
    const y = (ev.pageY - refCanvas.current.offsetTop) / height;

    addClick(x, y, true);
    setGesturePoints(prev => [...prev, [x, y]]);
    redraw();
  };

  const pointerUpHandler = (ev: PointerEvent) => {
    if (!paint) return;
    setPaint(false);

    // Reconnaissance du geste
    const recognizedGesture = recognizer.check(gesturePoints) as Gesture;
    setGesture(recognizedGesture);

    // Traitement des gestes de navigation
    if (recognizedGesture.recognized) {
      if (recognizedGesture.name === 'next') {
        dispatch(setCurrentEvent('next'));
      } else if (recognizedGesture.name === 'previous') {
        dispatch(setCurrentEvent('previous'));
      }
    }

    // Réinitialisation
    setClickX([]);
    setClickY([]);
    setClickDrag([]);
    setGesturePoints([]);
    setGesture(null);
  };

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    canvas.addEventListener('pointerdown', pointerDownHandler);
    canvas.addEventListener('pointermove', pointerMoveHandler);
    canvas.addEventListener('pointerup', pointerUpHandler);

    return () => {
      canvas.removeEventListener('pointerdown', pointerDownHandler);
      canvas.removeEventListener('pointermove', pointerMoveHandler);
      canvas.removeEventListener('pointerup', pointerUpHandler);
    };
  }, [paint, clickX, clickY, clickDrag, gesturePoints]);

  return (
    <canvas
      ref={refCanvas}
      className="stroke"
      style={{
        touchAction: 'none',
        width: '100%',
        height: '200px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#f5f5f5'
      }}
    />
  );
};

export default GestureCanvas; 