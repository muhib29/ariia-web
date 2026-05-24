// apps/web/custom-elements.d.ts

// Ensure this file is treated as a module with global JSX extensions
export {};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url?: string;
        style?: React.CSSProperties;
      };

      'dotlottie-player': any;
    }
  }
}

// Alternative global declaration
declare global {
  interface HTMLElementTagNameMap {
    'dotlottie-player': HTMLElement;
  }
}

// Allow importing/using .lottie assets if needed
declare module '*.lottie';
