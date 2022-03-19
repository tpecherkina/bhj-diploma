/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {

  constructor( element ) {
     if(element) {
        this.element = element;
        this.registerEvents();
        this.update()
     } else {
       throw new Error(error);
     }
  }
  
  registerEvents() {
    const createAccount = this.element.querySelector('.create-account');
    createAccount.addEventListener('click', (e) => {
      e.preventDefault();
      let newAccount = App.getModal('createAccount');
      newAccount.open();
    });
    this.element.addEventListener('click', (e) => {
      let item = e.target;
      if (item.closest('.account')) {
        this.onSelectAccount(item.closest('.account'));
      }
    });
  }


update() {
    if(User.current()) {
      Account.list(User.current(), (err, response) => {
        if(response.success){
          this.clear();
           response.data.forEach(account => this.renderItem(account))
    }
  })
}
  }


  clear() {
    const accountArr = this.element.querySelectorAll('.account');
    accountArr.forEach(item => item.remove());
  }

 
  onSelectAccount( element ) {
    if (this.currentAccountId) {
      let account = this.element.querySelector(`.account[data-id="${this.currentAccountId}"]`);
      if (account) {
        account.classList.remove('active');
      } else {
        this.currentAccountId = null;
      }
    }
    element.classList.add('active');
    this.currentAccountId = element.dataset.id;
    App.showPage('transactions', {account_id: this.currentAccountId});
  }


  getAccountHTML(item){
    return`
        <li class="account" data-id="${item.id}">
            <a href="#">
            <span>${item.name}</span> /
            <span>${item.sum} ₽</span>
             </a>
        </li>
    `;
  }

  
  renderItem(data){
    let accountHTML = this.getAccountHTML(data);
    this.element.insertAdjacentHTML('beforeEnd', accountHTML);
  }
}
