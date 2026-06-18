const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function fetchUsers() {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function fetchPayments() {
  const res = await fetch(`${API_URL}/payments`);
  if (!res.ok) throw new Error("Failed to fetch payments");
  return res.json();
}

export async function createUser(data: {
  email: string;
  password: string;
  fullName: string;
  role: string;
}) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

export async function fetchCreditsByMaturity(cutoffDate: string, creditType?: string, branch?: string, clientGroup?: string) {
  const params = new URLSearchParams({ cutoffDate });
  if (creditType) params.append("creditType", creditType);
  if (branch) params.append("branch", branch);
  if (clientGroup) params.append("clientGroup", clientGroup);

  const url = `${API_URL}/reports/credits-by-maturity?${params.toString()}`;
  console.log("[API] Fetching:", url);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error("[API] HTTP error:", res.status, text);
      throw new Error(`Failed to fetch credits by maturity: ${res.status}`);
    }
    return res.json();
  } catch (e: any) {
    console.error("[API] Network/fetch error:", e.message);
    throw e;
  }
}

export async function fetchLoanList(startDate: string, endDate: string, creditType?: string, branch?: string, clientGroup?: string) {
  const params = new URLSearchParams({ startDate, endDate });
  if (creditType) params.append("creditType", creditType);
  if (branch) params.append("branch", branch);
  if (clientGroup) params.append("clientGroup", clientGroup);

  const res = await fetch(`${API_URL}/reports/loan-list?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch loan list");
  return res.json();
}

export async function fetchPaymentsDetails(startDate: string, endDate: string, branch?: string) {
  const params = new URLSearchParams({ startDate, endDate });
  if (branch) params.append("branch", branch);

  const res = await fetch(`${API_URL}/reports/payments-details?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch payments details");
  return res.json();
}
