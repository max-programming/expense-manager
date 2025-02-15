export const transactions =
  JSON.parse(localStorage.getItem("transactions")) ?? [];

export function addTransaction(type, amount, description, date) {
  const id = crypto.randomUUID();
  const transaction = { id, type, amount, description, date };
  transactions.unshift(transaction);
  updateLocalStorage();
}

export function deleteTransaction(id) {
  const index = transactions.findIndex((t) => t.id === id);
  transactions.splice(index, 1);
  updateLocalStorage();
}

export function updateTransaction(id, type, amount, description, date) {
  const index = transactions.findIndex((t) => t.id === id);
  const updatedTransaction = { id, type, amount, description, date };
  transactions[index] = updatedTransaction;
  updateLocalStorage();
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
