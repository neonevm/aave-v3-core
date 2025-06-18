import rawBRE from 'hardhat';
import { initializeMakeSuite } from './helpers/make-suite';
import { ethers } from 'hardhat';

// Patch Signer.sendTransaction to always wait for the tx
const patchSigners = () => {
  const originalGetSigners = ethers.getSigners;
  ethers.getSigners = async function () {
    const signers = await originalGetSigners.call(this);
    for (const s of signers) {
      const originalSend = s.sendTransaction.bind(s);
      s.sendTransaction = async (...args) => {
        const tx = await originalSend(...args);
        await tx.wait();
        return tx;
      };
      console.log(`Patched signer ${s.address}`);
    }
    return signers;
  };
};

before(async () => {
  patchSigners();

  await rawBRE.deployments.fixture(['market']);
  console.log('-> Deployed market');

  console.log('-> Initializing test environment');
  await initializeMakeSuite();
  console.log('\n***************');
  console.log('Setup and snapshot finished');
  console.log('***************\n');
});
