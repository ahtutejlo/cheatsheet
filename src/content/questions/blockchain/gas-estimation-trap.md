---
ua_question: "Чи завжди достатньо estimated gas для виконання транзакції?"
en_question: "Is estimated gas always enough for transaction execution?"
ua_answer: |
  > **Trap:** Оцінка gas (gas estimation) завжди точна і гарантує успішне виконання транзакції.

  Насправді `eth_estimateGas` виконує транзакцію на поточному стані блокчейну і повертає кількість gas, необхідну **саме зараз**. Але між моментом оцінки та включенням транзакції в блок стан може змінитися, що зробить оцінку неточною. Це особливо критично для DeFi-операцій, де стан змінюється кожен блок.

  **Основні причини розбіжностей:** 1) Інший користувач змінив стан контракту між оцінкою та виконанням (наприклад, ціна токену в AMM змінилася). 2) Динамічні операції -- функції з циклами по масивах можуть потребувати різну кількість gas залежно від довжини масиву. 3) Conditional logic -- якщо стан впливає на гілку виконання, різні гілки можуть мати різну gas-вартість. 4) Storage refunds -- SSTORE з ненульового в нульове значення повертає gas, але правила refund змінювались (EIP-3529).

  ```javascript
  // Gas estimation pitfalls in practice
  const { ethers } = require("ethers");

  async function safeSendTransaction(contract, method, args) {
      // Step 1: Estimate gas
      const estimated = await contract[method].estimateGas(...args);

      // Step 2: Add buffer (20-30% is common practice)
      const gasLimit = estimated * 130n / 100n; // 30% buffer

      // Step 3: Send with buffered gas limit
      const tx = await contract[method](...args, { gasLimit });
      return tx.wait();
  }

  // Example: batch transfer with variable gas cost
  async function batchTransfer(token, recipients, amounts) {
      // WARNING: gas depends on number of recipients
      // and whether each recipient is a new holder (SSTORE cost)
      const estimated = await token.batchTransfer.estimateGas(
          recipients, amounts
      );

      // For batch operations, use larger buffer
      const gasLimit = estimated * 150n / 100n; // 50% buffer

      console.log(`Estimated: ${estimated}, Using: ${gasLimit}`);
      return token.batchTransfer(recipients, amounts, { gasLimit });
  }

  // Anti-pattern: unbounded loop with unpredictable gas
  // contract Airdrop {
  //     function distribute(address[] calldata users) external {
  //         for (uint i = 0; i < users.length; i++) {
  //             // Gas cost grows linearly -- may exceed block gas limit!
  //             token.transfer(users[i], amount);
  //         }
  //     }
  // }
  ```

  Практичні рекомендації: завжди додавайте буфер 20-50% до estimated gas; для операцій з динамічним gas використовуйте pagination або batch processing з фіксованим розміром; моніторте gas price через oracle для EIP-1559 транзакцій.
en_answer: |
  > **Trap:** Gas estimation is always accurate and guarantees successful transaction execution.

  In reality, `eth_estimateGas` executes the transaction against the current blockchain state and returns the gas needed **right now**. But between the estimation moment and the transaction's inclusion in a block, the state can change, making the estimate inaccurate. This is especially critical for DeFi operations where state changes every block.

  **Main causes of discrepancies:** 1) Another user changed the contract state between estimation and execution (e.g., token price in an AMM changed). 2) Dynamic operations -- functions with loops over arrays may require different gas amounts depending on array length. 3) Conditional logic -- if state affects the execution branch, different branches may have different gas costs. 4) Storage refunds -- SSTORE from non-zero to zero returns gas, but refund rules have changed (EIP-3529).

  ```javascript
  // Gas estimation pitfalls in practice
  const { ethers } = require("ethers");

  async function safeSendTransaction(contract, method, args) {
      // Step 1: Estimate gas
      const estimated = await contract[method].estimateGas(...args);

      // Step 2: Add buffer (20-30% is common practice)
      const gasLimit = estimated * 130n / 100n; // 30% buffer

      // Step 3: Send with buffered gas limit
      const tx = await contract[method](...args, { gasLimit });
      return tx.wait();
  }

  // Example: batch transfer with variable gas cost
  async function batchTransfer(token, recipients, amounts) {
      // WARNING: gas depends on number of recipients
      // and whether each recipient is a new holder (SSTORE cost)
      const estimated = await token.batchTransfer.estimateGas(
          recipients, amounts
      );

      // For batch operations, use larger buffer
      const gasLimit = estimated * 150n / 100n; // 50% buffer

      console.log(`Estimated: ${estimated}, Using: ${gasLimit}`);
      return token.batchTransfer(recipients, amounts, { gasLimit });
  }

  // Anti-pattern: unbounded loop with unpredictable gas
  // contract Airdrop {
  //     function distribute(address[] calldata users) external {
  //         for (uint i = 0; i < users.length; i++) {
  //             // Gas cost grows linearly -- may exceed block gas limit!
  //             token.transfer(users[i], amount);
  //         }
  //     }
  // }
  ```

  Practical recommendations: always add a 20-50% buffer to estimated gas; for operations with dynamic gas use pagination or batch processing with a fixed size; monitor gas price via an oracle for EIP-1559 transactions.
section: "blockchain"
order: 24
tags:
  - gas
  - transactions
  - pitfalls
type: "trick"
---
