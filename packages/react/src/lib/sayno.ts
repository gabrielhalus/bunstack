type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
};

let resolvePromise: ((value: boolean) => void) | null = null;
let currentOptions: ConfirmOptions = {};

export default (options: ConfirmOptions = {}): Promise<boolean> => {
  return new Promise((resolve) => {
    currentOptions = options;
    resolvePromise = resolve;

    // Dispatch event to open dialog with options
    window.dispatchEvent(new CustomEvent("sayno-update", {
      detail: {
        open: true,
        options: currentOptions,
        resolve: resolvePromise,
      },
    }));
  });
};

// Function to handle dialog result
export function handleDialogResult(confirmed: boolean) {
  if (resolvePromise) {
    resolvePromise(confirmed);
    resolvePromise = null;
  }

  // Close dialog
  window.dispatchEvent(new CustomEvent("sayno-update", {
    detail: { open: false, options: {}, resolve: null },
  }));
}

// Export for use in the component
export function getDialogState() {
  return {
    open: false,
    options: currentOptions,
    resolve: resolvePromise,
  };
}
