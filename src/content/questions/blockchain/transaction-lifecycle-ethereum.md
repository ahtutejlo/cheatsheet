---
ua_question: "Який повний життєвий цикл транзакції в Ethereum від підпису до фіналізації?"
en_question: "What is the full lifecycle of an Ethereum transaction from signing to finalization?"
ua_answer: |
  Транзакція в Ethereum проходить декілька етапів від створення до остаточного підтвердження. Розуміння цього процесу критичне для діагностики проблем з транзакціями та проектування надійних dApps.

  **1. Створення та підпис.** Користувач формує транзакцію (to, value, data, gasLimit, maxFeePerGas, maxPriorityFeePerGas) та підписує її приватним ключем за алгоритмом ECDSA. Підпис створює значення v, r, s, які дозволяють відновити адресу відправника без розкриття приватного ключа.

  **2. Mempool (пул очікування).** Підписана транзакція надсилається вузлу через JSON-RPC (`eth_sendRawTransaction`). Вузол перевіряє підпис, баланс, nonce і додає транзакцію в локальний mempool. Звідти вона поширюється через gossip protocol на інші вузли мережі.

  **3. Включення в блок.** Валідатор (у PoS) обирається для пропозиції блоку. Він вибирає транзакції з mempool (зазвичай за пріоритетом gas fee), виконує їх послідовно в EVM та формує блок. Порядок транзакцій важливий -- це джерело MEV (Maximal Extractable Value).

  **4. Виконання та receipt.** При виконанні EVM змінює стан (баланси, storage), генерує логи (events), та створює **transaction receipt** з результатом: статус (success/revert), використаний gas, логи. Receipt зберігається окремо від стану.

  **5. Фіналізація (PoS).** Після включення в блок транзакція проходить етапи консенсусу: **proposed** -> **attested** (2/3 валідаторів голосують за блок) -> **justified** (checkpoint epoch) -> **finalized** (наступний justified checkpoint). Фіналізація відбувається приблизно через 12-15 хвилин (2 epochs).

  ```javascript
  // Transaction lifecycle in code
  const { ethers } = require("ethers");

  // 1. Create and sign transaction
  const wallet = new ethers.Wallet(privateKey, provider);
  const tx = {
      to: "0xRecipient...",
      value: ethers.parseEther("1.0"),
      gasLimit: 21000,
      maxFeePerGas: ethers.parseUnits("30", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
  };

  // 2. Send to mempool
  const sentTx = await wallet.sendTransaction(tx);
  console.log("Tx hash:", sentTx.hash); // Known immediately

  // 3-4. Wait for inclusion and execution
  const receipt = await sentTx.wait(1); // Wait for 1 confirmation
  console.log("Status:", receipt.status); // 1 = success, 0 = revert
  console.log("Gas used:", receipt.gasUsed.toString());

  // 5. Wait for finalization (~12-15 min)
  const finalReceipt = await sentTx.wait(64); // ~64 blocks for finality
  console.log("Finalized in block:", finalReceipt.blockNumber);
  ```

  На співбесіді важливо розрізняти confirmed (включена в блок) та finalized (необоротна) транзакцію. Для DeFi-протоколів критично чекати на фіналізацію перед зарахуванням великих сум.
en_answer: |
  An Ethereum transaction goes through several stages from creation to final confirmation. Understanding this process is critical for diagnosing transaction issues and designing reliable dApps.

  **1. Creation and signing.** The user constructs a transaction (to, value, data, gasLimit, maxFeePerGas, maxPriorityFeePerGas) and signs it with their private key using the ECDSA algorithm. The signature produces v, r, s values that allow recovering the sender's address without revealing the private key.

  **2. Mempool (waiting pool).** The signed transaction is sent to a node via JSON-RPC (`eth_sendRawTransaction`). The node verifies the signature, balance, nonce, and adds the transaction to its local mempool. From there, it propagates through the gossip protocol to other network nodes.

  **3. Block inclusion.** A validator (in PoS) is selected to propose a block. They pick transactions from the mempool (usually prioritized by gas fee), execute them sequentially in the EVM, and assemble the block. Transaction ordering matters -- this is the source of MEV (Maximal Extractable Value).

  **4. Execution and receipt.** During execution, the EVM modifies state (balances, storage), generates logs (events), and creates a **transaction receipt** with the result: status (success/revert), gas used, and logs. The receipt is stored separately from state.

  **5. Finalization (PoS).** After block inclusion, the transaction goes through consensus stages: **proposed** -> **attested** (2/3 of validators vote for the block) -> **justified** (checkpoint epoch) -> **finalized** (next justified checkpoint). Finalization takes approximately 12-15 minutes (2 epochs).

  ```javascript
  // Transaction lifecycle in code
  const { ethers } = require("ethers");

  // 1. Create and sign transaction
  const wallet = new ethers.Wallet(privateKey, provider);
  const tx = {
      to: "0xRecipient...",
      value: ethers.parseEther("1.0"),
      gasLimit: 21000,
      maxFeePerGas: ethers.parseUnits("30", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
  };

  // 2. Send to mempool
  const sentTx = await wallet.sendTransaction(tx);
  console.log("Tx hash:", sentTx.hash); // Known immediately

  // 3-4. Wait for inclusion and execution
  const receipt = await sentTx.wait(1); // Wait for 1 confirmation
  console.log("Status:", receipt.status); // 1 = success, 0 = revert
  console.log("Gas used:", receipt.gasUsed.toString());

  // 5. Wait for finalization (~12-15 min)
  const finalReceipt = await sentTx.wait(64); // ~64 blocks for finality
  console.log("Finalized in block:", finalReceipt.blockNumber);
  ```

  In interviews, it is important to distinguish between a confirmed (included in a block) and finalized (irreversible) transaction. For DeFi protocols, it is critical to wait for finalization before crediting large amounts.
section: "blockchain"
order: 18
tags:
  - transactions
  - ethereum
  - consensus
type: "deep"
---
