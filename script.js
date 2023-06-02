// Function to format currency
function formatCurrency(amount) {
  return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}

// Function to calculate and update the balance
function updateBalance(transactions) {
  const balanceAmount = document.getElementById('balance-amount');
  const total = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      return acc + transaction.amount;
    } else {
      return acc - transaction.amount;
    }
  }, 0);
  balanceAmount.textContent = formatCurrency(total);
}

// Function to render transactions
function renderTransactions(transactions) {
  const transactionsList = document.getElementById('transactions');
  transactionsList.innerHTML = '';

  transactions.forEach((transaction, index) => {
    const li = document.createElement('li');
    const type = transaction.type === 'income' ? '+' : '-';
    li.innerHTML = `
        <span>${transaction.description}</span>
        ${type}${formatCurrency(transaction.amount)}</span>
        <button class="delete-btn" data-index="${index}">Delete</button>
        <button class="edit-btn" data-index="${index}">Edit</button>
  
      `;
    transactionsList.appendChild(li);
  });

  const editButtons = document.getElementsByClassName('edit-btn');
  Array.from(editButtons).forEach((button) => {
    button.addEventListener('click', function () {
      const index = this.getAttribute('data-index');
      const transaction = transactions[index];

      // Create a form for editing the transaction
      const editForm = document.createElement('form');

      // Create input fields for description, amount, and type
      const descriptionInput = document.createElement('input');
      descriptionInput.type = 'text';
      descriptionInput.value = transaction.description;
      editForm.appendChild(descriptionInput);

      const amountInput = document.createElement('input');
      amountInput.type = 'number';
      amountInput.value = transaction.amount;
      editForm.appendChild(amountInput);

      const typeInput = document.createElement('select');
      const incomeOption = document.createElement('option');
      incomeOption.value = 'income';
      incomeOption.text = 'Income';
      const expenseOption = document.createElement('option');
      expenseOption.value = 'expense';
      expenseOption.text = 'Expense';
      typeInput.add(incomeOption);
      typeInput.add(expenseOption);
      typeInput.value = transaction.type;
      editForm.appendChild(typeInput);

      // Create a save button
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save';
      editForm.appendChild(saveButton);

      // Handle form submission for editing the transaction
      editForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Update the transaction object with the edited values
        transaction.description = descriptionInput.value.trim();
        transaction.amount = parseFloat(amountInput.value.trim());
        transaction.type = typeInput.value;

        renderTransactions(transactions);
        updateBalance(transactions);
      });

      const li = this.parentNode;
      li.innerHTML = '';
      li.appendChild(editForm);
    });
  });

  // Add event listeners to delete buttons
  const deleteButtons = document.getElementsByClassName('delete-btn');
  Array.from(deleteButtons).forEach((button) => {
    button.addEventListener('click', function () {
      const index = this.getAttribute('data-index');
      transactions.splice(index, 1);
      renderTransactions(transactions);
      updateBalance(transactions);
    });
  });
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  const descriptionInput = document.getElementById('description');
  const amountInput = document.getElementById('amount');
  const typeInput = document.getElementById('type');

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const type = typeInput.value;

  if (description === '' || isNaN(amount)) {
    return;
  }

  const transaction = {
    description,
    amount,
    type,
  };

  transactions.push(transaction);
  descriptionInput.value = '';
  amountInput.value = '';
  typeInput.value = 'income';

  renderTransactions(transactions);
  updateBalance(transactions);
}

let transactions = [];

// Add event listener to the form submit event
const transactionForm = document.getElementById('transaction-form');
transactionForm.addEventListener('submit', handleFormSubmit);
