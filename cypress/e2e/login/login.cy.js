describe('Login Functionality', () => {
  let user;
  const pass = Cypress.env('password');

    const testCases = [
        { title: 'Successful Login', email: 'valid@email.com', password: pass, output: 'bem vindo ao BugBank :)' },
        { title: 'Missing Email', email: '', password: pass, output: 'É campo obrigatório' },
        { title: 'Missing Password', email: 'valid@email.com', password: '', output: 'É campo obrigatório' },
        { title: 'Missing Email and Password', email: '', password: '', output: 'É campo obrigatório' },
        { title: 'Unregistered Email', email: 'unregistered@email.com', password: pass, output: 'Usuário ou senha inválido. Tente novamente ou verifique suas informações!' },
        { title: 'Incorrect Password', email: 'valid@email.com', password: 'incorrectPassword', output: 'Usuário ou senha inválido. Tente novamente ou verifique suas informações!' },
      ];

      before(() => {
        cy.visit('')
        cy.contains('button', 'Registrar').click();

        cy.signup({
          name: 'Lucas',
          email: testCases[0].email,
          password: testCases[0].password,
          confirmation: testCases[0].password,
        });

        cy.getAllLocalStorage().then((ls) => {
          user = ls;
        });
      })
      

    beforeEach(() => {
      cy.visit('', {
        onBeforeLoad(win) {
          Object.entries(user).forEach(([key, value]) => {
            Object.keys(value).forEach((k) => {
              win.localStorage.setItem(k, value[k]);
            })
          });
        },
      })
      cy.contains('button', 'Acessar').should('be.visible');
    });
    
    testCases.forEach((test, index) => {
      it(`Should handle login scenario ${test.title}`, () => {
        cy.login({ email: test.email, password: test.password });

        if (index === 0) {
          cy.contains(test.output).should('be.visible');
        } else if (index > 0 && index < 3) {
          cy.contains(test.output).should('be.visible');
          cy.contains(testCases[0].output).should('not.exist');
        } else if (index > 3) {
            cy.get('[class*="ContainerContent"]').within(() => {
              cy.contains(test.output).should('be.visible');
              cy.contains('a', 'Fechar').should('be.visible').click();
              cy.contains(test.output).should('not.exist');
            });
            cy.contains('button', 'Acessar').should('exist');
          }
       });
    });

    it('Should be able to logout', () => {
      cy.login({ email: testCases[0].email, password: testCases[0].password });
      cy.contains('a', 'Sair').should('be.visible').click();

      cy.contains('button', 'Acessar').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
    });
});