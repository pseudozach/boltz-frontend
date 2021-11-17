import axios from 'axios';
import BigNumber from 'bignumber.js';
import {
  boltzApi,
  bitcoinNetwork,
  litecoinNetwork,
  bitcoinExplorer,
  litecoinExplorer,
  bitcoinAddress,
  litecoinAddress,
  bitcoinInvoice,
  litecoinInvoice,
  // erc20tokenaddress,
  // rbtcswapaddress,
  // erc20swapaddress,
} from '../constants';

import Web3 from 'web3';
import Web3Modal from 'web3modal';

// import { ContractABIs } from 'boltz-core';
// // @ts-ignore
// import { ERC20 } from 'boltz-core/typechain/ERC20';
// import { ERC20Swap } from 'boltz-core/typechain/ERC20Swap';
// import { EtherSwap } from 'boltz-core/typechain/EtherSwap';
// import { Signer, providers, Contract, Wallet } from 'ethers';
import { BigNumber as BN } from 'ethers';

import lightningPayReq from 'bolt11';

export const lockFunds = async (swapInfo, swapResponse) => {
  // const providerOptions = {
  //   /* See Provider Options Section */
  // };

  const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    // cacheProvider: true, // optional
    // providerOptions // required
  });
  // console.log("web3modal defined");
  const provider = await web3Modal.connect();
  // console.log("web3 provider ready: ", provider);

  const web3 = new Web3(provider);
  // console.log("web3 ready: ", web3);

  console.log('lockFunds swapInfo, swapResponse ', swapInfo, swapResponse);

  // const signer = this.connectEthereum(this.provider, this.provider.address);
  // const { etherSwap, erc20Swap, token } = this.getContracts(signer);

  var decoded = lightningPayReq.decode(swapInfo.invoice);
  // console.log("decoded: ", decoded);

  var obj = decoded.tags;
  for (let index = 0; index < obj.length; index++) {
    const tag = obj[index];
    // console.log("tag: ", tag);
    if (tag.tagName == 'payment_hash') {
      console.log('yay: ', tag.data);
      var paymenthash = tag.data;
    }
  }
  console.log('paymenthash: ', paymenthash);

  // const preimageHash = getHexBuffer(paymenthash);
  var preimageHashbuffer = Buffer.from(paymenthash, 'hex');
  console.log('getHexBuffer preimageHash ', paymenthash);
  console.log('preimageHashbuffer ', preimageHashbuffer);
  const amount = BN.from(swapResponse.expectedAmount).mul(etherDecimals);
  console.log('amount ', amount);

  const timeout = web3.utils.numberToHex(swapResponse.timeoutBlockHeight);
  console.log('timeout ', timeout);

  console.log(
    'web3.eth.accounts.currentProvider.selectedAddress ',
    web3.eth.accounts.currentProvider.selectedAddress
  );

  // const boltzAddress = "await getBoltzAddress()";
  // console.log("boltzAddress: ", boltzAddress);

  // if (boltzAddress === undefined) {
  //   console.log('Could not lock coins because the address of Boltz could not be queried');
  //   return;
  // }

  // rbtcswap
  // preimageHash: BytesLike,
  // claimAddress: string,
  // timelock: BigNumberish,

  var rbtcswapabi = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'preimage',
          type: 'bytes32',
        },
      ],
      name: 'Claim',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'claimAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'refundAddress',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'Lockup',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
      ],
      name: 'Refund',
      type: 'event',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'preimage', type: 'bytes32' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'address', name: 'refundAddress', type: 'address' },
        { internalType: 'uint256', name: 'timelock', type: 'uint256' },
      ],
      name: 'claim',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'preimageHash', type: 'bytes32' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'address', name: 'claimAddress', type: 'address' },
        { internalType: 'address', name: 'refundAddress', type: 'address' },
        { internalType: 'uint256', name: 'timelock', type: 'uint256' },
      ],
      name: 'hashValues',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'preimageHash', type: 'bytes32' },
        { internalType: 'address', name: 'claimAddress', type: 'address' },
        { internalType: 'uint256', name: 'timelock', type: 'uint256' },
      ],
      name: 'lock',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'preimageHash', type: 'bytes32' },
        {
          internalType: 'address payable',
          name: 'claimAddress',
          type: 'address',
        },
        { internalType: 'uint256', name: 'timelock', type: 'uint256' },
        { internalType: 'uint256', name: 'prepayAmount', type: 'uint256' },
      ],
      name: 'lockPrepayMinerfee',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'preimageHash', type: 'bytes32' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'address', name: 'claimAddress', type: 'address' },
        { internalType: 'uint256', name: 'timelock', type: 'uint256' },
      ],
      name: 'refund',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      name: 'swaps',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'version',
      outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      stateMutability: 'view',
      type: 'function',
    },
  ];
  // rbtcswapaddress
  var rbtcswapcontract = new web3.eth.Contract(
    rbtcswapabi,
    swapResponse.address
  );
  console.log(
    'rbtc locking with ',
    preimageHashbuffer,
    swapResponse.claimAddress.toLowerCase(),
    timeout,
    'to contract ',
    swapResponse.address
  );
  // , chainId: 33
  rbtcswapcontract.methods
    .lock(preimageHashbuffer, swapResponse.claimAddress.toLowerCase(), timeout)
    .send(
      {
        from: web3.eth.accounts.currentProvider.selectedAddress,
        value: amount,
      },
      function(error, transactionHash) {
        console.log('error: ', error);
        console.log('transactionHash: ', transactionHash);
      }
    );

  // erc20 - tokenswap part
  // preimageHash: BytesLike,
  // amount: BigNumberish,
  // tokenAddress: string,
  // claimAddress: string,
  // timelock: BigNumberish,

  // var erc20swapabi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"preimage","type":"bytes32"}],"name":"Claim","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"address","name":"claimAddress","type":"address"},{"indexed":true,"internalType":"address","name":"refundAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"Lockup","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"}],"name":"Refund","type":"event"},{"inputs":[{"internalType":"bytes32","name":"preimage","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"refundAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"address","name":"refundAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"hashValues","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address payable","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"lockPrepayMinerfee","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"refund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"swaps","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}];
  // var erc20swapcontract = new web3.eth.Contract(erc20swapabi, erc20swapaddress);
  // console.log(erc20swapcontract)

  // erc20swapcontract.lock.sendTransaction("parameter_1","parameter_2","parameter_n",{
  //   from:web3.eth.accounts[0],
  //   gas:4000000},function (error, result){ //get callback from function which is your transaction key
  //       if(!error){
  //           console.log(result);
  //       } else{
  //           console.log(error);
  //       }
  // });

  // console.log("locking with ", preimageHashbuffer, amount, erc20tokenaddress, swapResponse.claimAddress, timeout);
  // erc20swapcontract.methods.lock(preimageHashbuffer, amount, erc20tokenaddress, swapResponse.claimAddress, timeout).send({from: web3.eth.accounts.currentProvider.selectedAddress, chainId: 33}, function(error, transactionHash){
  //   console.log("error: ", error);
  //   console.log("transactionHash: ", transactionHash);
  // });

  //       "preimageHash",
  //       "amount",
  //       "tokenAddress",
  //       "claimAddress",
  //       "timelock"

  // let transaction;
  // : ContractTransaction;

  // if (argv.token) {
  //   console.log("rsk erc20Swap.lock to erc20SwapAddress: ", Constants.erc20SwapAddress);
  //   await token.approve(Constants.erc20SwapAddress, amount);
  //   console.log("rsk erc20Swap.lock after approve: ", preimageHash, amount, Constants.erc20TokenAddress, boltzAddress, argv.timelock);
  //   transaction = await erc20Swap.lock(
  //     preimageHash,
  //     amount,
  //     Constants.erc20TokenAddress,
  //     boltzAddress,
  //     argv.timelock,
  //   );
  // } else {
  //   console.log("rsk etherSwap.lock to claimAddress: ", boltzAddress);
  //   transaction = await etherSwap.lock(
  //     preimageHash,
  //     boltzAddress,
  //     argv.timelock,
  //     {
  //       value: amount,
  //     },
  //   );
  // }

  // await transaction.wait(1);
  // console.log(`Sent ${argv.token ? 'ERC20 token' : 'Rbtc'} in: ${transaction.hash}`);
};

