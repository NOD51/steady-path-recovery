import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.recovery',
  appName: 'steady-path-recovery',
  webDir: 'dist',
  server: {
    url: 'https://94c2be83-a880-4945-9742-700bf2884dfb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
