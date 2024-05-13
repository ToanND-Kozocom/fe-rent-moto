export const appConfig = {
  api: {
    url: import.meta.env.VITE_APP_API_URL,
  },
  pusher: {
    appKey: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    adminChanel: import.meta.env.VITE_ADMIN_CHANEL,
    endpoint: import.meta.env.VITE_PUSHER_ENDPOINT,
  },
  defaultImageMoto: import.meta.env.VITE_IMAGE_DEFAULT_MOTO,
}