export const lockTokens = async (swapInfo, swapResponse) => {
  // const providerOptions = {
  //   /* See Provider Options Section */
  // };

  const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    // cacheProvider: true, // optional
    // providerOptions // required
  });
  // console.log("web3modal defined");
  const provider = await web3Modal.connect();
  // console.log("web3 provider ready: ", provider);

  const web3 = new Web3(provider);
  // console.log("web3 ready: ", web3);

  console.log('lockTokens swapInfo, swapResponse ', swapInfo, swapResponse);

  // const signer = this.connectEthereum(this.provider, this.provider.address);
  // const { etherSwap, erc20Swap, token } = this.getContracts(signer);

  var decoded = lightningPayReq.decode(swapInfo.invoice);
  // console.log("decoded: ", decoded);

  var obj = decoded.tags;
  for (let index = 0; index < obj.length; index++) {
    const tag = obj[index];
    // console.log("tag: ", tag);
    if (tag.tagName == 'payment_hash') {
      console.log('yay: ', tag.data);
      var paymenthash = tag.data;
    }
  }
  console.log('paymenthash: ', paymenthash);

  // const preimageHash = getHexBuffer(paymenthash);
  var preimageHashbuffer = Buffer.from(paymenthash, 'hex');
  console.log('getHexBuffer preimageHash ', paymenthash);
  console.log('preimageHashbuffer ', preimageHashbuffer);
  // const amount = BN.from(swapResponse.expectedAmount).div(etherDecimals);
  // const amount = BN.from(swapResponse.expectedAmount).div(zdecimals);
  const amount = BN.from(swapResponse.expectedAmount).mul(etherDecimals);
  console.log('amount ', amount, swapResponse.expectedAmount);

  const timeout = web3.utils.numberToHex(swapResponse.timeoutBlockHeight);
  console.log('timeout ', timeout);

  console.log(
    'web3.eth.accounts.currentProvider.selectedAddress ',
    web3.eth.accounts.currentProvider.selectedAddress
  );

  const tokenAddress = Buffer.from(swapResponse.redeemScript, 'hex').toString(
    'utf8'
  );
  console.log('tokenAddress: ', tokenAddress);
  // const boltzAddress = "await getBoltzAddress()";
  // console.log("boltzAddress: ", boltzAddress);

  // if (boltzAddress === undefined) {
  //   console.log('Could not lock coins because the address of Boltz could not be queried');
  //   return;
  // }

  // rbtcswap
  // preimageHash: BytesLike,
  // claimAddress: string,
  // timelock: BigNumberish,

  var erc20tokenabi = [
    {
      inputs: [],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      inputs: [],
      name: 'DOMAIN_SEPARATOR',
      outputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'PERMIT_TYPEHASH',
      outputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_spender',
          type: 'address',
        },
      ],
      name: 'allowance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_owner',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'name',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'nonces',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'deadline',
          type: 'uint256',
        },
        {
          internalType: 'uint8',
          name: 'v',
          type: 'uint8',
        },
        {
          internalType: 'bytes32',
          name: 'r',
          type: 'bytes32',
        },
        {
          internalType: 'bytes32',
          name: 's',
          type: 'bytes32',
        },
      ],
      name: 'permit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'transfer',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_from',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_value',
          type: 'uint256',
        },
      ],
      name: 'transferFrom',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];

  var erc20tokencontract = new web3.eth.Contract(erc20tokenabi, tokenAddress);

  var erc20swapabi = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'preimage',
          type: 'bytes32',
        },
      ],
      name: 'Claim',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'claimAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'refundAddress',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'Lockup',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
      ],
      name: 'Refund',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'preimage',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'refundAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'claim',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'claimAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'refundAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'hashValues',
      outputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'claimAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'lock',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'address payable',
          name: 'claimAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'lockPrepayMinerfee',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'claimAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'refund',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      name: 'swaps',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'version',
      outputs: [
        {
          internalType: 'uint8',
          name: '',
          type: 'uint8',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ];
  // erc20swapaddress
  var erc20swapcontract = new web3.eth.Contract(
    erc20swapabi,
    swapResponse.address
  );
  console.log(
    'erc20 approving ',
    amount + ' on token ' + tokenAddress,
    'erc20 locking with ',
    preimageHashbuffer,
    amount,
    tokenAddress.toLowerCase(),
    swapResponse.claimAddress.toLowerCase(),
    timeout,
    'to contract ',
    swapResponse.address
  );
  // , chainId: 33
  let lastBlockGasLimit = web3.eth.getBlock('latest').gasLimit || 0;
  let gasLimit = Math.max(lastBlockGasLimit, 100000);

  erc20tokencontract.methods.approve(swapResponse.address, amount).send(
    {
      from: web3.eth.accounts.currentProvider.selectedAddress,
      gas: gasLimit,
    },
    function(error, transactionHash) {
      console.log('approve error: ', error);
      console.log('approve transactionHash: ', transactionHash);

      erc20swapcontract.methods
        .lock(
          preimageHashbuffer,
          amount,
          tokenAddress.toLowerCase(),
          swapResponse.claimAddress.toLowerCase(),
          timeout
        )
        .send(
          {
            from: web3.eth.accounts.currentProvider.selectedAddress,
            gas: gasLimit,
          },
          function(error, transactionHash) {
            console.log('lock error: ', error);
            console.log('lock transactionHash: ', transactionHash);
          }
        );
    }
  );
};

