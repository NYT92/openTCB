<template>
  <div class="py-5">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2">
        openT<span class="text-sm font-light">wibbonize</span> C<span
          class="text-sm font-light"
          >ustom</span
        >
        B<span class="text-sm font-light">order</span>
      </h1>
      <p class="text-gray-400">
        {{ t("description") }}
      </p>

      <div class="flex gap-2 justify-center items-center mt-4">
        <UButton @click="$switchLocale('en')" color="info" variant="outline">🇺🇸 English</UButton>
        <UButton @click="$switchLocale('kh')" color="info" variant="outline">🇰🇭 Khmer</UButton>
      </div>
    </div>

    <div class="max-w-xl mx-auto">
      <div class="grid grid-cols-1 gap-8">
        <UCard>
          <h2 class="text-2xl font-semibold mb-4">{{ t("upload.title") }}</h2>
          <div
            @drop="handleImageDrop"
            @dragover.prevent
            @dragenter.prevent
            class="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors cursor-pointer"
            :class="{ 'border-blue-500': isDraggingImage }"
            @click="$refs.imageInput.click()"
          >
            <div v-if="!selectedImage">
              <svg
                class="mx-auto h-12 w-12 text-gray-400 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p class="text-gray-400 mb-2">
                {{ t("upload.dragAndDrop") }}
              </p>
              <p class="text-gray-500 text-sm">{{ t("upload.fileTypes") }}</p>
            </div>
            <div v-else class="text-green-400">
              <svg
                class="mx-auto h-12 w-12 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <p
                class="truncate max-w-xs text-center"
                :title="selectedImage.name"
              >
                {{ selectedImage.name }}
              </p>
              <p class="text-sm text-gray-400">
                {{ formatFileSize(selectedImage.size) }}
              </p>
            </div>
          </div>

          <input
            ref="imageInput"
            type="file"
            accept="image/*"
            @change="handleImageSelect"
            class="hidden"
          />
        </UCard>

        <UCard>
          <h2 class="text-2xl font-semibold mb-4">
            {{ t("frameOptions.title") }}
          </h2>
          <div class="mb-6">
            <div class="flex gap-2 mb-4">
              <UButton
                @click="frameMode = 'border'"
                :variant="frameMode === 'border' ? 'solid' : 'outline'"
                color="primary"
              >
                {{ t("frameOptions.simpleBorder") }}
              </UButton>
              <UButton
                @click="frameMode = 'frame'"
                :variant="frameMode === 'frame' ? 'solid' : 'outline'"
                color="primary"
              >
                {{ t("frameOptions.customFrame") }}
              </UButton>
            </div>
          </div>
          <!-- Simple Border Options -->
          <div v-if="frameMode === 'border'" class="space-y-4">
            <h3 class="text-lg font-semibold">
              {{ t("borderSettings.title") }}
            </h3>

            <!-- Border Width -->
            <div>
              <label class="block text-sm font-medium mb-2">{{
                t("borderSettings.width", { width: borderWidth })
              }}</label>
              <USlider v-model="borderWidth" :min="0" :max="50" />
            </div>

            <!-- Border Color -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{
                t("borderSettings.color")
              }}</label>
              <div class="flex gap-2 flex-wrap mb-2">
                <button
                  v-for="color in borderColors"
                  :key="color.name"
                  @click="borderColor = color.value"
                  class="w-8 h-8 rounded-full border-2 transition-all"
                  :style="{ backgroundColor: color.value }"
                  :class="
                    borderColor === color.value
                      ? 'border-white scale-110'
                      : 'border-gray-600'
                  "
                ></button>
              </div>
              <input
                v-model="borderColor"
                type="color"
                class="w-full h-10 bg-gray-700 border border-gray-600 rounded cursor-pointer"
              />
            </div>

            <!-- Border Style -->
            <div>
              <label class="block text-sm font-medium mb-2">{{
                t("borderSettings.style")
              }}</label>
              <USelect v-model="borderStyle" :options="borderStyleOptions" />
            </div>

            <!-- Border Radius -->
            <div>
              <label class="block text-sm font-medium mb-2">{{
                t("borderSettings.radius", { radius: borderRadius })
              }}</label>
              <USlider v-model="borderRadius" :min="0" :max="100" />
            </div>
          </div>

          <!-- Custom Frame Options -->
          <div v-else class="space-y-4">
            <h3 class="text-lg font-semibold">
              {{ t("frameSelection.title") }}
            </h3>
            <div>
              <p class="block text-sm font-medium text-gray-300 mb-3">
                {{ t("frameSelection.premade") }}
              </p>
              <div class="grid grid-cols-3 gap-2">
                <div
                  v-if="pending"
                  class="col-span-3 text-center text-gray-400 py-4"
                >
                  {{ t("frameSelection.loading") }}
                </div>
                <div
                  v-else-if="error"
                  class="col-span-3 text-center text-red-400 py-4"
                >
                  {{ t("frameSelection.error") }}
                </div>
                <div
                  v-else-if="!premadeFrames || premadeFrames.length === 0"
                  class="col-span-3 text-center text-gray-400 py-4"
                >
                  {{ t("frameSelection.none") }}
                </div>
                <button
                  v-else
                  v-for="frame in premadeFrames"
                  :key="frame.name"
                  @click="selectFrame(frame.path || frame.cdn_url)"
                  class="relative border-2 rounded-lg overflow-hidden transition-all hover:scale-105"
                  :class="
                    selectedFramePath === (frame.path || frame.cdn_url)
                      ? 'border-blue-500'
                      : 'border-gray-600'
                  "
                >
                  <img
                    :src="frame.path || frame.cdn_url"
                    :alt="frame.name"
                    class="w-full h-[10rem] object-cover"
                    @error="handleImageError"
                  />
                  <div
                    class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <span class="text-white text-xs font-medium">
                      {{ frame.name }} by {{ frame.credit }}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{
                t("frameSelection.upload")
              }}</label>
              <div
                @drop="handleFrameDrop"
                @dragover.prevent
                @dragenter.prevent
                class="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-500 transition-colors cursor-pointer"
                :class="{ 'border-blue-500': isDraggingFrame }"
                @click="$refs.frameInput.click()"
              >
                <div v-if="!customFrameUrl">
                  <svg
                    class="mx-auto h-8 w-8 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p class="text-gray-400 text-sm">
                    {{ t("frameSelection.uploadHint") }}
                  </p>
                </div>
                <div v-else class="text-green-400">
                  <svg
                    class="mx-auto h-8 w-8 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <p class="text-sm">{{ t("frameSelection.uploaded") }}</p>
                </div>
              </div>

              <input
                ref="frameInput"
                type="file"
                accept="image/*"
                @change="handleFrameSelect"
                class="hidden"
              />
            </div>

            <div v-if="selectedFramePath || customFrameUrl">
              <h4 class="text-md font-medium text-gray-300 mb-3">
                {{ t("frameControls.title") }}
              </h4>

              <div class="mb-3">
                <label class="block text-sm font-medium mb-2">
                  {{ t("frameControls.opacity", { opacity: frameOpacity }) }}
                </label>
                <USlider v-model="frameOpacity" :min="10" :max="100" />
              </div>
            </div>
          </div>
        </UCard>
        
        <UCard v-if="imageUrl">
          <h2 class="text-2xl font-semibold mb-4">Image Adjustments</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2"
                >Zoom ({{ imageZoom }}%)</label
              >
              <USlider v-model="imageZoom" :min="20" :max="300" />
            </div>
            <div>
              <h5 class="text-sm font-medium text-gray-300 mb-2">
                Position
              </h5>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs text-gray-400 mb-1"
                    >X: {{ Math.round(imagePosition.x) }}</label
                  >
                  <input
                    v-model="imagePosition.x"
                    type="range"
                    :min="-exportSize.width / 2"
                    :max="exportSize.width / 2"
                    class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-400 mb-1"
                    >Y: {{ Math.round(imagePosition.y) }}</label
                  >
                  <input
                    v-model="imagePosition.y"
                    type="range"
                    :min="-exportSize.height / 2"
                    :max="exportSize.height / 2"
                    class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
              <UButton
                @click="resetImagePositionAndZoom"
                size="xs"
                variant="outline"
                class="mt-2"
                >Reset</UButton
              >
            </div>
          </div>
        </UCard>

        <!-- Preview Section -->
        <UCard>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold">{{ t("preview.title") }}</h2>
            <UButton
              v-if="imageUrl"
              @click="downloadImage"
              color="primary"
              variant="solid"
            >
              {{ t("preview.download") }}
            </UButton>
          </div>

          <div
            class="bg-gray-700 rounded-lg p-4 min-h-[400px] flex items-center justify-center"
          >
            <div v-if="!imageUrl" class="text-center text-gray-400">
              <svg
                class="mx-auto h-16 w-16 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <p>{{ t("preview.uploadPrompt") }}</p>
            </div>

            <div v-else class="relative max-w-full max-h-full">
              <div
                class="relative inline-block overflow-hidden"
                :style="previewContainerStyle"
              >
                <img
                  ref="previewImage"
                  :src="imageUrl"
                  :style="draggableImageStyle"
                  class="max-w-none cursor-move select-none"
                  alt="Preview with frame"
                  @mousedown="startDrag"
                  @touchstart="startDrag"
                />
                <img
                  v-if="
                    frameMode === 'frame' &&
                    (selectedFramePath || customFrameUrl)
                  "
                  :src="selectedFramePath || customFrameUrl"
                  class="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  :style="frameStyle"
                  alt="Frame overlay"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <footer class="text-center text-gray-400 text-sm mt-4">
      <p>
        <a href="https://github.com/NYT92/openTCB" target="_blank"> openTCB </a>
        |
        <a href="https://github.com/NYT92" target="_blank"> NYT92 </a>
      </p>
    </footer>
  </div>
