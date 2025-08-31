import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownTrayIcon, CodeBracketIcon, CameraIcon } from '@heroicons/react/24/outline';
import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

function getYouTubeEmbedUrl(url: string): string | null {
  // Extract the video ID from various YouTube URL formats
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? `https://www.youtube.com/embed/${match[1]}?enablejsapi=1` : null;
}

const GESTURE_MAP = {
  play: 'Play',
  pause: 'Pause',
};

type GestureType = keyof typeof GESTURE_MAP;

// Update the drawing function to show lines and points
function drawHand(ctx: CanvasRenderingContext2D, landmarks: any[], width = 640, height = 480) {
  ctx.save();
  // Flip horizontally for mirrored view
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
  
  // Draw lines between landmarks
  ctx.strokeStyle = '#00FF00'; // Green lines
  ctx.lineWidth = 2;
  
  // Draw lines for each finger
  const fingerConnections = [
    [0, 1, 2, 3, 4],     // Thumb
    [0, 5, 6, 7, 8],     // Index
    [0, 9, 10, 11, 12],  // Middle
    [0, 13, 14, 15, 16], // Ring
    [0, 17, 18, 19, 20]  // Pinky
  ];

  fingerConnections.forEach(finger => {
    for (let i = 0; i < finger.length - 1; i++) {
      const start = landmarks[finger[i]];
      const end = landmarks[finger[i + 1]];
      ctx.beginPath();
      ctx.moveTo(start[0], start[1]);
      ctx.lineTo(end[0], end[1]);
      ctx.stroke();
    }
  });

  landmarks.forEach((landmark, index) => {
    ctx.beginPath();
    ctx.arc(landmark[0], landmark[1], 4, 0, 2 * Math.PI);
    if (index === 0) {
      ctx.fillStyle = '#FF0000'; // Red for wrist
    } else if ([4, 8, 12, 16, 20].includes(index)) {
      ctx.fillStyle = '#0000FF'; // Blue for fingertips
    } else {
      ctx.fillStyle = '#FFA500'; // Orange for other points
    }
    ctx.fill();
  });
  ctx.restore();
}

// Update gesture detection for more reliable recognition
function detectGesture(landmarks: any[]): GestureType | null {
  if (!landmarks || landmarks.length < 21) return null;

  // Get y-coordinates of all fingertips
  const tips = [landmarks[4][1], landmarks[8][1], landmarks[12][1], landmarks[16][1], landmarks[20][1]];
  const indexY = landmarks[8][1];
  const wristY = landmarks[0][1];

  // Play: index finger is the highest (smallest y) and at least 30px above the next highest
  const minTipY = Math.min(...tips);
  const sortedTips = [...tips].sort((a, b) => a - b);
  const secondMinTipY = sortedTips[1];
  if (
    indexY === minTipY &&
    (secondMinTipY - indexY) > 30
  ) {
    console.log('Play gesture detected: Index finger highest');
    return 'play';
  }

  // Pause: all fingertips above wrist
  if (tips.every(y => y < wristY - 30)) {
    console.log('Pause gesture detected: Open palm');
    return 'pause';
  }

  return null;
}