export const claimFunds = async (swapInfo, swapResponse) => {
  // const providerOptions = {
  //   /* See Provider Options Section */
  // };

  const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    // cacheProvider: true, // optional
    // providerOptions // required
  });
  // console.log("web3modal defined");
  const provider = await web3Modal.connect();
  // console.log("web3 provider ready: ", provider);

  const web3 = new Web3(provider);
  // console.log("web3 ready: ", web3);

  console.log('claimFunds swapInfo, swapResponse ', swapInfo, swapResponse);

  // const signer = this.connectEthereum(this.provider, this.provider.address);
  // const { etherSwap, erc20Swap, token } = this.getContracts(signer);

  // var decoded = lightningPayReq.decode(swapInfo.invoice)
  // // console.log("decoded: ", decoded);

  // var obj = decoded.tags;
  // for (let index = 0; index < obj.length; index++) {
  //     const tag = obj[index];
  //     // console.log("tag: ", tag);
  //     if(tag.tagName == "payment_hash"){
  //         console.log("yay: ", tag.data);
  //         var paymenthash = tag.data;
  //     }
  // }
  // console.log("paymenthash: ", paymenthash);

  const preimage = getHexBuffer(swapInfo.preimage);
  var preimageBuffer = Buffer.from(preimage, 'hex');
  // console.log("getHexBuffer preimage ", paymenthash)
  console.log('preimageBuffer ', preimageBuffer);
  const amount = BN.from(swapResponse.onchainAmount).mul(etherDecimals);
  console.log('amount ', amount);

  const timeout = web3.utils.numberToHex(swapResponse.timeoutBlockHeight);
  console.log('timeout ', timeout);

  console.log(
    'web3.eth.accounts.currentProvider.selectedAddress ',
    web3.eth.accounts.currentProvider.selectedAddress
  );

  // const boltzAddress = "await getBoltzAddress()";
  // console.log("boltzAddress: ", boltzAddress);

  // if (boltzAddress === undefined) {
  //   console.log('Could not lock coins because the address of Boltz could not be queried');
  //   return;
  // }

  // rbtcswap
  // preimageHash: BytesLike,
  // claimAddress: string,
  // timelock: BigNumberish,

  var rbtcswapabi = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'preimage',
          type: 'bytes32',
        },
      ],
      name: 'Claim',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'claimAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'refundAddress',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'Lockup',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
      ],
      name: 'Refund',
      type: 'event',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'preimage', type: 'bytes32' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'address', name: 'refundAddress', type: 'address' },
        { internalType: 'uint256', name: 'timelock', type: 'uint256' },
      ],
      name: 'claim',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'preimageHash', type: 'bytes32' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'address', name: 'claimAddress', type: 'address' },
        { internalType: 'address', name: 'refundAddress', type: 'address' },
        { internalType: 'uint256', name: 'timelock', type: 'uint256' },
      ],
      name: 'hashValues',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'preimageHash', type: 'bytes32' },
        { internalType: 'address', name: 'claimAddress', type: 'address' },
        { internalType: 'uint256', name: 'timelock', type: 'uint256' },
      ],
      name: 'lock',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'preimageHash', type: 'bytes32' },
        {
          internalType: 'address payable',
          name: 'claimAddress',
          type: 'address',
        },
        { internalType: 'uint256', name: 'timelock', type: 'uint256' },
        { internalType: 'uint256', name: 'prepayAmount', type: 'uint256' },
      ],
      name: 'lockPrepayMinerfee',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'preimageHash', type: 'bytes32' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
        { internalType: 'address', name: 'claimAddress', type: 'address' },
        { internalType: 'uint256', name: 'timelock', type: 'uint256' },
      ],
      name: 'refund',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      name: 'swaps',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'version',
      outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      stateMutability: 'view',
      type: 'function',
    },
  ];
  // rbtcswapaddress
  var rbtcswapcontract = new web3.eth.Contract(
    rbtcswapabi,
    swapResponse.lockupAddress
  );
  console.log(
    'rbtc claiming with ',
    preimageBuffer,
    amount,
    swapResponse.refundAddress,
    timeout,
    ' from contract ',
    swapResponse.lockupAddress
  );
  // , chainId: 33
  let lastBlockGasLimit = web3.eth.getBlock('latest').gasLimit || 0;
  let gasLimit = Math.max(lastBlockGasLimit, 100000);
  console.log('lastBlockGasLimit, gasLimit: ', lastBlockGasLimit, gasLimit);
  rbtcswapcontract.methods
    .claim(preimageBuffer, amount, swapResponse.refundAddress, timeout)
    .send(
      {
        from: web3.eth.accounts.currentProvider.selectedAddress,
        gas: gasLimit,
      },
      function(error, transactionHash) {
        console.log('error: ', error);
        console.log('transactionHash: ', transactionHash);
      }
    );
};

