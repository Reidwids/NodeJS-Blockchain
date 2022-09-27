export interface Block {
	index: number;
	timestamp: string;
	proof: number;
	previousHash: string;
	transactions: Transaction[];
}

export interface Transaction {
	sender: string;
	receiver: string;
	amount: string;
}