</template>

<script setup>
const { t, $switchLocale } = useI18n();
const selectedImage = ref(null);
const imageUrl = ref("");
const isDraggingImage = ref(false);
const isDraggingFrame = ref(false);
const frameMode = ref("border");

const borderWidth = ref(10);
const borderColor = ref("#ffffff");
const borderStyle = ref("solid");
const borderRadius = ref(0);

const selectedFramePath = ref("");
const customFrameUrl = ref("");
const frameOpacity = ref(100);
const imageZoom = ref(100);

const imagePosition = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const exportSize = ref({ width: 1024, height: 1024 });
const previewSize = ref({ width: 300, height: 300 });

const borderColors = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Yellow", value: "#f59e0b" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
];

const borderStyleOptions = computed(() => [
  { label: t("borderSettings.styles.solid"), value: "solid" },
  { label: t("borderSettings.styles.dashed"), value: "dashed" },
  { label: t("borderSettings.styles.dotted"), value: "dotted" },
  { label: t("borderSettings.styles.double"), value: "double" },
  { label: t("borderSettings.styles.groove"), value: "groove" },
  { label: t("borderSettings.styles.ridge"), value: "ridge" },
]);

const {
  data: premadeFrames,
  pending,
  error,
} = await useFetch(
  "https://rawcdn.githack.com/NYT92/openTCB/refs/heads/master/provided_frame.json",
  {
    responseType: "json",
    cache: "force-cache",
  }
);