export const claimTokens = async (swapInfo, swapResponse) => {
  // const providerOptions = {
  //   /* See Provider Options Section */
  // };

  const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    // cacheProvider: true, // optional
    // providerOptions // required
  });
  // console.log("web3modal defined");
  const provider = await web3Modal.connect();
  // console.log("web3 provider ready: ", provider);

  const web3 = new Web3(provider);
  // console.log("web3 ready: ", web3);

  console.log('claimTokens swapInfo, swapResponse ', swapInfo, swapResponse);

  // const signer = this.connectEthereum(this.provider, this.provider.address);
  // const { etherSwap, erc20Swap, token } = this.getContracts(signer);

  // var decoded = lightningPayReq.decode(swapInfo.invoice)
  // // console.log("decoded: ", decoded);

  // var obj = decoded.tags;
  // for (let index = 0; index < obj.length; index++) {
  //     const tag = obj[index];
  //     // console.log("tag: ", tag);
  //     if(tag.tagName == "payment_hash"){
  //         console.log("yay: ", tag.data);
  //         var paymenthash = tag.data;
  //     }
  // }
  // console.log("paymenthash: ", paymenthash);

  const preimage = getHexBuffer(swapInfo.preimage);
  var preimageBuffer = Buffer.from(preimage, 'hex');
  // console.log("getHexBuffer preimage ", paymenthash)
  console.log('preimageBuffer ', preimageBuffer);
  const amount = BN.from(swapResponse.onchainAmount).mul(etherDecimals);
  console.log('amount ', amount);

  const timeout = web3.utils.numberToHex(swapResponse.timeoutBlockHeight);
  console.log('timeout ', timeout);

  console.log(
    'web3.eth.accounts.currentProvider.selectedAddress ',
    web3.eth.accounts.currentProvider.selectedAddress
  );

  const tokenAddress = Buffer.from(swapResponse.redeemScript, 'hex').toString(
    'utf8'
  );
  console.log('tokenAddress: ', tokenAddress);

  // const boltzAddress = "await getBoltzAddress()";
  // console.log("boltzAddress: ", boltzAddress);

  // if (boltzAddress === undefined) {
  //   console.log('Could not lock coins because the address of Boltz could not be queried');
  //   return;
  // }

  // rbtcswap
  // preimageHash: BytesLike,
  // claimAddress: string,
  // timelock: BigNumberish,

  var erc20swapabi = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'preimage',
          type: 'bytes32',
        },
      ],
      name: 'Claim',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'claimAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'refundAddress',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'Lockup',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
      ],
      name: 'Refund',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'preimage',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'refundAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'claim',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'claimAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'refundAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'hashValues',
      outputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'claimAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'lock',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'address payable',
          name: 'claimAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'lockPrepayMinerfee',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'preimageHash',
          type: 'bytes32',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'claimAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'timelock',
          type: 'uint256',
        },
      ],
      name: 'refund',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      name: 'swaps',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'version',
      outputs: [
        {
          internalType: 'uint8',
          name: '',
          type: 'uint8',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ];
  // erc20swapaddress
  var erc20swapcontract = new web3.eth.Contract(
    erc20swapabi,
    swapResponse.lockupAddress
  );
  console.log(
    'erc20 claiming with ',
    preimageBuffer,
    amount,
    swapResponse.refundAddress,
    timeout,
    ' from contract ',
    swapResponse.lockupAddress
  );
  // , chainId: 33
  let lastBlockGasLimit = web3.eth.getBlock('latest').gasLimit || 0;
  let gasLimit = Math.max(lastBlockGasLimit, 100000);
  console.log('lastBlockGasLimit, gasLimit: ', lastBlockGasLimit, gasLimit);
  // TODO: need to add tokenaddress to clientside somehow
  erc20swapcontract.methods
    .claim(
      preimageBuffer,
      amount,
      tokenAddress,
      swapResponse.refundAddress,
      timeout
    )
    .send(
      {
        from: web3.eth.accounts.currentProvider.selectedAddress,
        gas: gasLimit,
      },
      function(error, transactionHash) {
        console.log('error: ', error);
        console.log('transactionHash: ', transactionHash);
      }
    );
};

