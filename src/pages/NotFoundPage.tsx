import { Link } from "react-router-dom";
import { ArrowIcon } from "../components/Icons";

export function NotFoundPage() {
  return (
    <main id="main-content-not-found" className="not-found-page" tabIndex={-1}>
      <p className="eyebrow">404 / LOST ORBIT</p>
      <h1>Halaman ini keluar dari lintasan.</h1>
      <p>Alamat yang kamu buka tidak ada, tetapi keenam proyek utama masih aman di pusat semesta.</p>
      <Link className="button primary-button" to="/">
        Kembali ke portfolio <ArrowIcon />
      </Link>
    </main>
  );
}
