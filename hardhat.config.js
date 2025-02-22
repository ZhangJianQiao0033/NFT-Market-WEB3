const fs = require("fs");

require("@nomiclabs/hardhat-waffle");

// const privateKey = fs.readFileSync(".secret").toString().trim();

module.exports = {
  
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ganache: {
      url: "http://localhost:7545",
      accounts: [
        "0x0a3d68b3f77ad5d3e71529bc560e450f60187c7f3efb89daa9696b5d09b0bc87",
      ],
    },

    // mumbai: {
    //   url: "https://rpc-mumbai.maticvigil.com",
    //   accounts: [privateKey],
    // },
    // rinkeby: {
    // url: 'https://rinkeby.infura.io/v3/bed4fdcc76bb4978a9a3103ef0946f64',
    //   accounts: [privateKey],
    // },
  },
  solidity: "0.8.4",
};