// Decimals from WEI to 10 ** -8
export const etherDecimals = BN.from(10).pow(BN.from(10));

// Decimals from GWEI to WEI
export const gweiDecimals = BN.from(10).pow(BN.from(9));

export const decimals = new BigNumber('100000000');

export const zdecimals = BN.from(10).pow(BN.from(8));

/**
 * Get a hex encoded string from a Buffer
 *
 * @param input {Buffer} input
 * @returns a hex encoded string
 */
export const getHexString = input => {
  return input.toString('hex');
};

/**
 * Get a hex encoded Buffer from a string
 *
 * @param input {string} input
 * @returns a hex encoded Buffer
 */
export const getHexBuffer = input => {
  return Buffer.from(input, 'hex');
};

/**
 * Get the quote and base asset of a pair id
 */
export const splitPairId = pairId => {
  const split = pairId.split('/');

  return {
    base: split[0],
    quote: split[1],
  };
};

/**
 * Round a amount to 8 decimals and trims unnecessary zeros
 */
export const roundWholeCoins = coins => {
  return Number(coins.toFixed(8));
};

/**
 * Convert satoshis and litoshis to whole coins
 */
export const toWholeCoins = satoshis => {
  return roundWholeCoins(satoshis / decimals);
};

/**
 * Convert whole coins into satoshis or litoshis
 */
