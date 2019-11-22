const express = require('./express')
const app = express()


app.get('/', function (req, res) {
    res.write('GET request to homepage')
})

app.listen(4242)


// app.post()

// app.delete()

// app.put()

// app.all()

// app.render() 