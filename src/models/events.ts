import Model from './base';
import {DataTypes} from 'sequelize';
import sequelize from '../database';

const {INTEGER, BIGINT, TEXT, STRING, BOOLEAN} = DataTypes;

export type RpcEvent = {
    address: string,
    topics: Array<string>,
    data: string,
    blockNumber: string,
    transactionHash: string,
    transactionIndex: string,
    blockHash: string,
    logIndex: string,
    removed: boolean,
};

interface Event {
    address: string,
    topic0: string,
    topic1: string,
    topic2: string,
    topic3: string,
    data: string,
    blockNumber: bigint,
    transactionHash: string,
    transactionIndex: number,
    blockHash: string,
    logIndex: number,
    removed: boolean,
}

class Event extends Model implements Event {
    fromJSON(event: RpcEvent) {
        this.address = event.address;

        if (event.topics.length > 4) {
            throw new Error('Too many event topics');
        }

        for (let i = 0; i < event.topics.length; i++) {
            const index = `topic${i}` as 'topic0' | 'topic1' | 'topic2' | 'topic3';
            this[index] = event.topics[i];
        }

        this.data = event.data;
        this.blockNumber = BigInt(event.blockNumber);
        this.transactionHash = event.transactionHash;
        this.transactionIndex = parseInt(event.transactionIndex, 16);
        this.blockHash = event.blockHash;
        this.logIndex = parseInt(event.logIndex, 16);
        this.removed = event.removed;
    }

    toJSON(): RpcEvent {
        const topics = [];
        if (this.topic0 && this.topic0 !== EMPTY_VALUE) {
            topics.push(this.topic0);
        }
        if (this.topic1 && this.topic1 !== EMPTY_VALUE) {
            topics.push(this.topic1);
        }
        if (this.topic2 && this.topic2 !== EMPTY_VALUE) {
            topics.push(this.topic2);
        }
        if (this.topic3 && this.topic3 !== EMPTY_VALUE) {
            topics.push(this.topic3);
        }
        return {
            address: this.address,
            topics,
            data: this.data,
            blockNumber: `0x${BigInt(this.blockNumber).toString(16)}`,
            transactionHash: this.transactionHash,
            transactionIndex: this.transactionIndex.toString(16),
            blockHash: this.blockHash,
            logIndex: this.logIndex.toString(16),
            removed: this.removed,
        };
    }
};

const EMPTY_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000000';

Event.init({
    removed: {type: BOOLEAN, allowNull: false},
    logIndex: {type: INTEGER.UNSIGNED, allowNull: true, defaultValue: 0},
    address: {type: STRING(42), allowNull: false},
    blockNumber: {type: BIGINT.UNSIGNED, allowNull: false},
    transactionHash: {type: STRING(66), allowNull: false},
    transactionIndex: {type: INTEGER.UNSIGNED, allowNull: true, defaultValue: 0},
    blockHash: {type: STRING(66), allowNull: false},
    data: {type: TEXT, allowNull: true, defaultValue: EMPTY_VALUE},
    topic0: {type: STRING(66), allowNull: true, defaultValue: EMPTY_VALUE},
    topic1: {type: STRING(66), allowNull: true, defaultValue: EMPTY_VALUE},
    topic2: {type: STRING(66), allowNull: true, defaultValue: EMPTY_VALUE},
    topic3: {type: STRING(66), allowNull: true, defaultValue: EMPTY_VALUE},
}, {
    sequelize,
    indexes: [
        {fields: ['blockNumber']},
        {fields: ['blockNumber', 'address']},
        {fields: ['blockNumber', 'address', 'topic0']},
        {fields: ['blockNumber', 'topic0']},
        {fields: ['address', 'topic0']},
        {fields: ['address']},
        {fields: ['topic0']},
        {fields: ['topic1']},
        {fields: ['topic2']},
        {fields: ['topic3']},
    ]
});

export default Event;