export const toSatoshi = coins => {
  return Math.floor(coins * decimals);
};

/**
 * Get the full name of a symbol
 */
export const getCurrencyName = symbol => {
  return symbol;
  // return symbol === 'BTC' ? 'Bitcoin' : 'Litecoin';
};

/**
 * Get the name of the smallest denomination of a currency
 */
export const getSmallestDenomination = symbol => {
  return symbol === 'BTC' ? 'satoshis' : 'litoshis';
};

// TODO: refactor how we copy
/**
 * Copy the content of the element "copy" into the clipboard
 */
export const copyToClipBoard = () => {
  const range = document.createRange();
  range.selectNodeContents(document.getElementById('copy'));

  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);

  document.execCommand('copy');
};

/**
 * Get the network for a symbol
 */
export const getNetwork = symbol => {
  return symbol === 'BTC' ? bitcoinNetwork : litecoinNetwork;
};

/**
 * Get the block explorer URL for a symbol
 */
export const getExplorer = symbol => {
  return symbol === 'BTC' ? bitcoinExplorer : litecoinExplorer;
};

/**
 * Get a sample address for a symbol
 */
export const getSampleAddress = symbol => {
  return symbol === 'BTC' ? bitcoinAddress : litecoinAddress;
};

/**
 * Get a sample invoice for a symbol
 */
