describe('Registration', () => {
  const pass = Cypress.env('password');
  const testCases = [
    {
      title: 'Mandatory Fields',
      input: { name: '', email: '', password: '', confirmPassword: '' },
      output: 'É campo obrigatório',
    },
    {
      title: 'Registration without Name',
      input: { name: '', email: 'test@email.com', password: pass, confirmPassword: pass },
      output: 'Nome não pode ser vazio.',
    },
    {
      title: 'Registration without Email',
      input: { name: 'Test User', email: '', password: pass, confirmPassword: pass },
      output: 'É campo obrigatório',
    },
    {
      title: 'Registration without Password',
      input: { name: 'Test User', email: 'test@email.com', password: '', confirmPassword: pass },
      output: 'É campo obrigatório',
    },
    {
      title: 'Registration without Confirm Password',
      input: { name: 'Test User', email: 'test@email.com', password: pass, confirmPassword: '' },
      output: 'É campo obrigatório',
    },
    {
      title: 'Different Passwords',
      input: { name: 'Test User', email: 'test@email.com', password: pass, confirmPassword: 'differentPassword' },
      output: 'As senhas não são iguais.',
    },
  ];

  beforeEach(() => {
    cy.visit('')
    cy.contains('button', 'Registrar').click()
  })

  testCases.forEach((test) => {
    it(`Should handle registration scenario: ${test.title}`, () => {
     cy.signup({
      name: test.input.name, email: test.input.email, password: test.input.password, confirmation: test.input.confirmPassword
     })
     if (test.output === 'É campo obrigatório'){
        cy.contains(test.output).should('exist')
     } else {
        cy.get('[class*="ContainerContent"]').within(() => {
          cy.contains(test.output).should('be.visible');
          cy.contains('a', 'Fechar').should('be.visible').click();
          cy.contains(test.output).should('not.exist');
        })
      }
      cy.contains('button', 'Cadastrar').should('exist')
    });
  });

  it('Should be able to create account with balance', () => {
    cy.contains(`Criar conta com saldo ?`).should('exist');
    cy.getFakeUser().then((user) => {
      cy.signup({
        name: user.fullName,
        email: user.email,
        password: user.password,
        confirmation: user.password,
        balance: true,
      });
      cy.getAccountNumber().then((account) => {
        cy.contains('a', 'Fechar').should('be.visible').click();
        cy.login({ email: user.email, password: user.password });
        
        cy.validateLogin({
          balance: 1000,
          fullName: user.fullName,
          number: account.number,
          digit: account.digit,
        })
      })
    })
  });

  it('Should be able to create account with no balance', () => {
    cy.contains(`Criar conta com saldo ?`).should('exist');
    cy.getFakeUser().then((user) => {
      cy.signup({
        name: user.fullName,
        email: user.email,
        password: user.password,
        confirmation: user.password,
        balance: false,
      });
      cy.getAccountNumber().then((account) => {
        cy.contains('a', 'Fechar').should('be.visible').click();
        cy.login({ email: user.email, password: user.password });
        
        cy.validateLogin({
          balance: 0,
          fullName: user.fullName,
          number: account.number,
          digit: account.digit,
        })
      })
    })
  });
});
