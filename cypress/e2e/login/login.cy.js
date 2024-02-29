import { qase } from 'cypress-qase-reporter/dist/mocha'
describe('Exemplo', () => {

  const password = Cypress.env('PASS_BUG')
  qase(5, 
    it('Validate The Ability To Search For A Product', () => {
      cy.visit(process.env.ENVIRONMENT)
      cy.get('input[type="string"]').type('lprodocio22@gmail.com')
      cy.get('input[type="password"]').type(password, {log: false})
      cy.get('button:contains("Log in")').click()
      cy.contains('button', 'Home').should('exist')
    }))
})