export const getSampleInvoice = symbol => {
  return symbol === 'BTC' ? bitcoinInvoice : litecoinInvoice;
};

/**
 * Get the fee estimation from the Boltz API
 */
export const getFeeEstimation = callback => {
  const url = `${boltzApi}/getfeeestimation`;
  return () => {
    axios
      .get(url)
      // .then(response => callback(response.data))
      .then(response => callback(response))
      .catch(error => {
        console.log('some issue with fee estimation... ', error);
        callback({ BTC: 2, RBTC: 0, ETH: 0 });
        // window.alert(
        //   `Failed to get fee estimations: ${error.response.data.error}`
        // );
      });
  };
};

/**
 * Detect whether the browser is a mobile one
 */
export const isMobileBrowser = () => {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
};

/**
 * @param {{message: string, title: string }} info title and message
 * @param {number} alertType type of alert
 */
export const notificationData = (info, alertType) => {
  let type;
  switch (alertType) {
    case 0:
      type = 'danger';
      break;
    case 1:
      type = 'warning';
      break;
    default:
      type = 'success';
      break;
  }

  return {
    message: info.message,
    title: info.title,
    type,
    insert: 'top-left',
    container: 'top-left',
    animationIn: ['animated', 'fadeIn'],
    animationOut: ['animated', 'fadeOut'],
    dismiss: { duration: 3500 },
    dismissable: { click: true },
  };
};

/**
 * Formats a number so that it is shown in decimal form without trailing zeros
 */
export const formatAmount = number => {
  return number.toFixed(8).replace(/\.?0+$/, '');
};
