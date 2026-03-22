---
ua_question: "Як працюють крос-чейн мости та які існують моделі безпеки?"
en_question: "How do cross-chain bridges work and what security models exist?"
ua_answer: |
  **Крос-чейн мости** -- це протоколи, що дозволяють переміщувати активи та дані між різними блокчейнами. Оскільки блокчейни за замовчуванням ізольовані, мости вирішують проблему інтероперабельності, але водночас створюють нові вектори атак.

  **Lock-and-Mint** -- найпоширеніший механізм. Користувач блокує (lock) токени у контракті на вихідному ланцюгу. Міст верифікує блокування та створює (mint) еквівалентну кількість "обгорнутих" (wrapped) токенів на цільовому ланцюгу. При поверненні wrapped-токени спалюються (burn), а оригінальні розблоковуються. **Burn-and-Mint** працює аналогічно, але токени на вихідному ланцюгу спалюються, а на цільовому створюються нові (підходить для нативних крос-чейн токенів).

  **Моделі верифікації** визначають рівень безпеки моста. **Зовнішні валідатори (multisig/MPC)** -- група довірених підписантів підтверджує крос-чейн повідомлення; це найпростіше, але вразливе до компрометації ключів (Ronin Bridge, $625M). **Light client verification** -- контракт на цільовому ланцюгу верифікує заголовки блоків вихідного ланцюга; найбезпечніше, але дороге за gas. **Optimistic verification** -- повідомлення приймаються за замовчуванням, але є період оскарження (fraud proof); баланс між безпекою та швидкістю.

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  // Simplified lock-and-mint bridge (source chain side)
  contract BridgeLock {
      mapping(bytes32 => bool) public processedDeposits;
      uint256 public depositNonce;

      event Deposit(
          address indexed token,
          address indexed sender,
          uint256 amount,
          uint256 destChainId,
          uint256 nonce
      );

      function lock(
          address token,
          uint256 amount,
          uint256 destChainId
      ) external {
          IERC20(token).transferFrom(msg.sender, address(this), amount);
          depositNonce++;
          emit Deposit(token, msg.sender, amount, destChainId, depositNonce);
      }

      // Called by relayers with proof from destination chain
      function unlock(
          address token,
          address recipient,
          uint256 amount,
          bytes32 proofHash,
          bytes calldata proof
      ) external {
          require(!processedDeposits[proofHash], "Already processed");
          require(verifyProof(proofHash, proof), "Invalid proof");
          processedDeposits[proofHash] = true;
          IERC20(token).transfer(recipient, amount);
      }

      function verifyProof(bytes32, bytes calldata) internal pure returns (bool) {
          // Verification logic depends on bridge model
          return true;
      }
  }

  interface IERC20 {
      function transferFrom(address, address, uint256) external returns (bool);
      function transfer(address, uint256) external returns (bool);
  }
  ```

  Мости є одним з найвразливіших компонентів Web3-екосистеми. Більшість великих зломів 2022-2023 років стосувалися мостів. На співбесіді важливо знати не лише механізми, а й trade-offs між швидкістю, вартістю та безпекою різних моделей.
en_answer: |
  **Cross-chain bridges** are protocols that enable moving assets and data between different blockchains. Since blockchains are isolated by default, bridges solve the interoperability problem but simultaneously create new attack vectors.

  **Lock-and-Mint** is the most common mechanism. A user locks tokens in a contract on the source chain. The bridge verifies the lock and mints an equivalent amount of "wrapped" tokens on the destination chain. When returning, wrapped tokens are burned, and the originals are unlocked. **Burn-and-Mint** works similarly, but tokens on the source chain are burned and new ones are created on the destination (suitable for native cross-chain tokens).

  **Verification models** determine the bridge's security level. **External validators (multisig/MPC)** -- a group of trusted signers confirms cross-chain messages; simplest but vulnerable to key compromise (Ronin Bridge, $625M). **Light client verification** -- a contract on the destination chain verifies block headers from the source chain; most secure but gas-expensive. **Optimistic verification** -- messages are accepted by default with a challenge period (fraud proof); a balance between security and speed.

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  // Simplified lock-and-mint bridge (source chain side)
  contract BridgeLock {
      mapping(bytes32 => bool) public processedDeposits;
      uint256 public depositNonce;

      event Deposit(
          address indexed token,
          address indexed sender,
          uint256 amount,
          uint256 destChainId,
          uint256 nonce
      );

      function lock(
          address token,
          uint256 amount,
          uint256 destChainId
      ) external {
          IERC20(token).transferFrom(msg.sender, address(this), amount);
          depositNonce++;
          emit Deposit(token, msg.sender, amount, destChainId, depositNonce);
      }

      // Called by relayers with proof from destination chain
      function unlock(
          address token,
          address recipient,
          uint256 amount,
          bytes32 proofHash,
          bytes calldata proof
      ) external {
          require(!processedDeposits[proofHash], "Already processed");
          require(verifyProof(proofHash, proof), "Invalid proof");
          processedDeposits[proofHash] = true;
          IERC20(token).transfer(recipient, amount);
      }

      function verifyProof(bytes32, bytes calldata) internal pure returns (bool) {
          // Verification logic depends on bridge model
          return true;
      }
  }

  interface IERC20 {
      function transferFrom(address, address, uint256) external returns (bool);
      function transfer(address, uint256) external returns (bool);
  }
  ```

  Bridges are one of the most vulnerable components of the Web3 ecosystem. Most major hacks in 2022-2023 involved bridges. In interviews, it is important to know not only the mechanisms but also the trade-offs between speed, cost, and security of different models.
section: "blockchain"
order: 20
tags:
  - bridges
  - cross-chain
  - security
type: "deep"
---
