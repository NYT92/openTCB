<template>
  <UApp>
    <div
      v-if="isUnsupportedBrowser"
      class="min-h-screen flex items-center justify-center flex-col gap-4"
    >
      <p class="text-center text-xl">
        {{ t("notice") }}
      </p>
      <UButton
        @click="isUnsupportedBrowser = false"
        size="xl"
        icon="i-heroicons-x-mark"
      >
        {{ t("close") }}
      </UButton>
    </div>
    <div v-else>
      <header class="p-4 bg-gray-800 text-white">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="text-xl font-bold">openTCB | អូភីនធីស៊ីបឺ</h1>
          <div class="flex gap-4 items-center">
            <div class="flex gap-2 items-center">
              <UButton
                @click="decreaseFontSize"
                color="info"
                variant="outline"
                size="xs"
                >A-</UButton
              >
              <UButton
                @click="increaseFontSize"
                color="info"
                variant="outline"
                size="xs"
                >A+</UButton
              >
            </div>
            <UButton
              @click="toggleHighContrast"
              color="info"
              variant="outline"
              size="xs"
            >
              {{ isHighContrast ? "Standard Contrast" : "High Contrast" }}
            </UButton>
          </div>
        </div>
      </header>
      <NuxtRouteAnnouncer />
      <NuxtPage />
      
      <footer class="text-center text-gray-400 text-xl mt-4">
        <p>
          <a href="https://github.com/NYT92/openTCB" target="_blank">
            openTCB
          </a>
          |
          <a href="https://github.com/NYT92" target="_blank">
            Created by NYT92 🇰🇭
          </a>
        </p>
      </footer>
    </div>
    <UNotifications />
  </UApp>
</template>

<script setup lang="ts">
import { useAccessibility } from "~/composables/useAccessibility";

const { t } = useI18n();

const {
  increaseFontSize,
  decreaseFontSize,
  isHighContrast,
  toggleHighContrast,
} = useAccessibility();

const isUnsupportedBrowser = ref(false);

onMounted(() => {
  const userAgent = navigator.userAgent.toLowerCase();
  // Common User-Agent keywords for in-app browsers
  const unsupportedKeywords = [
    "fban", // Facebook App for Android
    "fbav", // Facebook App Version
    "instagram", // Instagram
    "tiktok", // TikTok
    "musical_ly", // TikTok's old name
  ];

  isUnsupportedBrowser.value = unsupportedKeywords.some((keyword) =>
    userAgent.includes(keyword)
  );
});
</script>

<style>
html {
  color-scheme: dark;
}
</style>
