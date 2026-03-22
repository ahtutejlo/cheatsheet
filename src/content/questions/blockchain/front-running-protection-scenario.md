---
ua_question: "Як захистити функцію swap на DEX від front-running MEV-ботами?"
en_question: "How to protect a DEX swap function from front-running by MEV bots?"
ua_answer: |
  **Scenario:** Децентралізована біржа (DEX) на базі AMM має проблему: MEV-боти моніторять mempool та виконують front-running атаки на великі свопи. Бот розміщує свою транзакцію перед транзакцією жертви (підвищуючи ціну), а потім продає після неї (забираючи прибуток). Користувачі втрачають від 0.5% до 5% на кожному свопі.

  **Approach:**
  1. Додати параметри `deadline` та `minAmountOut` (slippage protection) у swap-функцію
  2. Реалізувати commit-reveal схему для приховування деталей свопу від mempool
  3. Інтегрувати приватний mempool (Flashbots Protect) для обходу публічного mempool
  4. Використати batch-аукціон замість безперервного AMM для усунення переваги порядку

  **Solution:**
  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  // Protection Level 1: Slippage + Deadline
  contract ProtectedSwap {
      function swap(
          address tokenIn,
          address tokenOut,
          uint256 amountIn,
          uint256 minAmountOut,  // Slippage protection
          uint256 deadline       // Time protection
      ) external {
          require(block.timestamp <= deadline, "Transaction expired");

          uint256 amountOut = calculateOutput(tokenIn, tokenOut, amountIn);
          require(amountOut >= minAmountOut, "Slippage exceeded");

          IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
          IERC20(tokenOut).transfer(msg.sender, amountOut);
      }

      function calculateOutput(address, address, uint256 amountIn)
          internal pure returns (uint256)
      {
          // AMM formula: x * y = k
          return amountIn; // Simplified
      }
  }

  // Protection Level 2: Commit-Reveal Scheme
  contract CommitRevealSwap {
      struct Commitment {
          bytes32 hash;
          uint256 timestamp;
          bool revealed;
      }

      mapping(address => Commitment) public commitments;
      uint256 public constant REVEAL_WINDOW = 2 minutes;
      uint256 public constant COMMIT_DELAY = 1; // blocks

      // Phase 1: Commit (hides swap details)
      function commit(bytes32 commitHash) external {
          commitments[msg.sender] = Commitment({
              hash: commitHash,
              timestamp: block.timestamp,
              revealed: false
          });
      }

      // Phase 2: Reveal and execute (after delay)
      function reveal(
          address tokenIn,
          address tokenOut,
          uint256 amountIn,
          uint256 minAmountOut,
          bytes32 salt
      ) external {
          Commitment storage c = commitments[msg.sender];

          // Verify commitment exists and is within reveal window
          require(c.timestamp > 0, "No commitment");
          require(!c.revealed, "Already revealed");
          require(
              block.timestamp >= c.timestamp + COMMIT_DELAY,
              "Too early"
          );
          require(
              block.timestamp <= c.timestamp + REVEAL_WINDOW,
              "Reveal window expired"
          );

          // Verify hash matches
          bytes32 expected = keccak256(abi.encodePacked(
              msg.sender, tokenIn, tokenOut, amountIn, minAmountOut, salt
          ));
          require(c.hash == expected, "Invalid reveal");

          c.revealed = true;

          // Execute swap (details were hidden until now)
          executeSwap(tokenIn, tokenOut, amountIn, minAmountOut);
      }

      function executeSwap(address, address, uint256, uint256) internal {
          // Actual swap logic
      }
  }

  interface IERC20 {
      function transferFrom(address, address, uint256) external returns (bool);
      function transfer(address, uint256) external returns (bool);
  }
  ```

  ```javascript
  // Using Flashbots Protect (private mempool)
  const { ethers } = require("ethers");

  async function privateSwap(router, params) {
      // Flashbots RPC endpoint bypasses public mempool
      const flashbotsProvider = new ethers.JsonRpcProvider(
          "https://rpc.flashbots.net"
      );

      const wallet = new ethers.Wallet(privateKey, flashbotsProvider);

      const tx = await router.connect(wallet).swap(
          params.tokenIn,
          params.tokenOut,
          params.amountIn,
          params.minAmountOut,
          Math.floor(Date.now() / 1000) + 300 // 5-minute deadline
      );

      // Transaction goes directly to block builders, not public mempool
      console.log("Private tx hash:", tx.hash);
      return tx.wait();
  }
  ```

  Комплексний захист поєднує всі рівні: slippage protection як базовий захист; deadline для запобігання затримці транзакцій; приватний mempool для приховування від ботів; commit-reveal для високовартісних операцій. Жоден метод не є ідеальним -- MEV є фундаментальною властивістю публічних блокчейнів.
en_answer: |
  **Scenario:** A decentralized exchange (DEX) based on AMM has a problem: MEV bots monitor the mempool and execute front-running attacks on large swaps. A bot places its transaction before the victim's transaction (raising the price), then sells after it (taking the profit). Users lose 0.5% to 5% on each swap.

  **Approach:**
  1. Add `deadline` and `minAmountOut` (slippage protection) parameters to the swap function
  2. Implement a commit-reveal scheme to hide swap details from the mempool
  3. Integrate a private mempool (Flashbots Protect) to bypass the public mempool
  4. Use batch auctions instead of continuous AMM to eliminate ordering advantage

  **Solution:**
  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  // Protection Level 1: Slippage + Deadline
  contract ProtectedSwap {
      function swap(
          address tokenIn,
          address tokenOut,
          uint256 amountIn,
          uint256 minAmountOut,  // Slippage protection
          uint256 deadline       // Time protection
      ) external {
          require(block.timestamp <= deadline, "Transaction expired");

          uint256 amountOut = calculateOutput(tokenIn, tokenOut, amountIn);
          require(amountOut >= minAmountOut, "Slippage exceeded");

          IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
          IERC20(tokenOut).transfer(msg.sender, amountOut);
      }

      function calculateOutput(address, address, uint256 amountIn)
          internal pure returns (uint256)
      {
          // AMM formula: x * y = k
          return amountIn; // Simplified
      }
  }

  // Protection Level 2: Commit-Reveal Scheme
  contract CommitRevealSwap {
      struct Commitment {
          bytes32 hash;
          uint256 timestamp;
          bool revealed;
      }

      mapping(address => Commitment) public commitments;
      uint256 public constant REVEAL_WINDOW = 2 minutes;
      uint256 public constant COMMIT_DELAY = 1; // blocks

      // Phase 1: Commit (hides swap details)
      function commit(bytes32 commitHash) external {
          commitments[msg.sender] = Commitment({
              hash: commitHash,
              timestamp: block.timestamp,
              revealed: false
          });
      }

      // Phase 2: Reveal and execute (after delay)
      function reveal(
          address tokenIn,
          address tokenOut,
          uint256 amountIn,
          uint256 minAmountOut,
          bytes32 salt
      ) external {
          Commitment storage c = commitments[msg.sender];

          // Verify commitment exists and is within reveal window
          require(c.timestamp > 0, "No commitment");
          require(!c.revealed, "Already revealed");
          require(
              block.timestamp >= c.timestamp + COMMIT_DELAY,
              "Too early"
          );
          require(
              block.timestamp <= c.timestamp + REVEAL_WINDOW,
              "Reveal window expired"
          );

          // Verify hash matches
          bytes32 expected = keccak256(abi.encodePacked(
              msg.sender, tokenIn, tokenOut, amountIn, minAmountOut, salt
          ));
          require(c.hash == expected, "Invalid reveal");

          c.revealed = true;

          // Execute swap (details were hidden until now)
          executeSwap(tokenIn, tokenOut, amountIn, minAmountOut);
      }

      function executeSwap(address, address, uint256, uint256) internal {
          // Actual swap logic
      }
  }

  interface IERC20 {
      function transferFrom(address, address, uint256) external returns (bool);
      function transfer(address, uint256) external returns (bool);
  }
  ```

  ```javascript
  // Using Flashbots Protect (private mempool)
  const { ethers } = require("ethers");

  async function privateSwap(router, params) {
      // Flashbots RPC endpoint bypasses public mempool
      const flashbotsProvider = new ethers.JsonRpcProvider(
          "https://rpc.flashbots.net"
      );

      const wallet = new ethers.Wallet(privateKey, flashbotsProvider);

      const tx = await router.connect(wallet).swap(
          params.tokenIn,
          params.tokenOut,
          params.amountIn,
          params.minAmountOut,
          Math.floor(Date.now() / 1000) + 300 // 5-minute deadline
      );

      // Transaction goes directly to block builders, not public mempool
      console.log("Private tx hash:", tx.hash);
      return tx.wait();
  }
  ```

  Comprehensive protection combines all levels: slippage protection as a basic defense; deadline to prevent stale transactions; private mempool to hide from bots; commit-reveal for high-value operations. No single method is perfect -- MEV is a fundamental property of public blockchains.
section: "blockchain"
order: 30
tags:
  - mev
  - security
  - defi
type: "practical"
---
