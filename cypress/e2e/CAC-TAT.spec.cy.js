/// <reference types="cypress" />

describe('Central de atendimento ao cliente TAT', () => {
  const THREE_SECONDS_IN_MS = 3000
  beforeEach(() => {
    cy.visit('./src/index.html')
  })
  it('Verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })
  it('preenche os campos obrigatórios e envia o formulário', () => {
    const longText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s'
    
    cy.clock()

    cy.get('#firstName').type('Edna').should('have.value', 'Edna')
    cy.get('#lastName').type('Barboza').should('have.value', 'Barboza')
    cy.get('#email').type('edna@e.com').should('have.value', 'edna@e.com')
    cy.get('#phone').type('12345').should('have.value', '12345')
    cy.get('#open-text-area').type(longText, {delay:0}).should('have.value', longText)
    cy.get('button[type="submit"]').click()
    cy.get('.success').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.success').should('not.be.visible')
  }) 
  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.clock()
    cy.get('#firstName').type('Edna')
    cy.get('#lastName').type('Barboza')
    cy.get('#email').type('edna@e,com')
    cy.get('#phone').type('12345')
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('not.be.visible')    
  })
  it('se um valor não-numérico for digitado, no campo de telefone, o mesmo ficará vazio', () => {
    cy.get('#phone').type('abcdefghij').should('have.value', '')
  })
  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido', () => {
    cy.clock()
    cy.get('#firstName').type('Edna')
    cy.get('#lastName').type('Barboza')
    cy.get('#email').type('edna@e.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')  
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('not.be.visible')
  })
  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName').type('Edna').should('have.value', 'Edna').clear().should('have.value', '')
    cy.get('#lastName').type('Barboza').should('have.value', 'Barboza').clear().should('have.value', '')
    cy.get('#email').type('edna@e.com').should('have.value', 'edna@e.com').clear().should('have.value', '')
    cy.get('#phone').type('12345').should('have.value', '12345').clear().should('have.value', '')
  })
  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.clock()
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.error').should('not.be.visible')
  })
  //comando customizado com cypress, presente no arquivo commands.js
  it('envia o formuário com sucesso usando um comando customizado', () => {
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')
    cy.tick(THREE_SECONDS_IN_MS)
    cy.get('.success').should('not.be.visible')
  })
  it('usando o comando contains no lugar do get', () => {
    // antes
    //cy.get('button[type="submit"]').click()
    //depois
    cy.contains('button', 'Enviar').click()
    
  })
  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product').select('YouTube').should('have.value', 'youtube')
  })
  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')
  })
  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product').select(1).should('have.value', 'blog')
  })
  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]').check().should('have.value', 'feedback')
  })
  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]').should('have.length', 3).each(($radio) => {
      cy.wrap($radio).check()
      cy.wrap($radio).should('be.checked')
    })    
  })
  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('#check input[type="checkbox"]').as('checkboxes').check().should('be.checked')
    .last().uncheck().should('not.be.checked')    
  })
  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('input[type="file"]').should('not.have.value').selectFile('./cypress/fixtures/example.json')
    .then(input => {
      expect(input[0].files[0].name).to.equal('example.json')
    })
  })
  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('input[type="file"]').selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
    .should((input) => {
      expect(input[0].files[0].name).to.equal('example.json')
    })
  })
  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('example')
    cy.get('input[type="file"]').should('not.have.value').selectFile('@example')
    .then(input => {
      expect(input[0].files[0].name).to.equal('example.json')
    })
  })
  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  })
  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('#privacy a').invoke('removeAttr', 'target').click()
  })
  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')

      cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })
  it('preenche a area de texto usando o comando invoke', () => {
    const longText = Cypress._.repeat('1234567890', 20)
    cy.get('#open-text-area')
      .invoke('val', longText)
      .should('have.value', longText)
  })
  it('faz uma requisição HTTP', () => {
    cy.request({
      method: 'GET',
      url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.statusText).to.equal('OK');
      expect(response.body).to.include('CAC TAT');
    })
  })

  // it('faz uma requisição HTTP', () => {
  //   cy.request({
  //     method: 'GET',
  //     url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
  //   }).then((response) => {
  //     const { status, statusText, body } = response
  //     expect(status).to.equal(200);
  //     expect(statusText).to.equal('OK');
  //     expect(body).to.include('CAC TAT');
  //   })
  // })

  it.only('encontrar o gato na aplicação que está oculto', () => {
    cy.get('#cat')
    .should('not.be.visible')
    .invoke('show')
    .should('be.visible')
    .invoke('hide')
    .should('not.be.visible')

    cy.get('#title')
    .invoke('text', 'CAT TAT')

    cy.get('#subtitle')
    .invoke('text', 'Eu ❤️ gatos! 😻')
  })
  
})