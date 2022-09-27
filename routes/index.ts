import {Request, Response} from 'express';
import {Blockchain} from '../models/Blockchain';
import {v4 as uuidv4} from 'uuid';

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
  blockchain.addTransaction(node_address, 'Derek', '1');
  let block = blockchain.createBlock(proof, previousHash);
  let response = {
    message: 'Block mined!!!!!!',
    index: block['index'],
    'time stamp': block['timestamp'],
    proof: block['proof'],
    previous_hash: block.previousHash,
    transactions: block.transactions,
  };
  res.send(JSON.stringify(response));
});

module.exports = router;
