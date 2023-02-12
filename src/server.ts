import * as express from 'express';

class Server {
    public express
    constructor() {
        this.express = express();
        this.loadRoutes()
    } 

    private loadRoutes() : void {

        this.express.use(express.json( { limit: '2mb' }));

        this.express.use('/', function (req, res, next) {
            console.log(req.baseUrl, req.originalUrl);
            console.log(req.body);
        })
        
        // const router = express.Router()
        // router.get('/', (req, res) => {
        //     res.json({
        //         'message': 'Hello World!'
        //     })
        //     this.express.use('/', router);
        // })

        // router.post('', (req, res) => {
        //     console.log(req); 
        // })
    }
}

export default new Server().express;


// https://medium.com/@pmhegdek/oop-in-typescript-express-server-d9368b97740e