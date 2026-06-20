import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const daysInMonth = (month, year) => {
  if (!month) return 30;
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31;
  if (month === 2) {
    const y = year || new Date().getFullYear();
    const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    return isLeap ? 29 : 28;
  }
  return 30;
};

const emptyEntry = () => ({ name: "", amount: "", date: "" });
const API = "http://localhost:5000/api";

function ExpenseTracker() {
  const navigate = useNavigate();
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year] = useState(now.getFullYear());
  const [budget, setBudget] = useState("");
  const [entries, setEntries] = useState([emptyEntry()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [insight, setInsight] = useState("");

  const days = daysInMonth(month, year);
  const totalSpent = entries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const moneyLeft = (parseFloat(budget) || 0) - totalSpent;

  // "Days left" is driven entirely by the latest date entered against any
  // entry — not today's real calendar date. If no entry has a date yet,
  // we show the full days-in-month as remaining.
  const entryDays = entries
    .map((e) => (e.date ? parseInt(e.date.split("-")[2], 10) : null))
    .filter((d) => d !== null && !isNaN(d));
  const latestDay = entryDays.length > 0 ? Math.max(...entryDays) : 0;
  const remainingDays = Math.max(days - latestDay, 1);
  const dailyBudgetLeft = remainingDays > 0 ? moneyLeft / remainingDays : moneyLeft;

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const fetchMonth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/expenses/${month}/${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.expense;
      if (data) {
        setBudget(String(data.budget ?? ""));
        setEntries(
          data.entries && data.entries.length > 0
            ? data.entries.map((e) => ({ name: e.name, amount: String(e.amount), date: e.date || "" }))
            : [emptyEntry()]
        );
      } else {
        setBudget("");
        setEntries([emptyEntry()]);
      }
      setInsight("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [month, year, token]);

  useEffect(() => {
    if (token) fetchMonth();
  }, [fetchMonth, token]);

  const persist = useCallback(
    async (entriesToSave, budgetToSave) => {
      try {
        const cleanEntries = entriesToSave
          .filter((e) => e.name.trim() !== "" && e.amount !== "")
          .map((e) => ({ name: e.name.trim(), amount: parseFloat(e.amount), date: e.date || "" }));

        await axios.post(
          `${API}/expenses`,
          {
            month,
            year,
            budget: parseFloat(budgetToSave) || 0,
            daysInMonth: days,
            entries: cleanEntries,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log(error);
      }
    },
    [month, year, days, token]
  );

  const handleEntryChange = (index, field, value) => {
    const next = [...entries];
    next[index][field] = value;
    setEntries(next);
  };

  const addEntry = () => setEntries([...entries, emptyEntry()]);

  // Deleting recalculates instantly (state updates trigger the derived totals above)
  // and also saves the new state to the backend automatically.
  const removeEntry = (index) => {
    const next = entries.filter((_, i) => i !== index);
    const finalEntries = next.length > 0 ? next : [emptyEntry()];
    setEntries(finalEntries);
    persist(finalEntries, budget);
  };

  const handleSave = async () => {
    setSaving(true);
    await persist(entries, budget);
    setSaving(false);
  };

  const handleGetInsight = () => {
    const validEntries = entries.filter((e) => e.name.trim() !== "" && e.amount !== "");
    const budgetNum = parseFloat(budget) || 0;

    if (validEntries.length === 0) {
      setInsight("Add a few expenses first and I'll find patterns for you.");
      return;
    }

    if (!budgetNum) {
      setInsight("Set a monthly budget above so I can tell you how you're tracking.");
      return;
    }

    const sorted = [...validEntries].sort(
      (a, b) => parseFloat(b.amount) - parseFloat(a.amount)
    );
    const biggest = sorted[0];
    const biggestShare = ((parseFloat(biggest.amount) / totalSpent) * 100).toFixed(0);
    const percentUsed = ((totalSpent / budgetNum) * 100).toFixed(0);
    const dailyText =
      moneyLeft >= 0
        ? `At this pace, you can spend about ${currency(dailyBudgetLeft)}/day for the rest of the month.`
        : `You're ${currency(Math.abs(moneyLeft))} over your budget already.`;

    const status =
      percentUsed >= 100
        ? `You've used ${percentUsed}% of your budget.`
        : percentUsed >= 75
        ? `You've used ${percentUsed}% of your budget — getting close to the limit.`
        : `You've used ${percentUsed}% of your budget so far, which is on track.`;

    setInsight(
      `${status} Your biggest expense is "${biggest.name}" at ${currency(
        parseFloat(biggest.amount)
      )} — that's ${biggestShare}% of everything you've spent this month. ${dailyText}`
    );
  };

  const currency = (n) =>
    `₹${(Number.isFinite(n) ? n : 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-[#F4F2EE]">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"
      />

      {/* Top bar */}
      <header className="border-b border-black/5 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1
            className="text-lg text-[#0F1B2D]"
            style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }}
          >
            BudgetBuddy
          </h1>
          <nav className="flex items-center gap-2 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            <Link
              to="/profile"
              className="px-3 py-1.5 rounded-md text-[#0F1B2D]/70 hover:bg-[#0F1B2D]/5 hover:text-[#0F1B2D] transition"
            >
              Profile
            </Link>
            <Link
              to="/logout"
              className="px-3 py-1.5 rounded-md text-[#0F1B2D]/70 hover:bg-[#0F1B2D]/5 hover:text-[#0F1B2D] transition"
            >
              Log out
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8" style={{ fontFamily: "Inter, sans-serif" }}>
        {/* Month + days row */}
        <div className="flex items-center justify-between mb-6">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="text-lg bg-transparent border-none outline-none cursor-pointer text-[#0F1B2D]"
            style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m} {year}
              </option>
            ))}
          </select>
          <span className="text-sm text-[#0F1B2D]/50">{days} days</span>
        </div>

        {loading ? (
          <p className="text-[#0F1B2D]/50 text-sm">Loading…</p>
        ) : (
          <div className="space-y-5">
            {/* Budget + summary in one calm row */}
            <div className="bg-white rounded-xl border border-black/5 p-5 grid grid-cols-3 divide-x divide-black/5">
              <div>
                <label className="block text-[11px] uppercase tracking-wide text-[#0F1B2D]/40 mb-1">
                  Budget
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[#0F1B2D]/30 text-sm">₹</span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    onBlur={() => persist(entries, budget)}
                    placeholder="0"
                    className="w-full outline-none bg-transparent text-[#0F1B2D] font-medium"
                  />
                </div>
              </div>
              <div className="pl-4">
                <label className="block text-[11px] uppercase tracking-wide text-[#0F1B2D]/40 mb-1">
                  Spent
                </label>
                <p className="font-medium text-[#0F1B2D]">{currency(totalSpent)}</p>
              </div>
              <div className="pl-4">
                <label className="block text-[11px] uppercase tracking-wide text-[#0F1B2D]/40 mb-1">
                  Left
                </label>
                <p className={`font-medium ${moneyLeft < 0 ? "text-[#B45309]" : "text-[#0E7C5A]"}`}>
                  {currency(moneyLeft)}
                </p>
              </div>
            </div>

            {/* Entries */}
            <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-black/5 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wide text-[#0F1B2D]/40">
                  Entries
                </span>
                <span className="text-[11px] text-[#0F1B2D]/30">{entries.length}</span>
              </div>

              <ol>
                {entries.map((entry, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 border-b border-black/5 last:border-b-0 group"
                  >
                    <span className="text-xs text-[#0F1B2D]/25 w-4 tabular-nums">{i + 1}</span>
                    <input
                      type="date"
                      value={entry.date}
                      onChange={(e) => handleEntryChange(i, "date", e.target.value)}
                      onBlur={() => persist(entries, budget)}
                      className="text-xs text-[#0F1B2D]/50 outline-none bg-transparent w-28"
                    />
                    <input
                      type="text"
                      value={entry.name}
                      onChange={(e) => handleEntryChange(i, "name", e.target.value)}
                      onBlur={() => persist(entries, budget)}
                      placeholder="What did you spend on?"
                      className="flex-1 outline-none bg-transparent text-sm text-[#0F1B2D] placeholder:text-[#0F1B2D]/30"
                    />
                    <div className="flex items-center gap-1 text-[#0F1B2D]/35">
                      <span className="text-xs">₹</span>
                      <input
                        type="number"
                        value={entry.amount}
                        onChange={(e) => handleEntryChange(i, "amount", e.target.value)}
                        onBlur={() => persist(entries, budget)}
                        placeholder="0"
                        className="w-16 text-right outline-none bg-transparent text-sm text-[#0F1B2D] tabular-nums"
                      />
                    </div>
                    <button
                      onClick={() => removeEntry(i)}
                      aria-label="Delete entry"
                      className="text-[#0F1B2D]/25 hover:text-[#B45309] transition opacity-0 group-hover:opacity-100 text-sm px-1"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ol>

              <button
                onClick={addEntry}
                className="w-full text-left px-4 py-2.5 text-xs text-[#0E7C5A] hover:bg-[#0E7C5A]/5 transition border-t border-black/5"
              >
                + Add entry manually
              </button>
            </div>

            {/* Daily budget left, subtle line not a big card */}
            <div className="flex items-center justify-between px-1 text-sm text-[#0F1B2D]/60">
              <span>
                {moneyLeft < 0 ? "Over budget" : `≈ ${currency(dailyBudgetLeft)}/day`} for {remainingDays}{" "}
                {remainingDays === 1 ? "day" : "days"} left
              </span>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-xs font-medium text-[#0F1B2D] hover:underline disabled:opacity-40"
              >
                {saving ? "Saving…" : "Save now"}
              </button>
            </div>

            {/* Spending insight - calculated locally, no API cost */}
            <div className="bg-[#0F1B2D] rounded-xl p-5 text-[#F4F2EE]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wide opacity-50">
                  Insight
                </span>
                <button
                  onClick={handleGetInsight}
                  className="text-xs font-medium opacity-80 hover:opacity-100 transition"
                >
                  {insight ? "Refresh" : "Analyze my spending"}
                </button>
              </div>
              <p className="text-sm leading-relaxed">
                {insight || "Tap analyze to get a quick read on this month's spending."}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ExpenseTracker;
