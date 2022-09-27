"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
var axios_1 = __importDefault(require("axios"));
var crypto_1 = __importDefault(require("crypto"));
var Blockchain = /** @class */ (function () {
    function Blockchain() {
        this.chain = [];
        this.transactions = [];
        this.createBlock(1, '0');
        this.nodes = new Set();
    }
    Blockchain.prototype.createBlock = function (proof, previousHash) {
        var block = {
            index: this.chain.length + 1,
            timestamp: Date.now().toString(),
            proof: proof,
            previousHash: previousHash,
            transactions: this.transactions,
        };
        this.transactions = [];
        this.chain.push(block);
        return block;
    };
    Blockchain.prototype.getPreviousBlock = function () {
        console.log('CHAIN: ', this.chain);
        return this.chain[this.chain.length - 1];
    };
    Blockchain.prototype.proofOfWork = function (previousProof) {
        var newProof = 1;
        var checkProof = false;
        while (checkProof === false) {
            // CHECK DIGEST AFTER HASH OP
            var hashOperation = crypto_1.default
                .createHash('sha256')
                .update((Math.pow(newProof, 2) - Math.pow(previousProof, 2)).toString())
                .digest('hex');
            if (hashOperation.slice(0, 4) == '0000') {
                checkProof = true;
            }
            else {
                newProof += 1;
            }
        }
        return newProof;
    };
    Blockchain.prototype.hash = function (block) {
        var encodedBlock = JSON.stringify(block);
        return crypto_1.default.createHash('sha256').update(encodedBlock).digest('hex');
    };
    Blockchain.prototype.isChainValid = function (chain) {
        var previousBlock = chain[0];
        var blockIndex = 1;
        while (blockIndex < chain.length) {
            var block = chain[blockIndex];
            if (block.previousHash != this.hash(previousBlock)) {
                return false;
            }
            var previousProof = previousBlock.proof;
            var proof = block.proof;
            var hashOperation = crypto_1.default
                .createHash('sha256')
                .update((Math.pow(proof, 2) - Math.pow(previousProof, 2)).toString())
                .digest('hex');
            if (hashOperation.slice(0, 4) != '0000') {
                return false;
            }
            previousBlock = block;
            blockIndex += 1;
            return true;
        }
    };
    Blockchain.prototype.addTransaction = function (sender, receiver, amount) {
        this.transactions.push({
            sender: sender,
            receiver: receiver,
            amount: amount,
        });
        var previousBlock = this.getPreviousBlock();
        return previousBlock.index + 1;
    };
    Blockchain.prototype.addNode = function (address) {
        var parsedUrl = new URL(address);
        this.nodes.add(parsedUrl.hostname);
    };
    Blockchain.prototype.replaceChain = function () {
        return __awaiter(this, void 0, void 0, function () {
            var network, longestChain, maxLength, _a, _b, _i, node, response, length, chain;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        network = this.nodes;
                        longestChain = null;
                        maxLength = this.chain.length;
                        _a = [];
                        for (_b in network)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        node = _a[_i];
                        return [4 /*yield*/, axios_1.default.get("http://".concat(node, "/get_chain"))];
                    case 2:
                        response = _c.sent();
                        if (response.status == 200) {
                            length = response.length;
                            chain = response.chain;
                            if (length > maxLength && this.isChainValid(chain)) {
                                maxLength = length;
                                longestChain = chain;
                            }
                        }
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (longestChain) {
                            this.chain = longestChain;
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    return Blockchain;
}());
exports.Blockchain = Blockchain;
