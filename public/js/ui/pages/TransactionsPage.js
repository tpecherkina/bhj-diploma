class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  
  constructor( element ) {
    if(element) {
      this.element = element;
    } else {
      throw new Error("Элемент не существует!");
    }
    this.registerEvents();
  }

  /** 
   * Вызывает метод render для отрисовки страницы
   * */ 
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  
  registerEvents() {
    let context = this;
    const removeAcc = document.getElementsByClassName("remove-account")[0];
    removeAcc.onclick = function(e) {
      e.preventDefault();
      context.removeAccount();
    };
    this.element.addEventListener("click", (e) => {
      const removeTrans = e.target.closest('.transaction__remove');
      if(removeTrans) {
        this.removeTransaction(removeTrans.dataset.id)
      }
    })
  
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */

   removeAccount() {
    if (!this.lastOptions) {
      return;
    }
    if (confirm('Вы действительно хотите удалить счет?')) {
      Account.remove({id: this.lastOptions.account_id}, (err, response) => {
        if (response && response.success) {
          App.update();
        }
      });
      this.clear();
    } else {
      return;
    }
  }


  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  
  removeTransaction( id ) {
    if(confirm("Вы действительно хотите удалить транзакцию?")) {
     Transaction.remove({id}, (error, response) => {
       if(response.success) {
       App.update();
       }
     })
  }}

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  
   render(options){
    if (!options) {
      return;
    }
    this.lastOptions = options;
    Account.get(options.account_id, (err, response) => {
      if (response && response.success) {
        this.renderTitle(response.data.name);
      }
    });
    Transaction.list(options, (err, response) => {
      if (response && response.success) {
        this.renderTransactions(response.data);
      } else {
        return;
      }
    });
  }


  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
   clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счета');
    this.lastOptions = null;
  }

/**
   * Устанавливает заголовок в элемент .content-title
   * */
 renderTitle(name){
  document.querySelector('.content-title').textContent = name;
}

/**
 * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
 * в формат «10 марта 2019 г. в 03:20»
 * */
 formatDate(date){
  let newDate = new Date(date),
  day = newDate.getDate(),
  year = newDate.getFullYear(),
  months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
  ],
  month = months[newDate.getMonth()],
  hours = newDate.getHours(),
  minutes = newDate.getMinutes(),
  formatNewDate = day + '' + month + '' + year + ' г. в ' + hours + ':' + minutes;
  return formatNewDate;
}
 /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  
  getTransactionHTML(item){
   return `<div class="transaction transaction_${item.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
              <!-- дата -->
              <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
          ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <!-- в data-id нужно поместить id -->
            <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                <i class="fa fa-trash"></i>  
            </button>
        </div>
    </div>`

  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  
  renderTransactions(data){
    this.element.querySelector(".content").innerHTML = '';
    data.forEach(item => this.element.querySelector('.content').innerHTML += this.getTransactionHTML(item));
  }
} 
