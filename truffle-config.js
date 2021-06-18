const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
	
	 rinkeby: {
       provider: () => new HDWalletProvider(`bomb tooth purse fold toward hazard slim jacket crime service exercise wire`, `https://rinkeby.infura.io/v3/9adb22ca9e1f4cdca9e090d72248fd2a`),
       network_id: 4,       
       gas: 5500000,       
       confirmations: 2,    
       timeoutBlocks: 200,  
       skipDryRun: true     
     },

  },
  compilers : {
    solc: {
      version: "^0.8.0"
    }
  }
};
