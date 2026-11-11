// Halaman HTML berasingan menggunakan alamat Worker daripada metadata halaman.
// Kekalkan fail konfigurasi sedia ada jika pemasangan anda menggunakan alamat lain.
(() => {
  if (typeof window.MXU_WORKER_ORIGIN === "string" && window.MXU_WORKER_ORIGIN.trim()) return;
  const metadata = document.querySelector('meta[name="mxu-api-origin"]');
  window.MXU_WORKER_ORIGIN = metadata ? metadata.content.trim() : "";
})();
