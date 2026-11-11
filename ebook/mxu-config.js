// API eBook kekal menggunakan Worker yang ditetapkan pada metadata halaman.
// Pautan perkongsian menggunakan halaman OG produk pada domain rasmi.
(() => {
  if (typeof window.MXU_WORKER_ORIGIN !== "string" || !window.MXU_WORKER_ORIGIN.trim()) {
    const metadata = document.querySelector('meta[name="mxu-api-origin"]');
    window.MXU_WORKER_ORIGIN = metadata ? metadata.content.trim() : "";
  }
  if (typeof window.MXU_SHARE_BASE_URL !== "string" || !window.MXU_SHARE_BASE_URL.trim()) {
    const shareMeta = document.querySelector('meta[name="mxu-share-base"]');
    window.MXU_SHARE_BASE_URL = shareMeta && shareMeta.content.trim()
      ? shareMeta.content.trim()
      : "https://www.mastaxul.my/ebook";
  }
})();
