ref-stratum-zcoin
=================

This Reference Stratum is a simple implementation used as a basis for testing, experimentation, and 
demonstration purposes. It is not intended for production use.

This project has been developed and tested on [Node v10.17](https://nodejs.org/) and [Ubuntu 16.04](http://releases.ubuntu.com/16.04/)

## Install ##

__NodeJS v10 (Ubuntu)__
```bash
# Optional: uninstall current version
sudo apt-get remove node
sudo apt-get remove nodejs

# Install version 10.x
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install nodejs -y
```

__Dependencies__
```bash
# (ubuntu) build essentials required to compile MTP verification
sudo apt-get install build-essentials

# Dependencies may require that you have a Github personal access token to install.
npm config set @makipool:registry https://npm.pkg.github.com/makipool
npm config set //npm.pkg.github.com/:_authToken <PERSONAL_ACCESS_TOKEN>
```
[Creating a personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)

__Download from Github__
```bash
git clone https://github.com/MakiPool/ref-stratum-zcoin

# install
cd ref-stratum-zcoin
npm install
```

__Install in a Project__
```bash
npm config set @makipool:registry https://npm.pkg.github.com/makipool
npm config set //npm.pkg.github.com/:_authToken <PERSONAL_ACCESS_TOKEN>

npm install @makipool/ref-stratum-zcoin --save
```

## Usage ##
The stratum can be used as a module in a pool:
```javascript
const Stratum = require('@makipool/ref-stratum-zcoin').Stratum;

class MyStratum extends Stratum {
    /* Override */
    canAuthorizeWorker(client, callback) {
        // implement your own logic
        if (client.minerAddress === 'bad') {
            // do not authorize worker
            callback(null/*error*/, false/*isAuthorized*/);
        }
        else {
            // authorize worker
            callback(null/*error*/, true/*isAuthorized*/);
        }
    }
}

const stratum = new MyStratum({
    coinbaseAddress: 'TC6qME2GhepR7656DgsR72pkQDmhfTDbtV', // address that receives block reward
    blockBrand: '/@makipool/ref-stratum/', // Branding string added to every block found
    host: "0.0.0.0", // address the stratum will listen on
    port: {
        number: 3000, // port the stratum will listen on
        diff: 1024    // stratum difficulty
    },
    rpc: {
        host: '172.16.3.102', // Zcoin daemon RPC host
        port: 17001,          // Zcoin daemon RPC port
        user: 'rpcuser',      // Zcoin daemon RPC user
        password: "x"         // Zcoin daemon RPC password
    },
    jobUpdateInterval: 55,    // Broadcast job updates every n seconds
    blockPollIntervalMs: 250  // Check for new blocks every n milliseconds
});

stratum.on(Stratum.EVENT_SHARE_SUBMITTED, ev => {
    console.log(ev.share);    
});

stratum.init();
```

### Start Script ###
There is a start script (`start.js`) included which contains further
examples. It can also be run in order to get a Stratum going for test
purposes. You will need to open and modify the config inside before
running it.
```
> node start
```

## Areas of Interest ##
- [ClientReader](libs/class.ClientReader.js) - Handles messages received from a client.
- [ClientWriter](libs/class.ClientWriter.js) - Handles sending messages to a client.
- [Coinbase](libs/class.Coinbase.js) - Creates coinbase transaction and includes founder rewards.
- [Share](libs/class.Share.js) - Processes shares, validates proofs, creates blocks.
- [Socket](libs/class.Socket.js) - Handles binary BOS serialization and deserialization.
- [algorithm](libs/service.algorithm.js) - Contains MTP constants and hash verification.


## Resources ##
- [Zcoin](https://zcoin.io/) - The first cryptocurrency to implement the Merkle Tree Proof POW algorithm.
- [MakiPool Mining Pool](https://makipool.com) - Zcoin mining pool.