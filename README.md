# Dutch Auction Dapp

Implemented a Dutch auction using Ethereum. This contract will implement the auction of a single offering and will take four parameters at the time of creation:
the initial price
the number of blocks the auction will be open for, including the block in which the auction is created. That is, the auction starts immediately.
the (constant) rate at which the price decrements per block.

In a Dutch auction the price gets cheaper the longer the auction is open for.
whether or not the auction is in “test mode” enabling the time to be manually overridden.
Once created, any address can submit a bid by calling the bid() function for this contract. When a bid is received, the contract calculates the current price by querying the current block number and applying the specified rate of decline in price to the original price. The first bid which sends a quantity greater than or equal to the current price is the winner. Any invalid bids should be refunded immediately. The auction’s creator can call finalize() after completion to destroy the contract and collect its funds.

Starter repo for the Dutch Auction project.

Tools being used:
* [Web3](https://github.com/ethereum/wiki/wiki/JavaScript-API)
* [jQuery](http://api.jquery.com/)
* [Materialize](http://materializecss.com/getting-started.html)

## Instructions
1. Write your contract in [Remix](https://remix.ethereum.org).
2. Open `src/index.html` in the [Chrome](https://www.google.com/chrome/browser/desktop/index.html) browser, make sure you have [MetaMask](https://metamask.io/) installed.
3. Deploy your contract from Remix or from the "Deploy Contract" form on the Dapp to the network of your choosing (we're using Rinkeby).
4. Interact with your contract!

## Development
If you'd like to run the `lite-server` development server for front-end hot reloading, install dependencies and run the dev task with the following terminal commands:
  ```javascript
  $ npm install
  $ npm run dev
  ```

The app will be served at [localhost:3001](http://localhost:30001).
