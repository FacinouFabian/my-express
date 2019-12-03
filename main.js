const express = require('./express')
const app = express()

app.get('/', function (req, res) {
    res.write('GET request to homepage')
})

app.post('/students', function (req, res) {
    res.write('POST request to homepage')
})

app.put('/students/', function (req, res) {
    res.write('PUT request to homepage')
})

app.delete('/students/', function (req, res) {
    res.write('DELETE request to homepage')
})

// app.all('/*', function (req, res) {
//       res.write('Request to homepage')
//       next()
// })

app.listen(4242)



// app.render()
