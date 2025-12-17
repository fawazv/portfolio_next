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
      if (!this.video || this.video.paused || this.video.ended) return;

      if (this.video.currentTime !== this.lastVideoTime) {
        this.lastVideoTime = this.video.currentTime;
        const startTimeMs = performance.now();
        const results = this.handLandmarker?.detectForVideo(this.video, startTimeMs);
        if (results) {
            this.resultsCallback(results);
        }
      }
      requestAnimationFrame(predict);
    };
    
    predict();
  }

  stop() {
    this.video = null;
    // We don't necessarily need to close the landmarker if we want to restart it quickly
  }
}
