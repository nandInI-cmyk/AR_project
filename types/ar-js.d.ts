declare module '@ar-js-org/ar.js' {
  export class Source {
    constructor(options: { sourceType: string });
    ready: boolean;
    domElement: HTMLVideoElement;
  }

  export class Context {
    constructor(options: { 
      cameraParametersUrl: string;
      detectionMode: string;
    });
    update(element: HTMLElement): void;
  }

  export class MarkerControls {
    constructor(
      context: Context,
      object3d: THREE.Object3D,
      options: {
        type: string;
        patternUrl: string;
      }
    );
    addEventListener(event: string, callback: () => void): void;
  }
} 