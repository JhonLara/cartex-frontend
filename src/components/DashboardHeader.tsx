"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./DashboardHeader.module.css";

const monthOptions = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const yearOptions = ["2023", "2024", "2025"];
const sexOptions = ["Masculino", "Femenino"];
const creditTypeOptions = ["Consumo", "Hipotecario", "Vehicular", "Libre inversión"];
const cityOptions = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"];

interface MultiSelectProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}

function MultiSelect({ label, options, value, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allSelected = value.length === options.length && options.length > 0;

  const toggleAll = () => {
    onChange(allSelected ? [] : [...options]);
  };

  const toggleOne = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };

  const displayText =
    value.length === 0
      ? "Seleccionar..."
      : allSelected
        ? "Todos"
        : `${value.length} seleccionado${value.length > 1 ? "s" : ""}`;

  return (
    <div className={styles.filter} ref={ref}>
      <label className={styles.filterLabel}>{label}</label>
      <button className={styles.multiBtn} onClick={() => setOpen(!open)} type="button">
        <span className={styles.multiText}>{displayText}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className={styles.multiMenu}>
          <label className={styles.multiItem}>
            <input type="checkbox" checked={allSelected} onChange={toggleAll} />
            <span>Todos</span>
          </label>
          <div className={styles.multiDivider} />
          {options.map((opt) => (
            <label key={opt} className={styles.multiItem}>
              <input type="checkbox" checked={value.includes(opt)} onChange={() => toggleOne(opt)} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

interface DashboardFilters {
  date: string;
  month: string[];
  year: string[];
  sex: string[];
  creditType: string[];
  city: string[];
}

interface DashboardHeaderProps {
  onFiltersChange?: (filters: DashboardFilters) => void;
}

export default function DashboardHeader({ onFiltersChange }: DashboardHeaderProps) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [month, setMonth] = useState<string[]>([]);
  const [year, setYear] = useState<string[]>([]);
  const [sex, setSex] = useState<string[]>([]);
  const [creditType, setCreditType] = useState<string[]>([]);
  const [city, setCity] = useState<string[]>([]);

  useEffect(() => {
    onFiltersChange?.({ date, month, year, sex, creditType, city });
  }, [date, month, year, sex, creditType, city]);

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.filters}>
        <MultiSelect label="Mes" options={monthOptions} value={month} onChange={setMonth} />
        <MultiSelect label="Año" options={yearOptions} value={year} onChange={setYear} />
        <MultiSelect label="Sexo" options={sexOptions} value={sex} onChange={setSex} />
        <MultiSelect label="Tipo de crédito" options={creditTypeOptions} value={creditType} onChange={setCreditType} />
        <MultiSelect label="Ciudad" options={cityOptions} value={city} onChange={setCity} />
        <div className={styles.filter}>
          <label className={styles.filterLabel}>Fecha</label>
          <input
            type="date"
            className={styles.dateInput}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button className={styles.iconBtn} title="Notificaciones">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}
