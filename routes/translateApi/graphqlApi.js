const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean
} = require('graphql')

const sentenceType = new GraphQLObjectType({
    name: 'sentence',
    description: 'sentence to traduce',

    fields: () => ({
        input: {
            type: GraphQLString,
            resolve: apiResp => apiResp.input
        },
        correctedInput: {
            type: GraphQLString,
            resolve: apiResp =>
                (apiResp.from.text.didYouMean || apiResp.from.text.autoCorrected ?
                    (apiResp.from.text.value).replace(/[\[\]]/g, '') :
                    null)
        },
        //FIXME: behaviour random
        translationDone: {
            type: GraphQLBoolean,
            resolve: apiResp =>
                (apiResp.from.text.autoCorrected || apiResp.input.toLowerCase() != apiResp.text.toLowerCase()) && !apiResp.from.text.didYouMean
        },
        inputCorrect: {
            type: GraphQLBoolean,
            resolve: apiResp => (!apiResp.from.text.autoCorrected && (apiResp.input !== apiResp.text))
        },
        text: {
            type: GraphQLString,
            resolve: apiResp => apiResp.text
        },
        from: {
            type: fromType,
            resolve: apiResp => apiResp.from
        },
        definition: {
            type: definitionType,
            resolve: apiResp => defineApi(this.correctedInput)
        }
    })
})

const fromType = new GraphQLObjectType({
    name: 'from',
    description: 'from Part of a sentence',

    fields: () => ({
        language: {
            type: languageType,
            resolve: fromJson => fromJson.language
        },
        text: {
            type: textType,
            resolve: fromJson => fromJson.text
        }
    })
})

const languageType = new GraphQLObjectType({
    name: 'language',
    description: 'language of a from',

    fields: () => ({
        didYouMean: {
            type: GraphQLBoolean,
            resolve: languageJson => languageJson.didYouMean
        },
        iso: {
            type: GraphQLString,
            resolve: languageJson => languageJson.iso
        }
    })
})

const textType = new GraphQLObjectType({
    name: 'text',
    description: 'text of a from',

    fields: () => ({
        autoCorrected: {
            type: GraphQLBoolean,
            resolve: textJson => textJson.autoCorrected
        },
        value: {
            type: GraphQLString,
            resolve: textJson => textJson.value
        },
        didYouMean: {
            type: GraphQLBoolean,
            resolve: textJson => textJson.didYouMean
        }
    })
})

const definitionType = new GraphQLObjectType({
    name: 'definition',
    description: 'definition of the word',

    fields: () => ({
        definitionNumber: {
            type: GraphQLInt,
            resolve: apiResp =>
                apiResp.length
        },
        definitions: {
            type: new GraphQLList(defType),
            resolve: apiResp => apiResp
        },
    })
})

const defType = new GraphQLObjectType({
    name: 'def',
    description: 'one definition',
    fields: () => ({
        partOfSpeech: {
            type: GraphQLString,
            resolve: defJson => defJson.partOfSpeech
        },
        text: {
            type: GraphQLString,
            resolve: defJson => defJson.text
        },
        sourceDictionnary: {
            type: GraphQLString,
            resolve: defJson => defJson.sourceDictionnary
        },
    })
})


module.exports = ({ translateFromEnToFr, translateFromFrToEn, defineApi }) => new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: 'Translate your sentence using Google',
        fields: () => ({
            translation: {
                type: sentenceType,
                args: {
                    sentenceToTranslate: { type: GraphQLString },
                    from: { type: GraphQLString },
                    to: { type: GraphQLString }
                },
                resolve: (root, args) => {
                    if (args.from === 'en' && args.to === 'fr')
                        return translateFromEnToFr(args.sentenceToTranslate)
                    else if (args.from === 'fr' && args.to === 'en')
                        return translateFromFrToEn(args.sentenceToTranslate)
                    else
                        return ({ code: 404, msg: "[translation] NO MATCHING TRANSLATION" })
                }
            },
            definition: {
                type: definitionType,
                args: {
                    wordToDefine: { type: GraphQLString },
                },
                resolve: (root, args) => defineApi(args.wordToDefine)
            }
        })
    })
})