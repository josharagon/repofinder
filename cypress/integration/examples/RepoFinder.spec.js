import { wait } from "@testing-library/dom"

describe('Happy Paths', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('Should see home page on load', () => {
    cy.get('h1').contains('RepoFinder')
    cy.get('input')
    cy.get('button').contains('Search')
  })

  it('Should be able to use the GitHub API to search and return repos', () => {
    cy.fixture('mockResult').then((testResult) => {
      cy.intercept("https://api.github.com/search/repositories?q=josharagon+language:%27%27&sort=%27%27", testResult)
    })
    cy.get('input').type('josharagon')
    .get('button').click()
  })

  it('Should be able to click on a card to see more details about that repo', () => {
    cy.fixture('mockResult').then((testResult) => {
      cy.intercept("https://api.github.com/search/repositories?q=josharagon+language:%27%27&sort=%27%27", testResult)
    })
    cy.get('input').type('josharagon')
    .get('button').click()
    cy.get('.repo-card').first().click()
    .get('h2').contains('creator: josharagon')
    .get('h3').contains('fork Count')
  })

  it('Should be able to filter results', () => {
    cy.fixture('starredResult').then((testResult) => {
      cy.intercept("https://api.github.com/search/repositories?q=josharagon+language:%27%27&sort=stars", testResult)
    })
    cy.fixture('mockResult').then((testResult) => {
      cy.intercept("https://api.github.com/search/repositories?q=josharagon+language:%27%27&sort=%27%27", testResult)
    })
    cy.get('input').type('josharagon')
    .get('button').click()
    .get('select').first().select('stars')
    .get('.rf-button').click()
  })
})

describe('Sad Paths', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('Should see proper error message if no results are returned', () => {
    cy.fixture('emptyResult').then((testResult) => {
      cy.intercept("https://api.github.com/search/repositories?q=nothing+language:%27%27&sort=%27%27", testResult)
    })
    cy.get('input').type('nothing')
    .get('button').click()
    cy.wait(10)
    .get('.error-loading').contains('No results found')
  })

  it('Should give proper error message if a fetch requests fails', () => {
    cy.intercept({
      method: 'GET',
      url: 'https://api.github.com/search/repositories?q=nothing+language:%27%27&sort=%27%27'
    },
      {
        statusCode: 404,
        body:''
      })
      cy.get('input').type('nothing')
      .get('button').click()
      cy.wait(5)
      .get('.error-loading')
  })
})