import {Event} from './models';
import database from './database';
import Fastify from 'fastify';
import {JSONRPCServer, JSONRPCRequest} from 'json-rpc-2.0';

const rpcServer = new JSONRPCServer();

type EthGetLogsParams = {
    fromBlock?: string,
    toBlock?: string,
    address?: string | string[],
    topics?: string | string[],
    blockHash?: string
};

rpcServer.addMethod('eth_getLogs', (obj = {}) => {
    console.log(obj);
    return true;
});

const webServer = Fastify({logger: true});
const webServerOptions = {schema: {body: {
    type: 'object',
    properties: {
        id: {type: 'number'},
        jsonrpc: {type: 'string'},
        method: {type: 'string'},
        params: {type: ['object', 'array']}
    }
}}};

webServer.post('/', webServerOptions, async (req, res) => {
    try {
        const response = await rpcServer.receive(req.body as JSONRPCRequest);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(e);
    }
});

(async () => {
    try {
        await database.authenticate();
    } catch (e) {
        console.error('Database authentication failed', e);
        process.exit(1);
    }
    try {
        await database.sync();
    } catch (e) {
        console.error('Database synchronisation failed', e);
        await database.close();
        process.exit(1);
    }
    try {
        await webServer.listen({
            port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 8787,
            host: process.env.SERVER_HOST || 'localhost'
        });

        // curl localhost:8787 \
        //   -X POST \
        //   -H "Content-Type: application/json" \
        //   -d '{"id":1,"jsonrpc":"2.0","method":"eth_getLogs","params":{"foo":"bar"}}'
    } catch (e) {
        console.error('Failed to start server', e);
        await database.close();
        process.exit(1);
    }
})();


// (async () => {
//     try {
//         await database.authenticate();
//         await database.sync();

//         const event = new Event();

//         event.fromJSON({
//             logIndex: '0x1',
//             blockNumber: '0x1b4', // 436
//             blockHash: '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
//             transactionHash: '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
//             transactionIndex: '0x0',
//             address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
//             data: '0x0000000000000000000000000000000000000000000000000000000000000000',
//             topics: ['0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5'],
//             removed: false
//         });

//         await event.save();

//         const [storedEvent] = await Event.findAll({})

//         console.log({
//             event: storedEvent.toJSON()
//         });
//     } catch (e) {
//         console.error('DB err:', e);
//     }
// })();
