import { BigNumber } from '@ethersproject/bignumber';
import * as fs from 'fs';
import * as path from 'path';

class Report {
  name: string;
  actions: Array<{ name: string; usedGas: number; gasPrice: number | BigNumber; tx: string }>;

  constructor(name: string) {
    this.name = name;
    this.actions = [];
  }

  addAction(name: string, usedGas: number, gasPrice: number | BigNumber, tx: string): void {
    if (gasPrice instanceof BigNumber) {
      gasPrice = gasPrice.toNumber();
    }
    this.actions.push({
      name: name,
      usedGas: usedGas,
      gasPrice: gasPrice,
      tx: tx,
    });
  }

  saveToJSON(prefix: string): void {
    const data = { name: this.name, actions: this.actions };
    const basePath = path.resolve(__dirname, '../');
    fs.writeFileSync(`${basePath}/${prefix}-report.json`, JSON.stringify(data, null, 2));
  }
}

export default Report;
