

describe('Requirement', () => {
  let reqTitle = ['Login', 'Cadastro', 'Transferência', 'Pagamento', 'Extrato', 'Saque'];
  let requirements;

  before(() => {
    // Load fixture data before tests
    cy.fixture('requirements').then((req) => {
      requirements = req;
    });
  });

  beforeEach(() => {
    cy.visit('');
    cy.contains('a', 'Conheça nossos requisitos').click();
  });

  reqTitle.forEach((title, index) => {
    it(`Should be able to see the ${title} Requirements`, () => {
      cy.get('[id^=accordion]').contains(title).click();
      requirements[index].description.forEach((desc) => {
        cy.contains(desc);
      });
    });
  });

  it('Should be able to get back to the home page', () => {
    const backToHome = ['logo', 'Voltar'];

    backToHome.forEach((option, index) => {
      if (index === 1) {
        cy.contains('a', 'Conheça nossos requisitos').click();
      }
      cy.contains('a', 'Acesse o link do repositório clicando aqui').should('have.attr', 'href', 'https://github.com/jhonatasmatos/bugbank')
      cy.contains('Gostou do projeto e quer contribuir?').should('be.visible')
      cy.contains('A aplicação não conta com um banco de dados, todas as informações são armazenadas em memória local').should('be.visible')
      
      if (option === 'logo') {
        cy.logo().click();
      } else {
        cy.contains('a', option).click();
      }

      cy.url().should('eq', Cypress.config().baseUrl);
      cy.contains('a', 'Conheça nossos requisitos').should('be.visible');
    });
  });
});
