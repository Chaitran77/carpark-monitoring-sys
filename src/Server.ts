import * as express from 'express';

class Server {
	public express

	constructor() {
		this.express = express();
		this.loadRoutes()
	}

	private loadRoutes() : void {

		
		
		// this.express.get('/', (req, res) => {
		//     res.json({
			//         'message': 'Hello World!'
		//     })
		// })
		this.express.use(express.json( { limit: '2mb' }));

		// this.express.use("/", (req, res, err) => { 
		//     console.log(req.body);
		// })

		this.express.post('/NotificationInfo/TollgateInfo', (req: express.Request, res: express.Response) => { 
			console.log(req); 
		})
	} 
}

export default new Server().express;


// https://medium.com/@pmhegdek/oop-in-typescript-express-server-d9368b97740e