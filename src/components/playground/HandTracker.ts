import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

export class HandTracker {
  private handLandmarker: HandLandmarker | undefined;
  private runningMode: 'IMAGE' | 'VIDEO' = 'VIDEO';
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private lastVideoTime = -1;
  private resultsCallback: (result: any) => void;

  constructor(onResults: (result: any) => void) {
    this.resultsCallback = onResults;
  }

  async initialize() {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
    );
    
    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: 'GPU',
      },
      runningMode: this.runningMode,
      numHands: 2,
    });
  }

  start(video: HTMLVideoElement) {
    this.video = video;
    if (!this.handLandmarker) return; 

    const predict = async () => {
      // Loop continuation condition
      if (!this.video) return; // Stop if video ref removed
      
      requestAnimationFrame(predict);

      if (this.video.paused || this.video.ended) return;

      // Strict check for valid data
      if (this.video.readyState < 2 || this.video.videoWidth < 1 || this.video.videoHeight < 1) {
          return;
      }

      const now = performance.now();
      if (this.video.currentTime !== this.lastVideoTime) {
        this.lastVideoTime = this.video.currentTime;
        try {
            const results = this.handLandmarker?.detectForVideo(this.video, now);
            if (results) {
                this.resultsCallback(results);
            }
        } catch (e) {
             // Suppress crashes from MediaPipe internal checks
            console.warn("HandTracker suppressed error:", e);
        }
      }
    };
    
    predict();
  }

  stop() {
    this.video = null;
    // We don't necessarily need to close the landmarker if we want to restart it quickly
  }
}
