const http = require('http')
const local_database = './students.json'
const file = require(local_database)
const url = require('url')
const fs = require('fs')
const path = require('path')
const { Transform } = require('stream')
class myExpress {

  constructor() {
    this.app = this.init()
  }

  init() {
    const server = http.createServer()
    return server
  }

  get(path, callback) {
    if (path === '/') {
      this.app.on('request', (req, res) => {
        if (req.method === 'GET') {
          callback(req, res)
          res.end()
        }
      })
    }
  }

  listen(port) {
    this.app.listen(port)
  }

  post(path, callback) {
    if (path === '/students') {
      //1 get data
      let body = ''
      this.app.on('request', (req, res) => {
        if (req.method === 'POST') {
          req.on('data', chunk => {
            body += chunk.toString()
          })
          req.on('end', () => {
            const user = JSON.parse(body)
            const { name } = user
            console.log(`New student ${name} inserted !`)
            let data
            if (!fs.existsSync(local_database)) {
              user.id = 1
              data = [user]
            } else {
              const json = require(`./${local_database}`)
              let users_id = [];
              json.forEach(user => {
                users_id.push(user.id);
              });
              user.id = json.length > 0 ? Math.max.apply(null, users_id) + 1 : 1;
              json.push(user)
              data = json
            }
            fs.writeFileSync(local_database, JSON.stringify(data, null, 4))
          })
          callback(req, res)
          res.end()
        }
      })
    }
  }


  put(path, callback) {
    this.app.on('request', (req, res) => {
      const { pathname, query } = url.parse(req.url, true)
      const getID = pathname.split('/')
      const studentID = getID[2]
      if (pathname === `/students/${studentID}` && req.method === 'PUT') {
        if (fs.existsSync(local_database)) {
          //1 get data
          let body = ''

          req.on('data', chunk => {
            body += chunk.toString()
            //postman
            const user = JSON.parse(body)
            const { name } = user
            for (const elt of file) {
              if (elt.id === parseInt(studentID)) {
                elt.name = name
              }
            }
            fs.writeFileSync(local_database, JSON.stringify(file))
          })

          req.on('end', () => {
            fs.writeFileSync(local_database, JSON.stringify(file, null, 4), function (err) {
              console.log(JSON.stringify(file))
            })
          })
        }
        callback(req, res)
        res.end()
      }
    })
  }

  delete(path, callback) {
    this.app.on('request', (req, res) => {
      const { pathname, query } = url.parse(req.url, true)
      const getID = pathname.split('/')
      const studentID = getID[2]
      const i = parseInt(studentID)
      let index = 0
      if (pathname === `/students/${studentID}` && req.method === 'DELETE') {
        if (fs.existsSync(local_database)) {
          for (const elt of file) {
            if (elt.id === parseInt(studentID)) {
              index = file.indexOf(elt)
              file.splice(index, index)
              console.log(file)
            }
          }
          fs.writeFileSync(local_database, JSON.stringify(file))

          req.on('end', () => {
            fs.writeFileSync(local_database, JSON.stringify(file, null, 4), function (err) {
              console.log(JSON.stringify(file))
            })
          })
        }
        callback(req, res)
        res.end()
      }
    })
  }

  yes() {
    console.log('ta mère')
  }

  all(path, callback) {
    this.app.on('request', (req, res) => {
      const { pathname, query } = url.parse(req.url, true)
      const getID = pathname.split('/')
      const studentID = getID[2]
      //GET
      if (pathname === '/' && req.method === 'GET') {
        //this.get(path, callback)
        this.yes()
        // console.log('GET')
      }
      //POST
      else if (pathname === '/students' && req.method === 'POST') {
        // this.post(path, callback)
        console.log('POST')
      }
      //PUT
      else if (pathname === `/students/${studentID}` && req.method === 'PUT') {
        // this.put(path, callback)
        console.log('PUT')
      }
      //DELETE
      else if (pathname === `/students/${studentID}` && req.method === 'DELETE') {
        this.delete(path, callback)
        console.log('DELETE')
      }
      res.end()
    })
  }

  render(fileName, callback) {
    if (fs.existsSync(`./${fileName}.mustache`)) {
      fileName = `${fileName}.mustache`

      const content = fs.readFileSync(fileName, 'utf-8');
      const cbLength = Object.keys(callback).length
      const modifiedContent = []

      if (cbLength > 1) {
        // ...
      } else if (cbLength === 1) {
        const cbKey = Object.keys(callback)
        const cbValue = Object.values(callback)
        
        for(const line of content.split('\n')) {
          modifiedContent.push(line.replace(`{{${cbKey[0]}}}`, cbValue[0]))
        }
      }

      !fs.writeFileSync(`${fileName}`, modifiedContent.join('\n'))
        ? console.log(`${fileName} was created !`)
        : console.log(`Error to creat ${fileName} file...`)


    }
  }
}

function express() {
  return new myExpress()
}

module.exports = express
