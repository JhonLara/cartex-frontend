"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Usuarios", href: "/users" },
  { label: "Pagos", href: "/payments" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Cartex</div>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={pathname === item.href ? styles.active : ""}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.userSection}>
        <span>Admin</span>
        <Link href="/login" className={styles.logout}>
          Salir
        </Link>
      </div>
    </nav>
  );
}
