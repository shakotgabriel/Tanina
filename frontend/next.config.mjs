import withPWA from 'next-pwa';

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: 'no',
    viewportFit: 'cover',
    orientation: 'portrait'
  }
})({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  }
});

export default config;