import Link from "next/link";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Cartex Platform</h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
        Gestiona usuarios, pagos y accesos desde un solo lugar.
      </p>
      <Link
        href="/dashboard"
        style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          background: "#3b82f6",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Ir al Dashboard
      </Link>
    </div>
  );
}
