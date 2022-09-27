import {Request, Response} from 'express';
import {Blockchain} from '../models/Blockchain';
import {v4 as uuidv4} from 'uuid';
import {Transaction} from '../models/Types';

var express = require('express');
var router = express.Router();
const blockchain = new Blockchain();
let node_address = uuidv4().toString().replace('-', '');

/* GET home page. */
router.get('/', function (req: Request, res: Response) {
  res.render('index', {title: 'Express'});
});

router.get('/mineBlock', function (req: Request, res: Response) {
  let previousBlock = blockchain.getPreviousBlock();
  let previousProof = previousBlock.proof;
  let proof = blockchain.proofOfWork(previousProof);
  let previousHash = blockchain.hash(previousBlock);
  blockchain.addTransaction(node_address, 'chain 1', '1');
  let block = blockchain.createBlock(proof, previousHash);
  let response = {
    message: 'Block mined!!!!!!',
    index: block['index'],
    'time stamp': block['timestamp'],
    proof: block['proof'],
    previous_hash: block.previousHash,
    transactions: block.transactions,
  };
  res.send(response);
});

router.get('/getChain', function (req: Request, res: Response) {
  let data = {chain: blockchain.chain, length: blockchain.chain.length};
  res.send(data);
});

router.get('/isChainValid', function (req: Request, res: Response) {
  const isValid = blockchain.isChainValid(blockchain.chain);

  console.log(isValid);
  const data = isValid
    ? {isValid: isValid, chainLength: blockchain.chain.length}
    : {isValid: isValid};

  res.send(data);
});

router.post('/addTransaction', function (req: Request, res: Response) {
  const tx: Transaction = req.body;
  if (!tx.sender || !tx.receiver || !tx.amount) {
    throw new Error('Invalid input');
  }
  const index = blockchain.addTransaction(tx.sender, tx.receiver, tx.amount);
  res.send({message: `Tx will be added to block ${index}`});
});

router.post('/connectNode', function (req: Request, res: Response) {
  const data: {nodes: string[]} = req.body;
  console.log(data);
  data.nodes.length === 0 && res.send('Invalid input - please enter a node');
  data.nodes.forEach(node => {
    blockchain.addNode(node);
  });
  console.log('BLOCKNODES: ', blockchain.nodes);
  res.send({connectedNodes: Array.from(blockchain.nodes)});
});

router.post('/replaceChain', async function (req: Request, res: Response) {
  let isChainReplaced = await blockchain.replaceChain();
  if (isChainReplaced) {
    res.send({
      message: 'Nodes had different chains - chain has been replaced',
      newChain: blockchain.chain,
    });
  } else {
    res.send({
      message: 'Chain was not updated, current chain is the longest',
      chain: blockchain.chain,
    });
  }
});

module.exports = router;
