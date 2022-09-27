import axios from 'axios';
import {Block, Transaction} from './Types';
import crypto from 'crypto';

export class Blockchain {
  chain: Block[];
  transactions: Transaction[];
  nodes: Set<string>;

  constructor() {
    this.chain = [];
    this.transactions = [];
    this.createBlock(1, '0');
    this.nodes = new Set<string>();
  }

  createBlock(this: any, proof: number, previousHash: string): Block {
    const block = {
      index: this.chain.length + 1,
      timestamp: Date.now().toString(),
      proof: proof,
      previousHash: previousHash,
      transactions: this.transactions,
    };
    this.transactions = [];
    this.chain.push(block);
    return block;
  }

  getPreviousBlock(this: any) {
    return this.chain[-1];
  }

  proofOfWork(this: any, previousProof: number) {
    let newProof = 1;
    let checkProof = false;
    while (checkProof === false) {
      // CHECK DIGEST AFTER HASH OP
      let hashOperation = crypto
        .createHash('sha256')
        .update((newProof ** 2 - previousProof ** 2).toString())
        .digest('hex');

      if (hashOperation.slice(0, 4) == '0000') {
        checkProof = true;
      } else {
        newProof += 1;
      }
    }
    return newProof;
  }

  hash(this: any, block: Block) {
    let encodedBlock = JSON.stringify(block);
    return crypto.createHash('sha256').update(encodedBlock).digest('hex');
  }

  isChainValid(this: any, chain: Block[]) {
    let previousBlock = chain[0];
    let blockIndex = 1;
    while (blockIndex < chain.length) {
      let block = chain[blockIndex];
      if (block.previousHash != this.hash(previousBlock)) {
        return false;
      }
      let previousProof = previousBlock.proof;
      let proof = block.proof;
      let hashOperation = crypto
        .createHash('sha256')
        .update((proof ** 2 - previousProof ** 2).toString())
        .digest('hex');
      if (hashOperation.slice(0, 4) != '0000') {
        return false;
      }
      previousBlock = block;
      blockIndex += 1;
      return true;
    }
  }

  addTransaction(this: any, sender: string, receiver: string, amount: string) {
    this.transactions.push({
      sender: sender,
      receiver: receiver,
      amount: amount,
    });
    let previousBlock = this.getPreviousBlock();
    return previousBlock.index + 1;
  }

  addNode(this: any, address: string) {
    let parsedUrl = new URL(address);
    this.nodes.add(parsedUrl.hostname);
  }

  async replaceChain(this: any) {
    let network = this.nodes;
    let longestChain = null;
    let maxLength = this.chain.length;
    for (let node in network) {
      let response: {chain: Block[]; length: number; status: number} =
        await axios.get(`http://${node}/get_chain`);

      if (response.status == 200) {
        let length = response.length;
        let chain = response.chain;
        if (length > maxLength && this.isChainValid(chain)) {
          maxLength = length;
          longestChain = chain;
        }
      }
    }
    if (longestChain) {
      this.chain = longestChain;
      return true;
    }
    return false;
  }
}
