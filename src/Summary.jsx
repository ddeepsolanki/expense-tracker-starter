import { formatCurrency } from './format';

function Summary({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <section className="balance-slip" aria-labelledby="balance-label">
      <div className="balance-main">
        <p id="balance-label" className="balance-label">Balance</p>
        <p className="balance-amount">{formatCurrency(balance)}</p>
      </div>
      <dl className="balance-breakdown">
        <div>
          <dt>Income</dt>
          <dd className="amount-income">+{formatCurrency(totalIncome)}</dd>
        </div>
        <div>
          <dt>Expenses</dt>
          <dd className="amount-expense">−{formatCurrency(totalExpenses)}</dd>
        </div>
      </dl>
    </section>
  );
}

export default Summary
