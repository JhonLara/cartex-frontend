"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import DonutChart from "@/components/charts/DonutChart";
import TrendLineChart from "@/components/charts/LineChart";
import MoraTable from "@/components/MoraTable";
import styles from "./dashboard.module.css";
import { fetchCreditsByMaturity, fetchPaymentsDetails } from "@/lib/api";

interface Filters {
  date: string;
  month: string[];
  year: string[];
  sex: string[];
  creditType: string[];
  city: string[];
}

interface CreditItem {
  identif: string;
  nombres: string;
  nom_tipocred: string;
  monto_ini: number;
  saldo_cap: number;
  capital_vencido: number;
  interes_vencido: number;
  seguro_vencido: number;
  otros_vencido: number;
  total_vencido: number;
  cap_vencido_30: number;
  cap_vencido_31_60: number;
  cap_vencido_61_90: number;
  cap_vencido_91_180: number;
  cap_vencido_181_360: number;
  cap_vencido_361: number;
  dias_mora: number;
  sexo: string;
  ciudad: string;
}

interface ReportVariables {
  total_cartera?: number;
  total_vencido?: number;
  total_vencido_loan_list?: number;
  sum_monto_ini?: number;
  sum_saldo_cap?: number;
  sum_monto_ini_loan_list?: number;
  sum_saldo_cap_loan_list?: number;
  sum_canceladas_loan_list?: number;
  porc_venc?: number;
}

interface ReportResponse {
  success: boolean;
  variables?: ReportVariables;
  data?: CreditItem[];
}

interface PaymentItem {
  fecha: string;
  identif: string;
  nombre: string;
  numdoc: string;
  tipo: string;
  detalle: string;
  vr_pago: number;
  tasa_iva: number;
  num_cred: string;
  cod_tipocred: string;
  nom_tipocred: string;
  num_externo: string;
}

interface PaymentsDetailsVariables {
  total_recaudos?: number;
}

interface PaymentsDetailsResponse {
  success: boolean;
  variables?: PaymentsDetailsVariables;
  data?: PaymentItem[];
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"carteraActiva" | "colocacionTotal">("carteraActiva");
  const [filters, setFilters] = useState<Filters>({
    date: new Date().toISOString().split("T")[0],
    month: [],
    year: [],
    sex: [],
    creditType: [],
    city: [],
  });

  const [report, setReport] = useState<ReportResponse | null>(null);
  const [paymentsDetails, setPaymentsDetails] = useState<PaymentsDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cutoff = new Date(filters.date);
      const startOfYear = `${cutoff.getFullYear()}-01-01`;

