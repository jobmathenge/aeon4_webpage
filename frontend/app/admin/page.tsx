"use client";

import { useEffect, useState } from "react";
import { fetchLeadsAction, updateLeadStatusAction } from "./actions";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  facilityType: string | null;
  message: string;
  country: string | null;
  source: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [apiKey, setApiKey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Check if API key is stored in sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("aeon4_admin_key");
    if (stored) {
      setApiKey(stored);
      loadLeads(stored);
    }
  }, []);

  const loadLeads = async (key: string) => {
    setLoading(true);
    setError("");
    const res = await fetchLeadsAction(key);
    setLoading(false);

    if (res.success && res.leads) {
      setLeads(res.leads);
      setIsAuthorized(true);
      sessionStorage.setItem("aeon4_admin_key", key);
    } else {
      setError(res.error || "Failed to load enquiries. Please check your API key.");
      setIsAuthorized(false);
      sessionStorage.removeItem("aeon4_admin_key");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    loadLeads(apiKey.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem("aeon4_admin_key");
    setIsAuthorized(false);
    setLeads([]);
    setApiKey("");
    setError("");
  };

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    const res = await updateLeadStatusAction(leadId, newStatus, apiKey);
    if (res.success) {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
    } else {
      alert(`Error updating status: ${res.error}`);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(filteredLeads, null, 2);
    navigator.clipboard.writeText(dataStr);
    alert("Filtered enquiries copied to clipboard as JSON!");
  };

  // Get unique countries for filter dropdown
  const countries = Array.from(
    new Set(leads.map((l) => l.country).filter(Boolean))
  ) as string[];

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(search.toLowerCase())) ||
      lead.message.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    const matchesCountry =
      countryFilter === "all" || lead.country === countryFilter;

    return matchesSearch && matchesStatus && matchesCountry;
  });

  // Calculate statistics
  const statTotal = leads.length;
  const statNew = leads.filter((l) => l.status === "new").length;
  const statReviewed = leads.filter((l) => l.status === "reviewed").length;
  const statSpam = leads.filter((l) => l.status === "spam").length;

  if (!isAuthorized) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "var(--abyss)",
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            width: "100%",
            background: "rgba(10, 42, 68, 0.45)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            padding: "2.5rem 2rem",
            backdropFilter: "blur(16px)",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span
              style={{
                fontFamily: "var(--font-michroma), sans-serif",
                fontSize: "1.2rem",
                letterSpacing: "0.15em",
                color: "var(--foam)",
              }}
            >
              AeOn<b style={{ color: "var(--sonar)" }}>4</b>.AI
            </span>
            <p
              style={{
                color: "var(--mist)",
                fontSize: "0.85rem",
                marginTop: "0.5rem",
                fontFamily: "var(--font-plex-mono), monospace",
                letterSpacing: "0.08em",
              }}
            >
              SECURE OPERATIONAL CONSOLE
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label
                style={{
                  fontFamily: "var(--font-plex-mono), monospace",
                  fontSize: "0.66rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--mist)",
                }}
              >
                ADMIN ACCESS KEY
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter admin API key..."
                required
                style={{
                  width: "100%",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "0.95rem",
                  background: "rgba(6, 28, 46, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: "10px",
                  padding: "0.8rem 1rem",
                  color: "var(--foam)",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
            </div>

            {error && (
              <p
                style={{
                  color: "#f87171",
                  fontSize: "0.8rem",
                  textAlign: "center",
                  fontFamily: "var(--font-plex-mono), monospace",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(120deg, var(--sonar), var(--biolum))",
                color: "var(--abyss)",
                border: "none",
                borderRadius: "99px",
                padding: "0.9rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                fontFamily: "var(--font-plex-mono), monospace",
                letterSpacing: "0.08em",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "AUTHENTICATING..." : "AUTHORIZE ACCESS"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--abyss)",
        color: "var(--foam)",
        fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        padding: "6rem clamp(1rem, 4vw, 3rem) 4rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--hairline)",
            paddingBottom: "1.5rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-michroma), sans-serif",
                fontSize: "1.3rem",
                letterSpacing: "0.1em",
                color: "var(--foam)",
                margin: 0,
              }}
            >
              AeOn4 // <span style={{ color: "var(--sonar)" }}>Enquiries</span>
            </h1>
            <p
              style={{
                color: "var(--mist)",
                fontSize: "0.75rem",
                fontFamily: "var(--font-plex-mono), monospace",
                marginTop: "0.2rem",
              }}
            >
              OPERATIONAL LEADS & PILOT REQUEST DATABASE
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "var(--mist)",
              padding: "0.5rem 1rem",
              borderRadius: "99px",
              fontSize: "0.72rem",
              fontFamily: "var(--font-plex-mono), monospace",
              cursor: "pointer",
              transition: "color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--foam)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--mist)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            }}
          >
            DISCONNECT
          </button>
        </header>

        {/* Stats Section */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
            padding: 0,
          }}
        >
          <div
            style={{
              background: "rgba(10, 42, 68, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "1.2rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-plex-mono), monospace",
                fontSize: "0.64rem",
                color: "var(--mist)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Total Enquiries
            </span>
            <b style={{ display: "block", fontSize: "2rem", color: "var(--foam)", marginTop: "0.2rem" }}>
              {statTotal}
            </b>
          </div>
          <div
            style={{
              background: "rgba(10, 42, 68, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "1.2rem",
              borderLeft: "3px solid var(--beacon)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-plex-mono), monospace",
                fontSize: "0.64rem",
                color: "var(--mist)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              New Requests
            </span>
            <b style={{ display: "block", fontSize: "2rem", color: "var(--beacon)", marginTop: "0.2rem" }}>
              {statNew}
            </b>
          </div>
          <div
            style={{
              background: "rgba(10, 42, 68, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "1.2rem",
              borderLeft: "3px solid var(--biolum)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-plex-mono), monospace",
                fontSize: "0.64rem",
                color: "var(--mist)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Reviewed
            </span>
            <b style={{ display: "block", fontSize: "2rem", color: "var(--biolum)", marginTop: "0.2rem" }}>
              {statReviewed}
            </b>
          </div>
          <div
            style={{
              background: "rgba(10, 42, 68, 0.35)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "1.2rem",
              borderLeft: "3px solid #ef4444",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-plex-mono), monospace",
                fontSize: "0.64rem",
                color: "var(--mist)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Filtered Spam
            </span>
            <b style={{ display: "block", fontSize: "2rem", color: "#ef4444", marginTop: "0.2rem" }}>
              {statSpam}
            </b>
          </div>
        </section>

        {/* Filters and Controls */}
        <div
          style={{
            background: "rgba(10, 42, 68, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "16px",
            padding: "1.2rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", flex: 1 }}>
            {/* Search Input */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search enquiries..."
              style={{
                flex: "1 1 240px",
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "0.88rem",
                background: "rgba(6, 28, 46, 0.55)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                padding: "0.6rem 0.9rem",
                color: "var(--foam)",
                outline: "none",
              }}
            />

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "0.88rem",
                background: "rgba(6, 28, 46, 0.55)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                padding: "0.6rem 0.9rem",
                color: "var(--foam)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="spam">Spam</option>
            </select>

            {/* Country Filter */}
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "0.88rem",
                background: "rgba(6, 28, 46, 0.55)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                padding: "0.6rem 0.9rem",
                color: "var(--foam)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportJSON}
            disabled={filteredLeads.length === 0}
            style={{
              background: "none",
              border: "1px solid var(--hairline)",
              borderRadius: "10px",
              padding: "0.6rem 1rem",
              fontSize: "0.76rem",
              color: "var(--sonar)",
              fontFamily: "var(--font-plex-mono), monospace",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(34, 211, 238, 0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            EXPORT CURRENT ({filteredLeads.length})
          </button>
        </div>

        {/* Leads Table/List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--mist)", fontSize: "0.9rem" }}>
              Refreshing enquiries...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 0",
                color: "var(--mist)",
                fontSize: "0.9rem",
                background: "rgba(10, 42, 68, 0.15)",
                border: "1px dashed rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
              }}
            >
              No matching enquiries found.
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const isExpanded = expandedId === lead.id;
              const formattedDate = new Date(lead.createdAt).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              });

              return (
                <div
                  key={lead.id}
                  style={{
                    background: "rgba(10, 42, 68, 0.25)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "border-color 0.2s",
                  }}
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                    style={{
                      padding: "1.2rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "260px" }}>
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background:
                            lead.status === "new"
                              ? "var(--beacon)"
                              : lead.status === "reviewed"
                              ? "var(--biolum)"
                              : "#ef4444",
                        }}
                      />
                      <div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--foam)", margin: 0 }}>
                          {lead.name}
                        </h3>
                        <p style={{ fontSize: "0.78rem", color: "var(--mist)", margin: 0 }}>
                          {lead.email} {lead.company ? `· ${lead.company}` : ""}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontFamily: "var(--font-plex-mono), monospace",
                          color: "var(--mist)",
                        }}
                      >
                        {lead.country || "N/A"}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontFamily: "var(--font-plex-mono), monospace",
                          color: "var(--mist)",
                        }}
                      >
                        {formattedDate}
                      </span>
                      <span style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: "1.2rem",
                        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                        background: "rgba(6, 28, 46, 0.35)",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "1.2rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        <div>
                          <label style={{ fontSize: "0.64rem", color: "var(--mist)", textTransform: "uppercase" }}>
                            Facility Type
                          </label>
                          <p style={{ fontSize: "0.9rem", margin: 0, fontWeight: 500 }}>
                            {lead.facilityType || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <label style={{ fontSize: "0.64rem", color: "var(--mist)", textTransform: "uppercase" }}>
                            Source / Flow
                          </label>
                          <p style={{ fontSize: "0.9rem", margin: 0, fontWeight: 500 }}>
                            {lead.source}
                          </p>
                        </div>
                        <div>
                          <label style={{ fontSize: "0.64rem", color: "var(--mist)", textTransform: "uppercase" }}>
                            Lead Status
                          </label>
                          <span
                            style={{
                              display: "inline-block",
                              fontSize: "0.7rem",
                              fontFamily: "var(--font-plex-mono), monospace",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "4px",
                              marginTop: "0.2rem",
                              background:
                                lead.status === "new"
                                  ? "rgba(245, 165, 36, 0.15)"
                                  : lead.status === "reviewed"
                                  ? "rgba(63, 191, 168, 0.15)"
                                  : "rgba(239, 68, 68, 0.15)",
                              color:
                                lead.status === "new"
                                  ? "var(--beacon)"
                                  : lead.status === "reviewed"
                                  ? "var(--biolum)"
                                  : "#f87171",
                            }}
                          >
                            {lead.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ fontSize: "0.64rem", color: "var(--mist)", textTransform: "uppercase" }}>
                          Message
                        </label>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            lineHeight: "1.6",
                            color: "var(--foam)",
                            background: "rgba(3, 16, 29, 0.5)",
                            padding: "1rem",
                            borderRadius: "10px",
                            border: "1px solid rgba(255, 255, 255, 0.05)",
                            margin: "0.3rem 0 0",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {lead.message}
                        </p>
                      </div>

                      {/* Management Actions */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "1rem",
                        }}
                      >
                        <div style={{ display: "flex", gap: "0.6rem" }}>
                          <button
                            onClick={() => handleUpdateStatus(lead.id, "reviewed")}
                            disabled={lead.status === "reviewed"}
                            style={{
                              background: lead.status === "reviewed" ? "rgba(63, 191, 168, 0.08)" : "none",
                              border: "1px solid var(--biolum)",
                              borderRadius: "8px",
                              padding: "0.4rem 0.8rem",
                              fontSize: "0.72rem",
                              color: "var(--biolum)",
                              cursor: "pointer",
                              opacity: lead.status === "reviewed" ? 0.6 : 1,
                            }}
                          >
                            Mark Reviewed
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(lead.id, "spam")}
                            disabled={lead.status === "spam"}
                            style={{
                              background: lead.status === "spam" ? "rgba(239, 68, 68, 0.08)" : "none",
                              border: "1px solid #ef4444",
                              borderRadius: "8px",
                              padding: "0.4rem 0.8rem",
                              fontSize: "0.72rem",
                              color: "#f87171",
                              cursor: "pointer",
                              opacity: lead.status === "spam" ? 0.6 : 1,
                            }}
                          >
                            Mark Spam
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(lead.id, "new")}
                            disabled={lead.status === "new"}
                            style={{
                              background: lead.status === "new" ? "rgba(245, 165, 36, 0.08)" : "none",
                              border: "1px solid var(--beacon)",
                              borderRadius: "8px",
                              padding: "0.4rem 0.8rem",
                              fontSize: "0.72rem",
                              color: "var(--beacon)",
                              cursor: "pointer",
                              opacity: lead.status === "new" ? 0.6 : 1,
                            }}
                          >
                            Restore New
                          </button>
                        </div>

                        <a
                          href={`mailto:${lead.email}?subject=AeOn4.AI Pilot Request Inquiry`}
                          style={{
                            background: "linear-gradient(120deg, var(--sonar), var(--biolum))",
                            color: "var(--abyss)",
                            borderRadius: "8px",
                            padding: "0.4rem 1rem",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            fontFamily: "var(--font-plex-mono), monospace",
                          }}
                        >
                          REPLY VIA EMAIL
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