const frameStyle = computed(() => ({
  opacity: frameOpacity.value / 100,
}));

const updatePreviewSize = () => {
  const maxWidth = Math.min(window.innerWidth - 100, 400);
  const maxHeight = Math.min(window.innerHeight - 300, 400);
  const size = Math.min(maxWidth, maxHeight);
  previewSize.value = { width: size, height: size };
};

const previewContainerStyle = computed(() => ({
  width: `${previewSize.value.width}px`,
  height: `${previewSize.value.height}px`,
  border:
    frameMode.value === "border"
      ? `${borderWidth.value}px ${borderStyle.value} ${borderColor.value}`
      : "none",
  borderRadius: frameMode.value === "border" ? `${borderRadius.value}px` : "0",
  maxWidth: "100%",
  maxHeight: "100%",
}));

const draggableImageStyle = computed(() => {
  const scaleX = previewSize.value.width / exportSize.value.width;
  const scaleY = previewSize.value.height / exportSize.value.height;

  return {
    transform: `translate(${imagePosition.value.x * scaleX}px, ${
      imagePosition.value.y * scaleY
    }px) scale(${imageZoom.value / 100})`,
    width: `${previewSize.value.width}px`,
    height: `${previewSize.value.height}px`,
    objectFit: "contain",
  };
});

const handleImageSelect = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    selectedImage.value = file;
    if (imageUrl.value) {
      URL.revokeObjectURL(imageUrl.value);
    }
    imageUrl.value = URL.createObjectURL(file);
    resetImagePositionAndZoom();
  }
};

const handleImageDrop = (event) => {
  event.preventDefault();
  isDraggingImage.value = false;

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith("image/")) {
      selectedImage.value = file;
      if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value);
      }
      imageUrl.value = URL.createObjectURL(file);
      resetImagePositionAndZoom();
    }
  }
};

const handleFrameSelect = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    if (customFrameUrl.value) {
      URL.revokeObjectURL(customFrameUrl.value);
    }
    customFrameUrl.value = URL.createObjectURL(file);
    selectedFramePath.value = "";
  }
};

const handleFrameDrop = (event) => {
  event.preventDefault();
  isDraggingFrame.value = false;

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith("image/")) {
      if (customFrameUrl.value) {
        URL.revokeObjectURL(customFrameUrl.value);
      }
      customFrameUrl.value = URL.createObjectURL(file);
      selectedFramePath.value = "";
    }
  }
};

const selectFrame = (framePath) => {
  selectedFramePath.value = framePath;
  if (customFrameUrl.value) {
    URL.revokeObjectURL(customFrameUrl.value);
    customFrameUrl.value = "";
  }
};

const resetImagePositionAndZoom = () => {
  imagePosition.value = { x: 0, y: 0 };
  imageZoom.value = 100;
};

