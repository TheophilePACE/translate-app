const makeTranslateApi = (translationApi) => ({
    translateFromEnToFr: (sentence) =>
        translationApi(sentence, { from: "en", to: "fr" })
        .then(res => {
            //console.log(`[translateFromEnToFr] Request for sentence :"${sentence}"   received response : ${JSON.stringify(res)}`)
            res.input = sentence
            return res
        })
        .catch(err => {
            throw new Error(`[translateFromEnToFr] Error while translating "${sentence}" : ${JSON.stringify(err)}`)
        }),

    translateFromFrToEn: (sentence) =>
        translationApi(sentence, { from: "fr", to: "en" })
        .then(res => {
            //console.log(`[translateFromFrToEn] Request for sentence :"${sentence}"   received response : ${JSON.stringify(res)}`)
            res.input = sentence
            return res
        })
        .catch(err => {
            throw new Error(`[translateFromFrToEn] Error while translating "${sentence}" : ${JSON.stringify(err)}`)
        })


})

module.exports = makeTranslateApi