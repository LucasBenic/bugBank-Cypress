    import {faker} from '@faker-js/faker';

Cypress.Commands.add('getFakeUser', () => {
    const fullName = faker.person.fullName()
    const email = faker.internet.email({firstName: fullName.split(' ')[0], lastName: fullName.split(' ')[1]})

    const user = {
        fullName: fullName,
        email: email.toLocaleLowerCase(),
        password: faker.internet.password(),
    };
    return user;
});

Cypress.Commands.add('logo', () => {
    cy.get('img[src*="bugbank"]').should('be.visible');
});

Cypress.Commands.add('login', ({ email, password }) => {
    cy.get('.card__login').within(() => {
        if (email) {
            cy.get('input[type="email"]').type(email);
        }
        if (password) {
            cy.get('input[type="password"]').type(password, {log: false});
        }

        cy.contains('button', 'Acessar').click();
    });
});

Cypress.Commands.add('signup', ({ name, email, password, confirmation, balance = false }) => {  
    const signupForm = cy.get('.card__register');

    const fillInput = (inputName, value) => {
        if (value) {
            signupForm.within(() => {
                cy.get(`input[name="${inputName}"]`).clear({force: true}).type(value, { force: true, log: false});
            })
        }
    };

    fillInput('name', name);
    fillInput('email', email);
    fillInput('password', password);
    fillInput('passwordConfirmation', confirmation);
    console.log(balance);
    
    if (balance) {
        cy.get('#toggleAddBalance').click({ force: true});
    }

    signupForm.contains('button', 'Cadastrar').click({ force: true});
});

Cypress.Commands.add('getAccountNumber', () => {
    cy.contains(/A conta \d+-\d+ foi criada com sucess/).then(($p) => {
        const code = $p.text().match(/\d+-\d+/g)[0];
        return {
            number: code.split('-')[0],
            digit: code.split('-')[1]
        };
    });  
});

Cypress.Commands.add('validateLogin', ({ balance, fullName, number, digit }) => {
    cy.checkBalance(balance);
    cy.contains(`Olá ${fullName},`).should('be.visible');
    cy.contains('bem vindo ao BugBank :)').should('be.visible');
    cy.contains(`Conta digital: ${number}-${digit}`).should('be.visible');
  });
  
Cypress.Commands.add('transfer', ({accountNumber, accountDigit, value, description}) => {
    const fillInput = (inputName, value) => {
        if (value === undefined || value === null) {
            cy.log(`The value for ${inputName} is ${value}`);
        } else {
            cy.get(`input[name="${inputName}"]`).clear({force: true}).type(value, { force: true });
        }
    };

    fillInput('accountNumber', accountNumber);
    fillInput('digit', accountDigit);
    fillInput('transferValue', value);
    fillInput('description', description);

    cy.contains('button', 'Transferir agora').click({ force: true});
});

Cypress.Commands.add('formatBalance', (balance) => {
    const formattedBalance = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    }).format(balance);

    return formattedBalance;
});

Cypress.Commands.add('checkBalance', (balance) => {
    // Format the balance using Intl.NumberFormat
    const formattedBalance = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
      }).format(balance);

      cy.get('#textBalance')
        .invoke('text')
        .should('eq', `Saldo em conta ${formattedBalance}`);
}); 

Cypress.Commands.add('assertTransfer', ({message, home = true}) => {
    cy.contains(message).should('be.visible');
    cy.contains('a', 'Fechar').should('be.visible').click();
    if (home) {
        cy.contains('a', 'Voltar').should('be.visible').click();
    }
});

Cypress.Commands.add('goToTransfer', () => {
    cy.contains(`TRANSFERÊNCIA`).parent().click();
    cy.contains(`Realize transferência de valores entre contas BugBank com taxa 0 e em poucos segundos.`).should('be.visible');
});

Cypress.Commands.add('goToStatement', () => {
    cy.contains(`EXTRATO`).parent().click();
});

Cypress.Commands.add('statementBalance', ({balance}) => {
    cy.contains(`Saldo disponível`).parent().within(() => {
        cy.get('#textBalanceAvailable').invoke('text').then((valueOnStatement) => {
            expect(balance).to.eq(valueOnStatement);
        })
    })
})

Cypress.Commands.add('checkTransaction', ({ date, type, description, value }) => {
    cy.formatBalance(value).then((vformatBalance) => {
        // Check the type of transaction and adjust the selector accordingly
        const transactionSelector = (type !== 'Abertura de conta')
            ? '[class^="bank-statement__Transaction"]:last()'
            : '[class^="bank-statement__Transaction"]:first()';

        cy.get(transactionSelector).within(() => {
            // Assertions for transaction details
            cy.get('#textDateTransaction').invoke('text').should('eq', date);
            cy.get('#textTypeTransaction').invoke('text').should('eq', type);
            cy.get('#textDescription').invoke('text').should('eq', description);
            cy.get('#textTransferValue').then(($value) => {
                if (type === 'Transferência enviada') {
                    expect($value).to.have.css('color', 'rgb(255, 0, 0)');
                    expect($value.text()).to.eq(`-${vformatBalance}`)
                } else {
                    expect($value).to.have.css('color', 'rgb(0, 128, 0)');
                    expect($value.text()).to.eq(vformatBalance);
                }
            });
        });
    });
});

Cypress.Commands.add('getDate', () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
})


