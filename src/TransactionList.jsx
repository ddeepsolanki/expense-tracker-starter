import { useState } from 'react'
import { formatCategory, formatCurrency, formatDate } from './format';

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expenses" },
];

function TransactionList({ transactions, categories, onDelete }) {
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Register order: oldest first, with the balance after each entry, like a check register.
  const register = [...transactions].sort(
    (a, b) => a.date.localeCompare(b.date) || a.id - b.id
  );
  let running = 0;
  const balanceAfter = new Map();
  for (const t of register) {
    running += t.type === "income" ? t.amount : -t.amount;
    balanceAfter.set(t.id, running);
  }

  const filteredTransactions = register.filter(t =>
    (filterType === "all" || t.type === filterType) &&
    (filterCategory === "all" || t.category === filterCategory)
  );

  const handleDelete = (t) => {
    if (window.confirm(`Delete "${t.description}" (${formatCurrency(t.amount)})?`)) {
      onDelete(t.id);
    }
  };

  const clearFilters = () => {
    setFilterType("all");
    setFilterCategory("all");
  };

  return (
    <section className="register" aria-labelledby="register-heading">
      <div className="section-header">
        <h2 id="register-heading">Transactions</h2>
        <div className="filters">
          <div className="segmented" role="group" aria-label="Filter by type">
            {TYPE_FILTERS.map(f => (
              <button
                key={f.value}
                type="button"
                aria-pressed={filterType === f.value}
                onClick={() => setFilterType(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            aria-label="Filter by category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{formatCategory(cat)}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="register-empty">
          {transactions.length === 0 ? (
            <p>No transactions yet. Add your first one above.</p>
          ) : (
            <>
              <p>No transactions match these filters.</p>
              <button type="button" className="button-quiet" onClick={clearFilters}>
                Clear filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="register-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Description</th>
                <th scope="col" className="col-category">Category</th>
                <th scope="col" className="num">Amount</th>
                <th scope="col" className="num col-balance">Balance</th>
                <th scope="col"><span className="visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t.id}>
                  <td className="cell-date">{formatDate(t.date)}</td>
                  <td className="cell-description">{t.description}</td>
                  <td className="col-category"><span className="category-tag">{formatCategory(t.category)}</span></td>
                  <td className={`num ${t.type === "income" ? "amount-income" : "amount-expense"}`}>
                    {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                  </td>
                  <td className="num cell-balance col-balance">{formatCurrency(balanceAfter.get(t.id))}</td>
                  <td className="cell-action">
                    <button
                      type="button"
                      className="delete-btn"
                      aria-label={`Delete ${t.description}`}
                      onClick={() => handleDelete(t)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default TransactionList
