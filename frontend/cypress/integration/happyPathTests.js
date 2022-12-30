/* eslint-disable no-undef */
context('Spec 2.7', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  it('Happy Path 1', () => {
    const name = 'Test User';
    const email = `test${Date.now()}@email.com`;
    const password = 'test123';

    // If logged in, log out
    cy.get('button[id=logoutButton]').then(($button) => {
      if ($button.is(':visible')) {
        cy.get('button[id=logoutButton]').click();
      }
    });

    // Register new user
    cy.get('#Register').click();
    cy.get('input[id=name]').focus().type(name);
    cy.get('input[id=email]').focus().type(email);
    cy.get('input[id=password]').focus().type(password);
    cy.get('#registerButton').click();

    // Assert that current page is dashboard page
    cy.url().should('include', '/dashboard');

    // Create new game
    cy.get('input[id=gameName]').focus().type('Test Game');
    cy.get('#createGameButton').click();

    cy.wait(500);

    // Edit game
    cy.get('[name=editGameButton]').click();

    // Assert that current page is edit game page
    cy.url().should('include', '/edit');

    // Edit game image
    cy.get('input[id=editGameThumbnailUpload]').selectFile('cypress/fixtures/rick.jpg');

    // Assert game name has default value of 'Test Game'
    cy.get('input[id=editGameName]').should('have.value', 'Test Game');

    // Edit game name
    cy.get('input[id=editGameName').focus().clear().type('Renamed Game');

    // Save changes
    cy.get('button[id=updateGameButton]').click();

    // Assert that current page is dashboard page
    cy.url().should('include', '/dashboard');

    cy.wait(500);

    // Assert that game name has been changed
    cy.get('h2[name=gameName]').should('have.text', 'Renamed Game');

    // Start game
    cy.get('button[name=Start]').click();

    // Assert no error message
    cy.get('[name=errorModal]').should('not.exist');

    cy.wait(500);

    // Close modal
    cy.get('button[name=modalCloseButton]').click();

    // Stop game
    cy.get('button[name=Stop]').click();

    // Assert no error message
    cy.get('[name=errorModal]').should('not.exist');

    // Click yes to go to results
    cy.get('button[name=showResultAcceptButton]').click();

    // Assert that current page is results page
    cy.url().should('include', '/results');

    // Logout
    cy.get('button[id=logoutButton]').click();

    // Assert current page is login page
    cy.url().should('include', '/login');

    // Login user
    cy.get('input[id=email]').focus().type(email);
    cy.get('input[id=password]').focus().type(password);
    cy.get('#loginButton').click();

    // Assert that current page is dashboard page
    cy.url().should('include', '/dashboard');

    // Assert game is visible
    cy.get('h2[name=gameName]').should('have.text', 'Renamed Game');
  });

  it('Happy Path 2', () => {
    const name = 'Test User';
    const email = `test${Date.now()}@email.com`;
    const password = 'test123';

    // If logged in, log out
    cy.get('button[id=logoutButton]').then(($button) => {
      if ($button.is(':visible')) {
        cy.get('button[id=logoutButton]').click();
      }
    });

    // Register new user
    cy.get('#Register').click();
    cy.get('input[id=name]').focus().type(name);
    cy.get('input[id=email]').focus().type(email);
    cy.get('input[id=password]').focus().type(password);
    cy.get('#registerButton').click();

    // Assert that current page is dashboard page
    cy.url().should('include', '/dashboard');

    // Create new game
    cy.get('input[id=gameName]').focus().type('Test Game');
    cy.get('#createGameButton').click();

    cy.wait(500);

    // Assert that current page is dashboard page
    cy.url().should('include', '/dashboard');

    cy.wait(500);

    // Delete game
    cy.get('button[name=deleteGameButton]').click();

    // Assert no games exist
    cy.get('h2[name=gameName]').should('not.exist');

    // Create new game
    cy.get('input[id=gameName]').focus().type('Test Game 2');
    cy.get('#createGameButton').click();

    // Edit game
    cy.get('[name=editGameButton]').click();

    // Assert that current page is edit game page
    cy.url().should('include', '/edit');

    // Add a question
    cy.get('input[id=questionString]').focus().type('What are the two best COMP courses?');

    // Add point value
    cy.get('input[id=pointValue]').focus().type('1');

    // Add time limit
    cy.get('input[id=timeLimit]').focus().type('30');

    // Add the first correct answer
    cy.get('.chakra-checkbox__input').check({ force: true });
    cy.get('[id=answerPreview-0]').click();
    cy.get('input[id=answer-0]').focus().type('COMP6080');

    // Add the second correct answer
    // cy.get('[aria-label=checkbox-1]').check();
    cy.get('[id=answerPreview-1]').click();
    cy.get('input[id=answer-1]').focus().type('COMP2511');

    // Add more answer options
    cy.get('button[id=addAnswer]').click();
    cy.get('button[id=addAnswer]').click();

    // Add the first incorrect answer
    cy.get('[id=answerPreview-2]').click();
    cy.get('input[id=answer-2]').focus().type('COMP3141');

    // Add the second incorrect answer
    cy.get('[id=answerPreview-3]').click();
    cy.get('input[id=answer-3]').focus().type('COMP3331');

    cy.get('button[id=createQuestionButton]').click();

    // Assert that current page is edit page
    cy.url().should('include', '/edit');

    // Assert question is visible
    cy.get('h2[name=questionString]').should('have.text', 'What are the two best COMP courses?');

    // Edit question
    cy.get('button[name=editQuestion]').click();

    // Assert edit question form question string is correct
    cy.get('input[id=questionString]').should('have.value', 'What are the two best COMP courses?');

    // Insert youtube link
    cy.get('input[id=youtubeLink]').focus().type('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    // Submit edit question form
    cy.get('button[id=updateQuestion]').click();

    // Assert that current page is edit page
    cy.url().should('include', '/edit');

    // Assert thumbnail is correct and link is updated
    cy.get('img[name=thumbnail]').should('have.attr', 'src', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');

    // Assert that youtube link is correct
    cy.get('a[name=thumbnailLink]').should('have.attr', 'href', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    // Assert that question is visible
    cy.get('h2[name=questionString]').should('have.text', 'What are the two best COMP courses?');

    // Edit question
    cy.get('button[name=editQuestion]').click();

    // Update point value and time limit of question
    cy.get('input[id=pointValue]').focus().type('2');
    cy.get('input[id=timeLimit]').focus().type('60');

    // Submit edit question form
    cy.get('button[id=updateQuestion]').click();

    // Assert that current page is edit page
    cy.url().should('include', '/edit');

    // Assert that time limit is correct
    cy.get('p[name=timeLimit]').contains('60')

    // Assert that question is visible
    cy.get('h2[name=questionString]').should('have.text', 'What are the two best COMP courses?');

    // Edit question
    cy.get('button[name=editQuestion]').click();

    // Replace youtube link with image
    cy.get('input[id=editQuestionThumbnailUpload]').selectFile('cypress/fixtures/rick.jpg');

    // Submit edit question form
    cy.get('button[id=updateQuestion]').click();

    // Assert photo has changed
    cy.get('img[name=thumbnail]').should('not.have.attr', 'src', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
  });
});
