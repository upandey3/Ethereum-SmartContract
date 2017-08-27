/* Names and desired callbacks of contract methods that are constant
** http://solidity.readthedocs.io/en/develop/contracts.html#constant-functions
** ********************************** */
var readOnlyMethods = [
  {
    name: 'currentPrice',
    callback: function(err, result) {
      var currentPrice = web3.fromWei(result, 'ether').toString(10);
      $('#currentPrice-error').text(err);
      $('#currentPrice-result').text(currentPrice);
    }
  },
  { name: 'biddingOpen' },
  { name: 'getWinningBidder' }
];

/* Names and desired callbacks of contract methods that mutate state
** https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-methods
** ********************************** */
var mutatingMethods = [
  { name: 'bid', payable: true },
  { name: 'finalize' },
  {
    name: 'overrideTime',
    inputs: [
      { name: 'time', type: 'number', label: 'time (blocks)' }
    ]
  },
  { name: 'clearTime' }
];

/* Connect to a web3 provider
** ********************************** */
function initWeb3 () {
  // Supports Mist, and other wallets that provide 'web3'.
  if (typeof web3 !== 'undefined') {
    // Use the Mist/wallet/Metamask provider.
    console.log('Injected web3 detected.')
    window.web3 = new Web3(web3.currentProvider);
  } else {
    // Your preferred fallback.
    console.log('No web3 instance injected, using Local web3.')
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  }
}

/* Get a contract instance on form submit
** https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethcontract
** ********************************** */
function initAccessContractForm () {
  $('#access-contract-form').submit(function(e) {
    e.preventDefault();
    var abi = JSON.parse($('#access-abi-input').val().trim());
    var address = $('#access-address-input').val();
    var contract = web3.eth.contract(abi);
    var deployedContract = contract.at(address);
    // the contract address
    console.log('contract address:', deployedContract.address);
    console.log('deployed contract:', deployedContract);
    buildContractControls(deployedContract, readOnlyMethods, mutatingMethods);
  });
}

/* Deploy a contract on form submit
** https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethcontract
** ********************************** */
function initDeployContractForm () {
  $('#deploy-contract-form').submit(function(e) {
    e.preventDefault();
    var initialPrice = web3.toWei($('#deploy-initialPrice-input').val(), 'ether');
    var biddingPeriod = Number($('#deploy-biddingPeriod-input').val());
    var offerPriceDecrement = web3.toWei($('#deploy-offerPriceDecrement-input').val(), 'ether');
    var testMode = $('#deploy-testMode-input').prop('checked');

    var abi = JSON.parse($('#deploy-abi-input').val().trim());
    var bytecode = $('#deploy-bytecode-input').val().trim();
    var gas = Number($('#deploy-gas-input').val());

    var transactionObject = {data: '0x' + bytecode, from: web3.eth.coinbase, gas: gas};

    // deploy the contract
    web3.eth.contract(abi).new(
      initialPrice,
      biddingPeriod,
      offerPriceDecrement,
      testMode,
      transactionObject,
      function(err, deployedContract) {
        // check tx hash on the first call (transaction send)
        if (!deployedContract.address) {
          // The hash of the transaction, which deploys the contract
          console.log('txHash:', deployedContract.transactionHash)
        // check address on the second call (contract deployed)
        } else {
          // the contract address
          console.log('contract address:', deployedContract.address);
          console.log('deployed contract:', deployedContract);
          buildContractControls(deployedContract, readOnlyMethods, mutatingMethods);
        }
      }
    )
  });
}

// on load
$(function() {
  $(window).load(function() {
    initWeb3();
    initAccessContractForm();
    initDeployContractForm();
    // hide controls for now
    $('#contract-controls-container').hide();
  });
});
