describe('Statement Functionality', () => {
let users;
const pass = Cypress.env('PASS_BUG');

	const accounts = [
		{ name: 'lucas teste', email: 'lucas@email.com', password: pass, confirmation: pass, balance: true },
		{ name: 'roberto teste', email: 'roberto@email.com', password: pass, confirmation: pass, balance: false },
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

	it('Should Display the Available Balance', () => {
		const initialBalance = 1000;
		cy.login({ email: accounts[0].email, password: accounts[0].password });
		cy.validateLogin({
			balance: initialBalance,
			fullName: accounts[0].name,
			number: accounts[0].number,
			digit: accounts[0].digit,
		})

		cy.get('#textBalance').find('span').invoke('text').then((balance) => {
			cy.goToStatement();
			cy.statementBalance({balance})
		})
	})

	it('Should Display the Transaction Details', () => {
		const initialBalance = 1000;
		cy.login({ email: accounts[0].email, password: accounts[0].password });
		cy.validateLogin({
			balance: initialBalance,
			fullName: accounts[0].name,
			number: accounts[0].number,
			digit: accounts[0].digit,
		})

		cy.getDate().then((date) => {
			cy.goToStatement();
			cy.checkTransaction({date, type: 'Abertura de conta', description: 'Saldo adicionado ao abrir conta',  value: initialBalance})
		})
	})

	it('Outgoing Transaction Display', () => {
		const initialBalance = 1000;
		const transferValue = Cypress._.random(10, 1000);
		const accountNumber = accounts[1].number;
		const accountDigit = accounts[1].digit;
		const description = 'Testing';

		cy.login({ email: accounts[0].email, password: accounts[0].password });
		cy.validateLogin({
			balance: initialBalance,
			fullName: accounts[0].name,
			number: accounts[0].number,
			digit: accounts[0].digit,
		})

		cy.getDate().then((date) => {
			cy.goToTransfer();
			cy.transfer({accountNumber, accountDigit, value: transferValue, description});
			cy.assertTransfer({message: 'Transferencia realizada com sucesso'});
			cy.goToStatement();
			cy.checkTransaction({date, type: 'Transferência enviada', description, value: transferValue})
		})
	})

	it('Incoming Transaction Display', () => {
		const initialBalance = 1000;
		const transferValue = Cypress._.random(10, 1000);
		const accountNumber = accounts[1].number;
		const accountDigit = accounts[1].digit;
		const description = 'Testing';

		cy.login({ email: accounts[0].email, password: accounts[0].password });
		cy.validateLogin({
			balance: initialBalance,
			fullName: accounts[0].name,
			number: accounts[0].number,
			digit: accounts[0].digit,
		})
		cy.goToTransfer();
		cy.transfer({accountNumber, accountDigit, value: transferValue, description});
		cy.assertTransfer({message: 'Transferencia realizada com sucesso'});
		cy.contains('a', 'Sair').should('be.visible').click();

		cy.login({ email: accounts[1].email, password: accounts[1].password });
		cy.getDate().then((date) => {
			cy.goToStatement();
			cy.checkTransaction({date, type: 'Transferência recebida', description, value: transferValue})
		})
	})

	it('Transaction without Comment', () => {
		const initialBalance = 1000;
		const transferValue = Cypress._.random(10, 1000);
		const accountNumber = accounts[1].number;
		const accountDigit = accounts[1].digit;

		cy.login({ email: accounts[0].email, password: accounts[0].password });
		cy.validateLogin({
			balance: initialBalance,
			fullName: accounts[0].name,
			number: accounts[0].number,
			digit: accounts[0].digit,
		})
		cy.goToTransfer();
		cy.transfer({accountNumber, accountDigit, value: transferValue});
		cy.assertTransfer({message: 'Transferencia realizada com sucesso'});
		cy.goToStatement();
		cy.getDate().then((date) => {
			cy.checkTransaction({date, type: 'Transferência enviada', description: '-', value: transferValue})
			cy.contains('a', 'Sair').should('be.visible').click();

			cy.login({ email: accounts[1].email, password: accounts[1].password });
			cy.goToStatement();
			cy.checkTransaction({date, type: 'Transferência recebida', description: '-', value: transferValue})
		})
	})
})

