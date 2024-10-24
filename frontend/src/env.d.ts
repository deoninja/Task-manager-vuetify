/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
