import { ref } from 'vue';

export const useAccessibility = () => {
  const fontSize = ref(16);
  const isHighContrast = ref(false);

  const increaseFontSize = () => {
    fontSize.value += 2;
    updateRootFontSize();
  };

  const decreaseFontSize = () => {
    fontSize.value = Math.max(10, fontSize.value - 2); // Prevent font size from becoming too small
    updateRootFontSize();
  };

  const toggleHighContrast = () => {
    isHighContrast.value = !isHighContrast.value;
    updateHighContrast();
  };

  const updateRootFontSize = () => {
    if (process.client) {
      document.documentElement.style.fontSize = `${fontSize.value}px`;
    }
  };

  const updateHighContrast = () => {
    if (process.client) {
      if (isHighContrast.value) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    }
  };

  return {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    isHighContrast,
    toggleHighContrast,
  };
}; 