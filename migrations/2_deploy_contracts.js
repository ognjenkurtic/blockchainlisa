var Adoption = artifacts.require("Adoption");
var Museum = artifacts.require("Museum");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
  deployer.deploy(Museum);
};