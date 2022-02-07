const ms = require('ms')
module.exports = {
  apps: [
    {
      name: "ibc-worker",
      script: "./build/index.js",
      env: {
        PORT: "1111",
        WAX_ENDPOINT: "https://wax.greymass.com",
        WAX_IBC: "boidcomnodes;active;5JCPYLpip...",
        TELOS_ENDPOINT: "https://telos.caleos.io",
        TELOS_IBC: "boidcomnodes;active;5MHPDUfsp...",
        EOS_ENDPOINT: "https://eos.eosn.io",
        EOS_IBC: "boidcomnodes;active;5DSPTRfid...",
        NODE_ENV: "production"
      }
    },
  ]
};