export default function Demo() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [gesture, setGesture] = useState<string | null>(null);
  const [lastGesture, setLastGesture] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const handposeModel = useRef<any>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastGestureTime = useRef<number>(0);
  const overlayTimeoutRef = useRef<number | null>(null);
  const COOLDOWN_MS = 200; // Keep the cooldown at 200ms for responsiveness

  // YouTube Player API
  const playerRef = useRef<any>(null);
  useEffect(() => {
    if (!embedUrl) return;
    // Load YouTube IFrame API if not already loaded
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
    (window as any).onYouTubeIframeAPIReady = () => {
      if (iframeRef.current) {
        playerRef.current = new (window as any).YT.Player(iframeRef.current, {
          events: {},
        });
      }
    };
    // If API already loaded
    if ((window as any).YT && (window as any).YT.Player && iframeRef.current) {
      playerRef.current = new (window as any).YT.Player(iframeRef.current, {
        events: {},
      });
    }
  }, [embedUrl]);

  useEffect(() => {
    let isMounted = true;
    let stream: MediaStream | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let video: HTMLVideoElement | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let running = true;

    async function setup() {
      try {
        setError(null);
        await tf.setBackend('webgl');
        handposeModel.current = await handpose.load();
        video = videoRef.current;
        canvas = canvasRef.current;
        
        if (!video || !canvas) {
          throw new Error('Video or canvas element not found');
        }

        ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640,
            height: 480,
            facingMode: 'user'
          } 
        });
        
        video.srcObject = stream;
        await video.play();
        setIsCameraActive(true);

        const detect = async () => {
          if (!isMounted || !video || !canvas || !ctx || !handposeModel.current || !running) return;
          try {
            if (isProcessing) return;
            setIsProcessing(true);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const predictions = await handposeModel.current.estimateHands(video, true);

            if (predictions.length > 0 && predictions[0].landmarks) {
              drawHand(ctx, predictions[0].landmarks, canvas.width, canvas.height);
              const detected = detectGesture(predictions[0].landmarks);
              const now = Date.now();
              
              // Only trigger if detected gesture is different from lastGesture and cooldown is over
              if (detected && detected !== lastGesture && (now - lastGestureTime.current) > COOLDOWN_MS) {
                setGesture(GESTURE_MAP[detected]);
                setLastGesture(detected);
                lastGestureTime.current = now;
                
                // Clear any existing overlay timeout
                if (overlayTimeoutRef.current) {
                  clearTimeout(overlayTimeoutRef.current);
                }
                
                // Show overlay
                setShowOverlay(true);

                // Control YouTube video
                if (playerRef.current && playerRef.current.getPlayerState) {
                  if (detected === 'play') playerRef.current.playVideo();
                  if (detected === 'pause') playerRef.current.pauseVideo();
                } else if (iframeRef.current) {
                  const command = detected === 'play' ? 'playVideo' : 'pauseVideo';
                  iframeRef.current.contentWindow?.postMessage(
                    JSON.stringify({ event: 'command', func: command, args: [] }),
                    '*'
                  );
                }

                // Set a new timeout to hide overlay
                overlayTimeoutRef.current = setTimeout(() => {
                  setShowOverlay(false);
                  setGesture(null);
                }, 300); // Increased to 300ms for smoother transition
              } else if (!detected) {
                // Only clear gesture if no gesture is detected for a while
                if (now - lastGestureTime.current > 500) {
                  setGesture(null);
                  setShowOverlay(false);
                }
              }
            } else {
              setGesture(null);
              setShowOverlay(false);
            }
          } catch (err) {
            console.error('Error in detection loop:', err);
            setError('Error detecting gestures. Please try refreshing the page.');
          } finally {
            setIsProcessing(false);
            if (running) {
              animationFrameId.current = requestAnimationFrame(detect);
            }
          }
        };

        detect();
      } catch (err) {
        console.error('Setup error:', err);
        setError('Error setting up camera. Please check permissions and try again.');
        setIsCameraActive(false);
      }
    }

    setup();

    return () => {
      isMounted = false;
      running = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsCameraActive(false);
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
    };
  }, [cooldown]);

  const handleSetVideo = () => {
    const url = getYouTubeEmbedUrl(youtubeUrl);
    setEmbedUrl(url);
  };

  return (
    <div id="demo" className="bg-gray-50 py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Demo</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Try It Live: YouTube + Gestures
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Enter a YouTube video link, see it play below, and control it with your hand gestures!
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl flex flex-col gap-6 items-center">
          <div className="flex w-full gap-2">
            <input
              type="text"
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-base focus:ring-2 focus:ring-primary-500"
              placeholder="Paste YouTube link here..."
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
            />
            <button className="btn" onClick={handleSetVideo}>
              Load Video
            </button>
          </div>

          {embedUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="aspect-video w-full max-w-2xl overflow-hidden rounded-xl bg-gray-100 shadow-lg relative"
            >
              <iframe
                ref={iframeRef}
                className="h-full w-full"
                src={embedUrl}
                title="YouTube Gesture Controller Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          )}

          <div className="flex flex-col items-center gap-2 mt-8 relative">
            <div className="flex items-center gap-2">
              <CameraIcon className="h-6 w-6 text-primary-600" />
              <span className="font-semibold text-gray-700">
                Webcam + Gesture Detection {isCameraActive ? '(Active)' : '(Inactive)'}
              </span>
            </div>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                width={640}
                height={480}
                className="rounded-lg border border-gray-200 w-80 h-60 object-cover bg-black"
                style={{ transform: 'scaleX(-1)' }}
              />
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="absolute left-0 top-0 w-80 h-60 pointer-events-none"
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>
            {error && (
              <div className="mt-2 px-4 py-2 rounded bg-red-100 text-red-700 font-semibold shadow">
                {error}
              </div>
            )}
            {gesture && (
              <div className="mt-2 px-4 py-2 rounded bg-primary-100 text-primary-700 font-semibold shadow">
                Gesture detected: {gesture}
              </div>
            )}
            {!isCameraActive && !error && (
              <div className="mt-2 px-4 py-2 rounded bg-red-100 text-red-700 font-semibold shadow">
                Camera is not active. Please allow camera access.
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <a
            href="https://github.com/yourusername/youtube-gesture-controller"
            className="btn"
          >
            <CodeBracketIcon className="mr-2 h-5 w-5" />
            View on GitHub
          </a>
          <a
            href="/download/youtube-gesture-controller.zip"
            className="btn-secondary"
          >
            <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
            Download
          </a>
        </div>
      </div>
    </div>
  );
} 