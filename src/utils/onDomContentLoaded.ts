export function onDomContentLoaded(callback: () => void | Promise<void>): void {
  const safeCallback = async () => {
    try {
      await callback();
    } catch (error) {
      console.error(error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeCallback);
  } else {
    void safeCallback();
  }
}