      const [res, paymentsRes] = await Promise.all([
        fetchCreditsByMaturity(filters.date),
        fetchPaymentsDetails(startOfYear, filters.date),
      ]);
      setReport(res);
      setPaymentsDetails(paymentsRes);
    } catch (e: any) {
      setError(e.message || "Error cargando datos");
    } finally {
      setLoading(false);
    }
  }, [filters.date]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredData = useMemo(() => {
    if (!report?.data) return [];
    return report.data.filter((item) => {
      const sexMatch = filters.sex.length === 0 || filters.sex.some((s) => item.sexo?.toUpperCase().includes(s.toUpperCase()));
      const cityMatch = filters.city.length === 0 || filters.city.some((c) => item.ciudad?.trim().toUpperCase().includes(c.toUpperCase()));
      const typeMatch = filters.creditType.length === 0 || filters.creditType.some((t) => item.nom_tipocred?.toUpperCase().includes(t.toUpperCase()));
      return sexMatch && cityMatch && typeMatch;
    });
  }, [report, filters.sex, filters.city, filters.creditType]);

  const donutTotalValue = useMemo(() => {
    if (activeTab === "carteraActiva") {
      return report?.variables?.total_cartera || 0;
    }
    return report?.variables?.sum_monto_ini_loan_list || 0;
  }, [report, activeTab]);

  const donutData = useMemo(() => {
    if (activeTab === "carteraActiva") {
      const total = report?.variables?.total_cartera || 0;
      const vencido = report?.variables?.total_vencido || 0;
      const alDia = Math.max(0, total - vencido);
      return [
        { name: "Cartera al día", value: alDia, color: "#22c55e" },
        { name: "Cartera Vencida", value: vencido, color: "#ef4444" },
      ];
    }

    // Colocación total (basado en datos cruzados del backend)
    const sumMontoIni = report?.variables?.sum_monto_ini_loan_list || 0;
    const sumSaldoCap = report?.variables?.sum_saldo_cap_loan_list || 0;
    const colocacionVencida = report?.variables?.total_vencido_loan_list || 0;
    const colocacionAlDia = Math.max(0, sumSaldoCap - colocacionVencida);
    const canceladas = Math.max(0, sumMontoIni - sumSaldoCap);
    return [
      { name: "Colocación al día", value: colocacionAlDia, color: "#3b82f6" },
      { name: "Colocación vencida", value: colocacionVencida, color: "#f59e0b" },
      { name: "Cuentas canceladas", value: canceladas, color: "#9ca3af" },
    ];
  }, [report, activeTab, filteredData]);

  const moraSummary = useMemo(() => {
    const summary = {
      rango1_30: 0,
      rango31_60: 0,
      rango61_90: 0,
      rango91_180: 0,
      rango181_360: 0,
      rango360plus: 0,
      total: 0,
    };
    for (const item of filteredData) {
      summary.rango1_30 += item.cap_vencido_30 || 0;
      summary.rango31_60 += item.cap_vencido_31_60 || 0;
      summary.rango61_90 += item.cap_vencido_61_90 || 0;
      summary.rango91_180 += item.cap_vencido_91_180 || 0;
      summary.rango181_360 += item.cap_vencido_181_360 || 0;
      summary.rango360plus += item.cap_vencido_361 || 0;
      summary.total += item.total_vencido || 0;
    }
    return summary;
  }, [filteredData]);

  const totalRecaudado = useMemo(() => {
    return paymentsDetails?.variables?.total_recaudos || 0;
  }, [paymentsDetails]);

  const recaudoPorTipo = useMemo(() => {
    if (!paymentsDetails?.data) return [];
    const map = new Map<string, number>();
    for (const item of paymentsDetails.data) {
      const tipo = item.tipo || "OTROS";
      map.set(tipo, (map.get(tipo) || 0) + (item.vr_pago || 0));
    }
    return Array.from(map.entries())
      .map(([tipo, total]) => ({ tipo, total }))
      .sort((a, b) => b.total - a.total);
  }, [paymentsDetails]);

  return (
    <div>
      <DashboardHeader onFiltersChange={setFilters} />

      <div className={styles.content}>
        {loading && <p style={{ padding: "1rem", color: "#6b7280" }}>Cargando datos...</p>}
        {error && <p style={{ padding: "1rem", color: "#ef4444" }}>Error: {error}</p>}

        {/* Top row: Donut + Bar charts */}
        <div className={styles.row}>
          <div className={`${styles.card} ${styles.half}`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Resumen de cartera</h3>
              <div className={styles.switch}>
                <button
                  className={`${styles.switchBtn} ${activeTab === "carteraActiva" ? styles.switchActive : ""}`}
                  onClick={() => setActiveTab("carteraActiva")}
                >
                  Cartera Activa
                </button>
                <button
                  className={`${styles.switchBtn} ${activeTab === "colocacionTotal" ? styles.switchActive : ""}`}
                  onClick={() => setActiveTab("colocacionTotal")}
                >
                  Colocación total
                </button>
              </div>
            </div>
            {loading ? (
              <div className={styles.spinnerContainer}>
                <div className={styles.spinner} />
              </div>
            ) : (
              <DonutChart data={donutData} totalValue={donutTotalValue} />
            )}
          </div>
          <div className={`${styles.card} ${styles.half}`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Recaudo</h3>
              <span className={styles.infoIcon}>ⓘ</span>
            </div>
            <div className={styles.metric} style={{ marginBottom: "1.5rem" }}>
              <p className={styles.metricLabel}>Total recaudado</p>
              <p className={styles.metricValue}>
                ${totalRecaudado.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
              <p className={styles.metricCurrency}>COP</p>
            </div>
            <div style={{ overflowY: "auto", maxHeight: "280px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e5e7eb", textAlign: "left" }}>
                    <th style={{ padding: "8px 4px", color: "#6b7280", fontWeight: 600 }}>Tipo</th>
                    <th style={{ padding: "8px 4px", color: "#6b7280", fontWeight: 600, textAlign: "right" }}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {recaudoPorTipo.map(({ tipo, total }) => (
                    <tr key={tipo} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "8px 4px", color: "#374151" }}>{tipo}</td>
                      <td style={{ padding: "8px 4px", color: "#374151", textAlign: "right", fontWeight: 500 }}>
                        ${total.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Line chart row */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recaudo últimos 4 meses</h3>
          <div className={styles.lineWrapper}>
            <div className={styles.lineMetric}>
              <p className={styles.metricLabel}>Total 4 meses</p>
              <p className={styles.metricValue}>$6.890.760.000</p>
              <p className={styles.metricCurrency}>COP</p>
            </div>
            <div className={styles.lineChart}>
              <TrendLineChart />
            </div>
          </div>
        </div>

        {/* Table row */}
        <MoraTable data={moraSummary} />
      </div>
    </div>
  );
}
