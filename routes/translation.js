const googleTranslateApi = require('google-translate-api')
const router = require('express').Router()
const graphqlHTTP = require('express-graphql')

const GRAPHIQL = process.env.GRAPHIQL || true

//wordnik API
const apiUri = process.env.apiUri || "http://api.wordnik.com:80/v4/word.json"
const apiKey = process.env.apiKey || "a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
const defLimit = 20

const { translateFromEnToFr, translateFromFrToEn } = require('./translateApi/translateApi.js')(googleTranslateApi)
const defineApi = require("./translateApi/defineApi")(apiUri, apiKey, defLimit)


const graphqlSchema = require("./translateApi/graphqlApi.js")({ translateFromEnToFr, translateFromFrToEn, defineApi })

router.use('/', graphqlHTTP({
    schema: graphqlSchema,
    graphiql: GRAPHIQL
}))

module.exports = router