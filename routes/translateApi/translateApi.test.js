const googleTranslateApi = require('google-translate-api')
const { translateFromEnToFr, translateFromFrToEn } = require('./translateApi.js')(googleTranslateApi)

test('Translate Bonjour', async() => {
    const bjr = await translateFromFrToEn('Bonjour')
    expect(bjr.text).toEqual('Hello')
})

test('Translate Fake word', async() => {
    const bjr = await translateFromFrToEn('azertyuiop')
    expect(bjr.text).toEqual('azertyuiop')
})

test('Translate english word', async() => {
    const bjr = await translateFromFrToEn('Hello')
    expect(bjr.text).toEqual('Hello')
})


test('Translate ""', async() => {
    const bjr = await translateFromFrToEn('')
    expect(bjr.text).toEqual('')
})

test('Translate Hello', async() => {
    const bjr = await translateFromEnToFr('Hello')
    expect(bjr.text).toEqual('Bonjour')
})

test('Translate Fake word', async() => {
    const bjr = await translateFromEnToFr('azertyuiop')
    expect(bjr.text).toEqual('azertyuiop')
})

test('Translate French Word', async() => {
    const bjr = await translateFromEnToFr('Bonjour')
    expect(bjr.text).toEqual('Bonjour')
})