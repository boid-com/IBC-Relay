# IBC Reporter

Nodejs app running on a server that scans all blockchans for events and handles IBC.

---

## Setup

- Can be deployed on servers like any other NodeJS app.
- It's stateless and does not require any database.
- Requries Node.js
- Requires PM2 installed globally
- Yarn recommended
- Worker account setup on each chain, Should have at least 50kb of RAM available and 20ms CPU minimum.
- For EOS worker accounts we suggest you register them in your watchlist at eospowerup.io/auto to ensure they receive resouces automatically.

```bash
yarn
yarn build
```

## PM2 Setup

- Make a copy of `prod.ecosystem.config.example.js` file as `prod.ecosystem.config.js`
- Modify the ecosystem ENV variables with your worker account information on each chain including authority and private key. Please update the nodes from the default and point at your own node you trust for extra security.
- If you prefer the ENV vars could be provided in another way, in which case you can remove them from the ecosystem file.
- Run `pm2 start ./prod.ecosystem.config.js` to start the worker. Check the logs and you should see `Reporter eos: started` for each chain.
- Monitor your logs to ensure there is no authorization errors when making reports.

## Monitoring

There are some optional endpoints that can be used to check the health of the reporter, or a list of logs and performed transfer events.

A simple health check reporting the last checked block number on the chains can be seen on [/health](http://localhost:8080/health).

Logs can be seen on [/logs](http://localhost:8080/logs).