const startDrag = (event) => {
  isDragging.value = true;
  const clientX =
    event.type === "touchstart" ? event.touches[0].clientX : event.clientX;
  const clientY =
    event.type === "touchstart" ? event.touches[0].clientY : event.clientY;

  const scaleX = previewSize.value.width / exportSize.value.width;
  const scaleY = previewSize.value.height / exportSize.value.height;

  dragStart.value = {
    x: clientX - imagePosition.value.x * scaleX,
    y: clientY - imagePosition.value.y * scaleY,
  };

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", onDrag);
  document.addEventListener("touchend", stopDrag);

  event.preventDefault();
};

const onDrag = (event) => {
  if (!isDragging.value) return;

  const clientX =
    event.type === "touchmove" ? event.touches[0].clientX : event.clientX;
  const clientY =
    event.type === "touchmove" ? event.touches[0].clientY : event.clientY;

  const scaleX = exportSize.value.width / previewSize.value.width;
  const scaleY = exportSize.value.height / previewSize.value.height;

  const newX = (clientX - dragStart.value.x) * scaleX;
  const newY = (clientY - dragStart.value.y) * scaleY;

  const maxOffset =
    Math.min(exportSize.value.width, exportSize.value.height) * 0.5;

  imagePosition.value = {
    x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
    y: Math.max(-maxOffset, Math.min(maxOffset, newY)),
  };

  event.preventDefault();
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", stopDrag);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const handleImageError = (event) => {
  console.warn("Failed to load frame image:", event.target.src);
  event.target.style.display = "none";
};

const downloadImage = async () => {
  if (!imageUrl.value) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = async () => {
    const drawContainedImage = (context, targetWidth, targetHeight) => {
      const imgRatio = img.width / img.height;
      const targetRatio = targetWidth / targetHeight;
      let drawWidth = targetWidth;
      let drawHeight = targetHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > targetRatio) {
        drawHeight = targetWidth / imgRatio;
        offsetY = (targetHeight - drawHeight) / 2;
      } else {
        drawWidth = targetHeight * imgRatio;
        offsetX = (targetWidth - drawWidth) / 2;
      }

      const zoom = imageZoom.value / 100;
      const zoomedWidth = drawWidth * zoom;
      const zoomedHeight = drawHeight * zoom;

      const panX = imagePosition.value.x;
      const panY = imagePosition.value.y;

      context.clearRect(0, 0, targetWidth, targetHeight);
      context.drawImage(
        img,
        offsetX - (zoomedWidth - drawWidth) / 2 + panX,
        offsetY - (zoomedHeight - drawHeight) / 2 + panY,
        zoomedWidth,
        zoomedHeight
      );
    };

    if (frameMode.value === "border") {
      const borderSize = borderWidth.value;
      canvas.width = exportSize.value.width + borderSize * 2;
      canvas.height = exportSize.value.height + borderSize * 2;

      ctx.fillStyle = borderColor.value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const imageCanvas = document.createElement("canvas");
      imageCanvas.width = exportSize.value.width;
      imageCanvas.height = exportSize.value.height;
      const imageCtx = imageCanvas.getContext("2d");

      drawContainedImage(imageCtx, exportSize.value.width, exportSize.value.height);

      ctx.drawImage(imageCanvas, borderSize, borderSize);

      const link = document.createElement("a");
      link.download = `bordered-${selectedImage.value?.name || "image.png"}-${Date.now()}`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } else {
      canvas.width = exportSize.value.width;
      canvas.height = exportSize.value.height;

      drawContainedImage(ctx, canvas.width, canvas.height);

      const frameSrc = selectedFramePath.value || customFrameUrl.value;
      if (frameSrc) {
        const frameImg = new Image();
        frameImg.crossOrigin = "anonymous";
        frameImg.onload = () => {
          ctx.globalAlpha = frameOpacity.value / 100;
          ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

          const link = document.createElement("a");
          link.download = `framed-${selectedImage.value?.name || "image.png"}-${Date.now()}`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        };
        frameImg.src = frameSrc;
      } else {
        const link = document.createElement("a");
        link.download = `image-${selectedImage.value?.name || "image.png"}-${Date.now()}`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    }
  };

  img.src = imageUrl.value;
};

const customUrl = useRoute().query;

onMounted(() => {
  updatePreviewSize();
  window.addEventListener("resize", updatePreviewSize);

  if (customUrl.t === "custom") {
    frameMode.value = "frame";
  }
  if (customUrl.t === "custom" && customUrl.data) {
    const base64 = customUrl.data;
    imageUrl.value = `data:image/png;base64,${base64}`;
  }
});

onUnmounted(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
  if (customFrameUrl.value) {
    URL.revokeObjectURL(customFrameUrl.value);
  }
  window.removeEventListener("resize", updatePreviewSize);
});
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
</style>
