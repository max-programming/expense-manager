import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  transactions,
} from "./transactions.js";

const transactionTableBody = document.querySelector("#transaction-table tbody");
const totalBalance = document.getElementById("total-balance");
const transactionForm = document.getElementById("transaction-form");
const editForm = document.getElementById("edit-form");
const editDialog = document.getElementById("edit-dialog");
const deleteDialog = document.getElementById("delete-dialog");
const deleteConfirmBtn = document.getElementById("delete-confirm");

let currentTransactionId = null;

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" });
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  style: "currency",
});

transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const { type, amount, description, date } = transactionForm;
  addTransaction(
    type.value,
    amount.valueAsNumber,
    description.value,
    date.valueAsDate ?? new Date()
  );
  renderTransactions();
  transactionForm.reset();
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const { type, amount, description, date } = editForm;
  updateTransaction(
    currentTransactionId,
    type.value,
    amount.valueAsNumber,
    description.value,
    date.valueAsDate ?? new Date()
  );
  renderTransactions();
  editForm.reset();
  editDialog.close();
});

deleteConfirmBtn.addEventListener("click", () => {
  deleteTransaction(currentTransactionId);
  renderTransactions();
  deleteDialog.close();
});

function renderTransactions() {
  transactionTableBody.innerHTML = "";
  transactions.forEach((transaction) => {
    const row = createTransactionRow(transaction);
    transactionTableBody.appendChild(row);
  });
  updateTotalBalance();
}

function createTransactionRow(transaction) {
  const row = document.createElement("tr");

  row.dataset.type = transaction.type;

  const typeCell = document.createElement("td");
  const amountCell = document.createElement("td");
  const descriptionCell = document.createElement("td");
  const dateCell = document.createElement("td");
  const actionCell = document.createElement("td");

  typeCell.textContent =
    transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
  amountCell.textContent = currencyFormatter.format(transaction.amount);
  descriptionCell.textContent = transaction.description;
  dateCell.textContent = dateFormatter.format(new Date(transaction.date));

  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  editButton.classList.add("btn", "edit");
  editButton.textContent = "Edit";
  editButton.onclick = () => openEditDialog(transaction);

  deleteButton.classList.add("btn", "delete");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = () => openDeleteDialog(transaction.id);

  actionCell.append(editButton, deleteButton);

  row.append(typeCell, amountCell, descriptionCell, dateCell, actionCell);

  return row;
}

function updateTotalBalance() {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((total, t) => total + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((total, t) => total + t.amount, 0);

  totalBalance.textContent = currencyFormatter.format(
    totalIncome - totalExpense
  );
}

function openDeleteDialog(transactionId) {
  currentTransactionId = transactionId;
  deleteDialog.showModal();
}

function openEditDialog(transaction) {
  currentTransactionId = transaction.id;
  editForm.type.value = transaction.type;
  editForm.amount.valueAsNumber = transaction.amount;
  editForm.description.value = transaction.description;
  editForm.date.valueAsDate = new Date(transaction.date);
  editDialog.showModal();
}

renderTransactions();
