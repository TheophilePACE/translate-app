const googleTranslateApi = require('google-translate-api')
const express = require('express')
const graphqlHTTP = require('express-graphql')

const GRAPHQL_PORT = process.env.GRAPHQL_PORT || 4000
const GRAPHIQL = process.env.GRAPHIQL || true

const { translateFromEnToFr, translateFromFrToEn } = require('./translateApi.js')(googleTranslateApi)

const app = express()

const graphqlSchema = require("./graphqlApi.js")({ translateFromEnToFr, translateFromFrToEn })
app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    graphiql: GRAPHIQL
}))
app.listen(GRAPHQL_PORT)


//TESTS
// const {stringify} = require('query-string')
// const makeUrlString = (url) => (query,variables) => `${url}/graphql?${stringify(query)}`
// const fetch = require('graphql-fetch')("http://localhost:4000/graphql")
const uri = "http://localhost:4000/graphql"
const { request } = require("graphql-request")
const query = (sentenceToTranslate, from, to) => `{
    translation(sentenceToTranslate: "${sentenceToTranslate}",from:"${from}", to:"${to}") {
      correctedInput,
      text,
      translationDone,
      input,
      from {
        language {
          didYouMean,
          iso
        },
        text {
         autoCorrected,
          value,
          didYouMean
        }
      }
    }
  }`

describe('Test of the graphQL translation fr -> en', () => {
    it('Translation of bienvenue', () => {
        return request(uri, query("bienvenue", "fr", "en")).then(resp => resp.translation).then(tr => {
            expect(tr.text).toBe("welcome")
            expect(tr.text).not.toEqual(tr.input)
            expect(tr.correctedInput).toBeNull()
            expect(tr.translationDone).toBeTruthy()
            expect(tr.from.language.iso).toEqual('fr')
        })
    })
    it('Translation of azertyuiop', () => {
        return request(uri, query("azertyuiop", "fr", "en")).then(resp => resp.translation).then(tr => {
            expect(tr.text).toBe('azertyuiop')
            expect(tr.correctedInput).toBeNull()
            expect(tr.text).toEqual(tr.input)
            expect(tr.translationDone).toBeFalsy()
            expect(tr.from.language.iso).toEqual('fr')
        })
    })
    it('Translation of vonjour', () => {
        return request(uri, query("vonjour", "fr", "en")).then(resp => resp.translation).then(tr => {
            expect(tr.text).toBe('vonjour')
            expect(tr.text).toEqual(tr.input)
            expect(tr.translationDone).toBeFalsy()
            expect(tr.correctedInput).toEqual('bonjour')
            expect(tr.from.language.iso).toEqual('fr')
        })
    })


})

describe('Test of the graphQL translation en -> fr', () => {
    it('Translation of welcome', () => {
        return request(uri, query("Welcome", "en", "fr")).then(resp => resp.translation).then(tr => {
            expect(tr.text).toBe('Bienvenue')
            expect(tr.text).not.toEqual(tr.input)
            expect(tr.correctedInput).toBeNull()
            expect(tr.translationDone).toBeTruthy()
            expect(tr.from.language.iso).toEqual('en')
        })
    })
    it('Translation of azertyuiop', () => {
        return request(uri, query("azertyuiop", "en", "fr")).then(resp => resp.translation).then(tr => {
            expect(tr.text).toEqual(tr.input)
            expect(tr.correctedInput).toBeNull()
            expect(tr.translationDone).toBeFalsy()
            expect(tr.from.language.iso).toEqual('en')
        })

    })
})