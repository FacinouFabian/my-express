const http = require('http')


const obj = {
  server : function (){
      const server = http.createServer(function (req, res) {
          res.end()
          console.log(res)
      })
      server.listen(4242)
  }
}

obj.server()



// app.get('/', function (req, res) {
//     res.send('GET request to homepage')
// }).listen(4242)

// app.post('/students', function (req, res) {
//   //1 get data
//   let body = ''

//   request.on('data', chunk => {
//     body += chunk.toString()
//   })

//   request.on('end', () => {
//     const user = JSON.parse(body)
//     const { name } = user
//     res.send(`POST request to homepage received data ${name}`)
//   })

// }).listen(4242)