export const MIME_TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export const SUPPORTED_IMAGE_MIME_TYPES = new Set(
  Object.values(MIME_TYPE_BY_EXTENSION),
);

export const MAX_PROFILE_IMAGE_SIZE = 50 * 1024 * 1024;
