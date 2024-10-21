/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly GOOGLE_SERVICE_ACCOUNT_TYPE: string;
    readonly GOOGLE_SERVICE_ACCOUNT_PROJECT_ID: string;
    readonly GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID: string;
    readonly GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string;
    readonly GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: string;
    readonly GOOGLE_SERVICE_ACCOUNT_CLIENT_ID: string;
    readonly GOOGLE_SERVICE_ACCOUNT_AUTH_URI: string;
    readonly GOOGLE_SERVICE_ACCOUNT_TOKEN_URI: string;
    readonly GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL: string;
    readonly GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL: string;
    readonly GOOGLE_SHEET_ID: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
