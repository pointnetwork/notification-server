import {Event} from './models';
import database from './database';

(async () => {
    try {
        await database.authenticate();
        await database.sync();

        const event = new Event();

        event.fromJSON({
            logIndex: '0x1',
            blockNumber: '0x1b4', // 436
            blockHash: '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
            transactionHash: '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
            transactionIndex: '0x0',
            address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
            data: '0x0000000000000000000000000000000000000000000000000000000000000000',
            topics: ['0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5'],
            removed: false
        });

        await event.save();

        const [storedEvent] = await Event.findAll({})

        console.log({
            event: storedEvent.toJSON()
        });
    } catch (e) {
        console.error('DB err:', e);
    }
})();
