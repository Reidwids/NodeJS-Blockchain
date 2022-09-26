import { Block, Transaction } from "../models/types";

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

class Blockchain {
	chain: Block[];
	transactions: Transaction[];
	nodes: Set<string>;

	constructor() {
		this.chain = [];
		this.transactions = [];
		this.createBlock(1, "0");
		this.nodes = new Set<string>();
	}

	createBlock(this, proof: number, previous_hash: string): Block {
		const block = {
			index: this.chain.length + 1,
			timestamp: Date.now().toString(),
			proof: proof,
			previous_hash: previous_hash,
			transactions: this.transactions,
		};
		this.transactions = [];
		this.chain.push(block);
		return block;
	}
}

module.exports = router;
