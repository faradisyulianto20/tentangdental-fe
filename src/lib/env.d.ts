/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_ENV?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_STORAGE_BASE_URL?: string;
  readonly VITE_API_TIMEOUT_MS?: string; // Keep as string, your env.ts converts it!
  readonly VITE_AUTH_TOKEN_KEY?: string;
  readonly VITE_AUTH_USER_KEY?: string;
  readonly VITE_DEFAULT_PER_PAGE?: string;
  readonly VITE_ENABLE_API_LOG?: string; // Keep as string, your env.ts converts it!
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}