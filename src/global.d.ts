// src/global.d.ts

export {};

declare global {
  interface Window {
    filterCards: () => void;
  }
}