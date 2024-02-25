import { qase } from 'cypress-qase-reporter/dist/mocha'
describe('Exemplo', () => {
  qase(5, 
    it('Validate The Ability To Search For A Product', () => {
      cy.visit('www.google.com')
      cy.get('input')
    }))
})
