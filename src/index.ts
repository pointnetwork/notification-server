import {Event} from './models';
import database from './database';

(async () => {
    try {
        console.log('Starting');

        await database.authenticate();

        console.log('Connection established');

        await database.sync();

        console.log('Database synced');

        const event = new Event({logIndex: 42});
        await event.save();

        console.log({
            events: await Event.findAll({})
        });
    } catch (e) {
        console.error('DB err:', e);
    }
})();
