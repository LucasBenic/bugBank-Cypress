describe('Transfer Functionality', () => {
  let users;
  const pass = Cypress.env('PASS_BUG');
  const accounts = [
    { name: 'lucas teste', email: 'lucas@email.com', password: pass, confirmation: pass, balance: true },
    { name: 'roberto teste', email: 'roberto@email.com', password: pass, confirmation: pass, balance: false },
    { name: 'benicio teste', email: 'benicio@email.com', password: pass, confirmation: pass, balance: false },
  ]

  before(() => {
    cy.visit('')
    accounts.forEach((account) => {
      cy.contains('button', 'Registrar').click();
      cy.signup(account);
      cy.getAccountNumber().then((acc) => {
        account.number = acc.number;
        account.digit = acc.digit;
      })
      cy.contains('a', 'Fechar').should('be.visible').click();
      cy.reload()
    })
    cy.getAllLocalStorage().then((ls) => {
      users = ls;
    });
  })

  beforeEach(() => {
    cy.visit('', {
      onBeforeLoad(win) {
        Object.entries(users).forEach(([key, value]) => {
          Object.keys(value).forEach((k) => {
            win.localStorage.setItem(k, value[k]);
          })
        });
      },
    })
  });

  it(`Transfer to a Valid Account with Sufficient Balance:`, () => {
    const initialBalance = 1000;
    const accountNumber = accounts[1].number;
    const accountDigit = accounts[1].digit;
    const value = Math.floor(Math.random() * 1000) + 1;
    const description = 'Testing transfer functionality';

    cy.login({ email: accounts[0].email, password: accounts[0].password });
    cy.validateLogin({
      balance: initialBalance,
      fullName: accounts[0].name,
      number: accounts[0].number,
      digit: accounts[0].digit,
    })
    cy.goToTransfer();

    cy.transfer({ accountNumber, accountDigit, value, description });

    cy.assertTransfer({message: 'Transferencia realizada com sucesso'});
    cy.checkBalance(initialBalance-value);
    
    cy.contains('a', 'Sair').should('be.visible').click();
    cy.login({ email: accounts[1].email, password: accounts[1].password });
    cy.checkBalance(value);

  })
  
  it('Transfer to a Valid Account with Insufficient Balance', () => {
    const initialBalance = 1000;
    const accountNumber = accounts[1].number;
    const accountDigit = accounts[1].digit;
    const value = Cypress._.random(1001, Number.MAX_SAFE_INTEGER)
    const description = 'Testing transfer functionality';

    cy.login({ email: accounts[0].email, password: accounts[0].password });
    cy.validateLogin({
      balance: initialBalance,
      fullName: accounts[0].name,
      number: accounts[0].number,
      digit: accounts[0].digit,
    })
    cy.goToTransfer();

    cy.transfer({ accountNumber, accountDigit, value, description });
    cy.assertTransfer({message: 'Você não tem saldo suficiente para essa transação'});
    cy.checkBalance(initialBalance);
  })

  it('Transfer to an Invalid Account', () => { 
    const initialBalance = 1000;
    const accountNumber = [111, 4323, `jdjf`, `...`, 9348934894, 0, -1, -1000, -100000000000000]
    const accountDigit = Cypress._.random(0, 9);
    const value = Cypress._.random(1, 1000);
    const description = 'Testing transfer functionality';

    cy.login({ email: accounts[0].email, password: accounts[0].password });
    cy.validateLogin({
      balance: initialBalance,
      fullName: accounts[0].name,
      number: accounts[0].number,
      digit: accounts[0].digit,
    })
    cy.goToTransfer();

    accountNumber.forEach((accountNumber) => {
      cy.transfer({ accountNumber, accountDigit, value, description });
      cy.assertTransfer({message: 'Conta inválida ou inexistente', home: false});
    })

    cy.contains('a', 'Voltar').should('be.visible').click();
    cy.checkBalance(initialBalance);
  })

  it('Transfer with Zero or Negative Balance', () => { 
    const initialBalance = 0;
    const accountNumber = accounts[0].number;
    const accountDigit = accounts[0].digit;
    const value = Cypress._.random(1, 1000);
    const description = 'Testing transfer functionality';

    cy.login({ email: accounts[1].email, password: accounts[1].password });
    cy.validateLogin({
      balance: initialBalance,
      fullName: accounts[1].name,
      number: accounts[1].number,
      digit: accounts[1].digit,
    })
    cy.goToTransfer();

    cy.transfer({ accountNumber, accountDigit, value, description });
    cy.assertTransfer({message: 'Você não tem saldo suficiente para essa transação'});
    cy.checkBalance(initialBalance);
  })

  it('Number and Account Digits Should Only Accept Integer', () => {
    const initialBalance = 1000;
    const accountNumber = `jdjf`;
    const accountDigit = `lu`;
    const value = Cypress._.random(1, 1000);
    const description = 'Testing transfer functionality';

    cy.login({ email: accounts[0].email, password: accounts[0].password });
    cy.validateLogin({
      balance: initialBalance,
      fullName: accounts[0].name,
      number: accounts[0].number,
      digit: accounts[0].digit,
    })
    cy.goToTransfer();

    cy.get(`input[name="accountNumber"]`).as(`account`).type(accountNumber);
    cy.get(`input[name="digit"]`).as(`digit`).type(accountDigit);

    cy.get(`@account`).should('have.value', ``)
    cy.get(`@digit`).should('have.value', ``)
  })

  it('Successful Transfer with Minimum Valid Input', () => {
    const initialBalance = 1000;
    const accountNumber = accounts[1].number;
    const accountDigit = accounts[1].digit;
    const value = 0.1;
    const description = 'Testing transfer functionality';

    cy.login({ email: accounts[0].email, password: accounts[0].password });
    cy.validateLogin({
      balance: initialBalance,
      fullName: accounts[0].name,
      number: accounts[0].number,
      digit: accounts[0].digit,
    })
    cy.goToTransfer();

    cy.transfer({ accountNumber, accountDigit, value, description });
    cy.assertTransfer({message: 'Transferencia realizada com sucesso'});

    cy.checkBalance(initialBalance-value);
    
    cy.contains('a', 'Sair').should('be.visible').click();
    cy.login({ email: accounts[1].email, password: accounts[1].password });
    cy.checkBalance(value);
  })

  it(`Attempt to Transfer to an Account with a Missing Digit`, () => {
    const initialBalance = 1000;
    const accountNumber = accounts[1].number;
    const value = Cypress._.random(1, 1000);
    const description = 'Testing transfer functionality';

    cy.login({ email: accounts[0].email, password: accounts[0].password });
    cy.validateLogin({
      balance: initialBalance,
      fullName: accounts[0].name,
      number: accounts[0].number,
      digit: accounts[0].digit,
    })
    cy.goToTransfer();

    cy.transfer({ accountNumber, value, description });
    cy.assertTransfer({message: 'Conta inválida ou inexistente'});

    cy.checkBalance(initialBalance);
  })

  it(`Attempt to Transfer to an Account with a Missing Number`, () => {
    const initialBalance = 1000;
    const accountDigit = accounts[1].digit;
    const value = Cypress._.random(1, 1000);
    const description = 'Testing transfer functionality';

    cy.login({ email: accounts[0].email, password: accounts[0].password });
    cy.validateLogin({
      balance: initialBalance,
      fullName: accounts[0].name,
      number: accounts[0].number,
      digit: accounts[0].digit,
    })
    cy.goToTransfer();

    cy.transfer({ accountDigit, value, description });
    cy.assertTransfer({message: 'Conta inválida ou inexistente'});

    cy.checkBalance(initialBalance);
  })

  it('Attempt to Transfer with a 0 and negative Value', () => {
    const initialBalance = 1000;
    const accountNumber = accounts[1].number;
    const accountDigit = accounts[1].digit;
    const values = [0, -1, -1000, -100000000000000]
    const description = 'Testing transfer functionality';

    cy.login({ email: accounts[0].email, password: accounts[0].password });
    cy.validateLogin({
      balance: initialBalance,
      fullName: accounts[0].name,
      number: accounts[0].number,
      digit: accounts[0].digit,
    })
    cy.goToTransfer();

    values.forEach((value) => {
      cy.transfer({ accountNumber, accountDigit, value, description });
      cy.assertTransfer({message: 'Valor da transferência não pode ser 0 ou negativo', home: false});
    })

    cy.contains('a', 'Voltar').should('be.visible').click();
    cy.checkBalance(initialBalance);
  })

  it('Attempt to Transfer value to My Own Account', () => {
    const initialBalance = 1000;
    const accountNumber = accounts[0].number;
    const accountDigit = accounts[0].digit;
    const value = Cypress._.random(1, 1000);
    const description = 'Testing transfer functionality';

    cy.login({ email: accounts[0].email, password: accounts[0].password });
    cy.validateLogin({
      balance: initialBalance,
      fullName: accounts[0].name,
      number: accounts[0].number,
      digit: accounts[0].digit,
    })
    cy.goToTransfer();
    
    cy.transfer({ accountNumber, accountDigit, value, description });
    cy.assertTransfer({message: 'Nao pode transferir pra mesmo conta'});
    cy.logo().click()

    cy.checkBalance(initialBalance);
  })
});