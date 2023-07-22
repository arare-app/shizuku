declare global {
  interface Window {
    MaikoBCScriptLoaded?: boolean;
    BCSDialogShowMenu?: boolean;
    BCSDialogDrawMenu?: () => void;
  }
}

export {};
