class TransactionsWidget {
  
  constructor( element ) {
    if(element) {
      this.element = element;
    } else {
      throw new Error("Элемента нет")
    }
    this.registerEvents()
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const newIncomeBtn = document.querySelector('.create-income-button');
    const newExpenseBtn = document.querySelector('.create-expense-button');
    newIncomeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let newIncome = App.getModal('newIncome');
      newIncome.open();
    });
    newExpenseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let newExpense = App.getModal('newExpense');
      newExpense.open();
    });
  }
}
