var offering = artifacts.require("./offering.sol");

module.exports = function(deployer) {
  deployer.deploy(offering,"MYTOKEN","MT","100000000000000000000000000");
};
