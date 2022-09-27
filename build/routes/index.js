"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Blockchain_1 = require("../models/Blockchain");
var uuid_1 = require("uuid");
var express = require('express');
var router = express.Router();
var blockchain = new Blockchain_1.Blockchain();
var node_address = (0, uuid_1.v4)().toString().replace('-', '');
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});
router.get('/mineBlock', function (req, res) {
    var previousBlock = blockchain.getPreviousBlock();
    var previousProof = previousBlock.proof;
    var proof = blockchain.proofOfWork(previousProof);
    var previousHash = blockchain.hash(previousBlock);
    blockchain.addTransaction(node_address, 'Derek', '1');
    var block = blockchain.createBlock(proof, previousHash);
    var response = {
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
