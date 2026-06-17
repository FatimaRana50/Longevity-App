const { getDefaultConfig } = require('expo/metro-config');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('✅ Loaded .env.local');
} else {
  console.warn('⚠️ .env.local not found');
}

// Ensure environment variables are available
if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
  console.warn('❌ EXPO_PUBLIC_SUPABASE_URL not set');
}
if (!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('❌ EXPO_PUBLIC_SUPABASE_ANON_KEY not set');
}

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false,
    },
  }),
};

module.exports = config;
