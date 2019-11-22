const http = require('http')
class myExpress{

    constructor(){
        this.app = this.init()
    }

    init(){
        const server = http.createServer()
        return server
    }

    get(path, callback){
        if (path === '/'){
            this.app.on('request', (req, res) => {
                console.log(req.method)
                callback(req, res)
                res.end()
            })
        }
    }

    listen(port){
        this.app.listen(port)
    }

    // post(){
    //     console.log('post')
    // }

    // put(){
    //     console.log('put')
    // }

    // delete(){
    //     console.log('delete')
    // }

    // all(){
    //     console.log('all')
    // }

    // render(){
    //     console.log('render')
    // }
}

function express(){
    return new myExpress()
}

module.exports = express