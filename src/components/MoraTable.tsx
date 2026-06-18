import styles from "./MoraTable.module.css";

interface MoraSummary {
  rango1_30: number;
  rango31_60: number;
  rango61_90: number;
  rango91_180: number;
  rango181_360: number;
  rango360plus: number;
  total: number;
}

interface MoraTableProps {
  data?: MoraSummary;
}

function formatCOP(n: number) {
  return "$" + n.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const rowsConfig = [
  { key: "rango1_30" as keyof MoraSummary, label: "1 - 30", color: "#22c55e" },
  { key: "rango31_60" as keyof MoraSummary, label: "31 - 60", color: "#eab308" },
  { key: "rango61_90" as keyof MoraSummary, label: "61 - 90", color: "#f97316" },
  { key: "rango91_180" as keyof MoraSummary, label: "91 - 180", color: "#ef4444" },
  { key: "rango181_360" as keyof MoraSummary, label: "181 - 360", color: "#b91c1c" },
  { key: "rango360plus" as keyof MoraSummary, label: "360+", color: "#7f1d1d" },
];

export default function MoraTable({ data }: MoraTableProps) {
  const d = data || {
    rango1_30: 0,
    rango31_60: 0,
    rango61_90: 0,
    rango91_180: 0,
    rango181_360: 0,
    rango360plus: 0,
    total: 0,
  };

  const totalPortfolio = rowsConfig.reduce((sum, r) => sum + (d[r.key] || 0), 0);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Cartera en mora por edades</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Edad de mora<br /><span className={styles.sub}>(días)</span></th>
              <th>Valor vencido<br /><span className={styles.sub}>(COP)</span></th>
            </tr>
          </thead>
          <tbody>
            {rowsConfig.map((r) => {
              const val = d[r.key] || 0;
              const pct = totalPortfolio > 0 ? ((val / totalPortfolio) * 100).toFixed(1) + "%" : "0%";
              return (
                <tr key={r.key}>
                  <td>
                    <span className={styles.dot} style={{ background: r.color }} />
                    {r.label}
                  </td>
                  <td>{formatCOP(val)}</td>
                </tr>
              );
            })}
            <tr className={styles.total}>
              <td><strong>Total</strong></td>
              <td><strong>{formatCOP(d.total)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={styles.footnote}>
        Los valores se calculan a partir del capital vencido por rango de días.
      </p>
    </div>
  );
}
