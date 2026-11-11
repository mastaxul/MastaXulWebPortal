// Halaman HTML berasingan menggunakan alamat Worker daripada metadata halaman.
// Kekalkan fail konfigurasi sedia ada jika pemasangan anda menggunakan alamat lain.
(() => {
  if (typeof window.MXU_WORKER_ORIGIN !== "string" || !window.MXU_WORKER_ORIGIN.trim()) {
    const metadata = document.querySelector('meta[name="mxu-api-origin"]');
    window.MXU_WORKER_ORIGIN = metadata ? metadata.content.trim() : "";
  }
  if (typeof window.MXU_SHARE_BASE_URL !== "string" || !window.MXU_SHARE_BASE_URL.trim()) {
    const shareMeta = document.querySelector('meta[name="mxu-share-base"]');
    window.MXU_SHARE_BASE_URL = shareMeta && shareMeta.content.trim()
      ? shareMeta.content.trim()
      : (window.MXU_WORKER_ORIGIN ? window.MXU_WORKER_ORIGIN.replace(/\/+$/, "") + "/" : "");
  }
})();
