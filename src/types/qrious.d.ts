declare module 'qrious' {
  interface QRiousOptions {
    element?: HTMLElement;
    value?: string;
    size?: number;
    background?: string;
    foreground?: string;
  }

  class QRious {
    constructor(options: QRiousOptions);
  }

  export default QRious;
}