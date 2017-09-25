const fetch = require('node-fetch')
const makeDefineEng = (apiUri, apiKey, defLimit) => (word) =>
    word.length ?
        fetch(`${apiUri}/${word}/definitions?limit=${defLimit}&api_key=${apiKey}`)
            .then(resp => resp.json())
            .catch(err => {
                console.log(err)
                return []
            })
        : []


module.exports = makeDefineEng