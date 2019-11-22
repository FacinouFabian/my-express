const http = require('http')
const url = require('url')
const fs = require('fs')

function express(port){
    const LOCAL_DATABASE = './students.json'
    const file = require(LOCAL_DATABASE)

    const server = http.createServer(function (request, response) {
        const {pathname, query} = url.parse(request.url, true)
        // GET //
        if (request.method === 'GET'){
            if (pathname === '/'){
                const {name} = query
                response.writeHead(200, { 'Content-Type': 'text/html' })
                response.write(`<h1>Hello ${name || 'World'} !</h1>`)
            }
            console.log(`${request.method} status : OK`)
        }
        // POST //
        if (request.method === 'POST'){
            if (pathname === '/students'){
                //1 get data
                let body = ''

                request.on('data', chunk => {
                    body += chunk.toString()
                })

                request.on('end', () => {
                    //console.log(request.headers)
                    const user = JSON.parse(body)
                    const { name } = user
                    console.log(`New student ${name} inserted !`)
                    let data
                    if (!fs.existsSync(LOCAL_DATABASE)) {
                        user.id = 1
                        data = [user]
                    } else {
                        const json = require(`./${LOCAL_DATABASE}`)
                        user.id = json.length + 1
                        json.push(user)
                        data = json
                    }

                    fs.writeFileSync(LOCAL_DATABASE, JSON.stringify(data, null, 4))
                })
                //2 file system management
            }
            console.log(`${request.method} status : OK`)
        }
        // PUT //
        if (request.method === 'PUT'){
            const tab = pathname.split('/')
            const studentID = tab[2]
            if (pathname === `/students/${studentID}`){
                if (fs.existsSync(LOCAL_DATABASE)) {
                    //1 get data
                    let body = ''

                    request.on('data', chunk => {
                        body += chunk.toString()
                        console.log(body)
                        //postman
                        const user = JSON.parse(body)
                        const { name } = user
                        for (const elt of file){
                            if (elt.id === parseInt(studentID)){
                                elt.name = name
                            }
                        }
                        fs.writeFileSync(LOCAL_DATABASE, JSON.stringify(file))
                    })

                    request.on('end', () => {     
                        fs.writeFileSync(LOCAL_DATABASE, JSON.stringify(file, null, 4), function (err) {
                            console.log(JSON.stringify(file))
                        })
                    })
                }
            }
            console.log(`${request.method} status : OK`)
        }
        // DELETE //
        if (request.method === 'DELETE'){
            const tab = pathname.split('/')
            const studentID = tab[2]
            const i = parseInt(studentID)
            const index = i - 1 
            if (pathname === `/students/${studentID}`){
                if (fs.existsSync(LOCAL_DATABASE)) {
                    for (const elt of file){
                        if (elt.id === parseInt(studentID)){
                            file.splice(index, index)
                            console.log(file)
                        }
                    }
                    fs.writeFileSync(LOCAL_DATABASE, JSON.stringify(file))

                    request.on('end', () => {     
                        fs.writeFileSync(LOCAL_DATABASE, JSON.stringify(file, null, 4), function (err) {
                            console.log(JSON.stringify(file))
                        })
                    })
                }
            }
            console.log(`${request.method} status : OK`)
        }

        response.end()
      })
      
      server.listen(port)

    console.log(`Server is running on port ${port}`)

    //server.close()
}

function test(){
    console.log('test')
}

module.exports = {
    express,
    test
}