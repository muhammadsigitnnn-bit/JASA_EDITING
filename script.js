/* =====================================================
   PENGATURAN — ubah bagian ini sesuai data kamu
   ===================================================== */
const CONFIG = {
  // Nomor WhatsApp: awali 62 (tanpa 0, tanpa +, tanpa spasi)
  // Contoh: 0812-3456-7890  ->  6288989653767
  whatsappNumber: "6288989653767",

  // Nama yang muncul di pesan pembuka
  namaKamu: "Muhammad Sigit"
};

/* ===================================================== */

const waBase = `https://wa.me/${CONFIG.whatsappNumber}`;

// Tombol WhatsApp melayang: chat langsung dengan pesan singkat
const waFloat = document.getElementById("waFloat");
const pesanAwal = `${waBase}?text=${encodeURIComponent("Halo, saya mau tanya soal jasa edit video.")}`;
waFloat.href = pesanAwal;

// Tombol "Pesan lewat WhatsApp" di bagian atas
const heroWa = document.getElementById("heroWa");
if (heroWa) heroWa.href = pesanAwal;

// Tahun di footer
document.getElementById("year").textContent = new Date().getFullYear();

// Header berubah saat halaman di-scroll
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 30);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Menu mobile
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Hanya satu video yang diputar dalam satu waktu
const videos = document.querySelectorAll(".video-card video");
videos.forEach((video) => {
  video.addEventListener("play", () => {
    videos.forEach((other) => {
      if (other !== video) other.pause();
    });
  });
});

// Form pesanan
const form = document.getElementById("orderForm");
const jenisSelect = document.getElementById("jenis");
const levelSelect = document.getElementById("level");
const formError = document.getElementById("formError");

function pilihDanScroll(select, value) {
  const option = [...select.options].find((o) => o.value === value || o.text === value);
  if (option) select.value = option.value || option.text;
  document.getElementById("pesan").scrollIntoView({ behavior: "smooth" });
}

// Tombol "Pesan jenis ini" pada tiap video
document.querySelectorAll("[data-jenis]").forEach((btn) => {
  btn.addEventListener("click", () => pilihDanScroll(jenisSelect, btn.dataset.jenis));
});

// Tombol pilih paket harga
document.querySelectorAll("[data-level]").forEach((btn) => {
  btn.addEventListener("click", () => pilihDanScroll(levelSelect, btn.dataset.level));
});

// Tombol "Isi form dengan contoh ini"
const fillExample = document.getElementById("fillExample");
if (fillExample) {
  fillExample.addEventListener("click", () => {
    form.nama.value = "Budi Santoso";
    form.jenis.value = "Vlog";
    form.level.value = "Menengah (mulai Rp50K)";
    form.durasi.value = "10 menit";
    form.deadline.value = "3 hari lagi";
    form.catatan.value = "Vlog liburan ke Bali, hasil akhir sekitar 3 menit. Musik santai, judul teks di awal, warna hangat.";
    formError.textContent = "";
    form.nama.focus();
  });
}

// Kirim ke WhatsApp
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    nama: form.nama.value.trim(),
    jenis: form.jenis.value,
    level: form.level.value,
    durasi: form.durasi.value.trim(),
    deadline: form.deadline.value.trim(),
    catatan: form.catatan.value.trim()
  };

  // Validasi
  [form.nama, form.jenis, form.level].forEach((el) => el.classList.remove("invalid"));
  const kosong = [];
  if (!data.nama) { kosong.push("nama"); form.nama.classList.add("invalid"); }
  if (!data.jenis) { kosong.push("jenis video"); form.jenis.classList.add("invalid"); }
  if (!data.level) { kosong.push("tingkat editing"); form.level.classList.add("invalid"); }

  if (kosong.length) {
    formError.textContent = `Lengkapi dulu: ${kosong.join(", ")}.`;
    return;
  }
  formError.textContent = "";

  const pesan = [
    `Halo ${CONFIG.saya},mau pesan jasa edit video.`,
    "",
    `Nama: ${data.nama}`,
    `Jenis video: ${data.jenis}`,
    `Tingkat editing: ${data.level}`,
    `Durasi video mentah: ${data.durasi || "-"}`,
    `Batas waktu: ${data.deadline || "-"}`,
    `Catatan: ${data.catatan || "-"}`,
    "",
    "Mohon info harga dan langkah selanjutnya. Terima kasih."
  ].join("\n");

  const url = `${waBase}?text=${encodeURIComponent(pesan)}`;
  const jendela = window.open(url, "_blank");
  // Jika popup diblokir browser, buka di tab yang sama
  if (!jendela) window.location.href = url;
});
