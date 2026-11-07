/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_ROOT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
