'use strict';

const Stratum = require('./libs/class.Stratum');

const stratum = new Stratum({
    coinbaseAddress: 'aJk3EoyrMKStHdS3PizvoZ1CcH8yYKAQsu',
    blockBrand: '/@makipool/mtp-firo-stratum/',
    host: "0.0.0.0",
    port: {
        number: 3000,
        diff: 1024
    },
    rpc: {
        host: '172.16.3.102',
        port: 15001,
        user: 'user',
        password: "x"
    },
    jobUpdateInterval: 55,
    blockPollIntervalMs: 250
});

stratum.init();

stratum.on(Stratum.EVENT_CLIENT_CONNECT, ev => {
    console.log(`Client connected: ${ev.client.socket.remoteAddress}`);
});

stratum.on(Stratum.EVENT_CLIENT_DISCONNECT, ev => {
    console.log(`Client disconnected: ${ev.client.socket.remoteAddress} ${ev.reason}`);
});

stratum.on(Stratum.EVENT_SHARE_SUBMITTED, ev => {
    if (ev.share.isValidBlock) {
        console.log(`Valid block submitted by ${ev.share.client.workerName}`)
    }
    else if (ev.share.isValidShare) {
        console.log(`Valid share submitted by ${ev.share.client.workerName}`)
    }
    else {
        console.log(`Invalid share submitted by ${ev.share.client.workerName} ${ev.share.error.message}`)
    }
});

// Make sure Error can be JSON serialized
if (!Error.prototype.toJSON) {
    Error.prototype.toJSON = function () {
        const jsonObj = {};

        Object.getOwnPropertyNames(this).forEach(key => {
            jsonObj[key] = this[key];
        }, this);

        return jsonObj;
    }
}
