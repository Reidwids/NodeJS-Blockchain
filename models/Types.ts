export class Block {
	index: number;
	timestamp: string;
	proof: number;
	previous_hash: string;
	transactions: Transaction[];
}

export class Transaction {
	sender: string;
	receiver: string;
	amount: string;
}
