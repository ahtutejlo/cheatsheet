---
ua_question: "Чи безпечно викликати зовнішні контракти, якщо перевіряти баланси?"
en_question: "Is it safe to call external contracts as long as you check balances?"
ua_answer: |
  > **Trap:** Виклик зовнішніх контрактів безпечний, якщо ви перевіряєте баланси перед відправкою коштів.

  Це одна з найнебезпечніших помилок у розробці смарт-контрактів. **Reentrancy attack** (атака повторного входу) дозволяє зловмиснику повторно викликати вашу функцію до того, як попереднє виконання завершилось та оновило стан. Навіть якщо ви перевіряєте баланс, зловмисник може "увійти" знову до того, як баланс оновиться, і вивести кошти багаторазово. Саме ця вразливість спричинила злом The DAO у 2016 році ($60M).

  Захист -- патерн **Checks-Effects-Interactions (CEI)**: 1) перевірте умови (checks), 2) оновіть стан (effects), 3) зробіть зовнішній виклик (interactions). Альтернативно або додатково використовуйте **ReentrancyGuard** -- модифікатор, що блокує повторний вхід у функцію.

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  // VULNERABLE: state update AFTER external call
  contract VulnerableBank {
      mapping(address => uint256) public balances;

      function withdraw() public {
          uint256 amount = balances[msg.sender];
          require(amount > 0, "No balance");

          // DANGER: external call BEFORE state update
          (bool success, ) = msg.sender.call{value: amount}("");
          require(success, "Transfer failed");

          // Attacker re-enters before this line executes!
          balances[msg.sender] = 0;
      }
  }

  // Attacker contract
  contract Attacker {
      VulnerableBank public bank;

      constructor(address _bank) {
          bank = VulnerableBank(_bank);
      }

      function attack() external payable {
          bank.withdraw();
      }

      // Called when bank sends ETH -- re-enters withdraw()
      receive() external payable {
          if (address(bank).balance >= 1 ether) {
              bank.withdraw(); // Re-enter!
          }
      }
  }

  // SAFE: Checks-Effects-Interactions pattern
  contract SafeBank {
      mapping(address => uint256) public balances;
      bool private locked;

      modifier noReentrant() {
          require(!locked, "Reentrant call");
          locked = true;
          _;
          locked = false;
      }

      function withdraw() public noReentrant {
          uint256 amount = balances[msg.sender];
          require(amount > 0, "No balance");        // Check

          balances[msg.sender] = 0;                  // Effect (state update FIRST)

          (bool success, ) = msg.sender.call{value: amount}(""); // Interaction
          require(success, "Transfer failed");
      }
  }
  ```

  Reentrancy залишається однією з найпоширеніших вразливостей. На співбесіді важливо не лише знати патерн CEI, але й розуміти, що reentrancy можлива не тільки через `call`, а й через `transfer`/`send` (хоча з обмеженням gas у 2300), і що cross-function reentrancy (повторний вхід через іншу функцію контракту) -- також реальна загроза.
en_answer: |
  > **Trap:** Calling external contracts is safe as long as you check balances before sending funds.

  This is one of the most dangerous mistakes in smart contract development. A **reentrancy attack** allows an attacker to re-enter your function before the previous execution completes and updates state. Even if you check the balance, the attacker can "re-enter" before the balance is updated and withdraw funds multiple times. This vulnerability caused The DAO hack in 2016 ($60M).

  The defense is the **Checks-Effects-Interactions (CEI)** pattern: 1) verify conditions (checks), 2) update state (effects), 3) make the external call (interactions). Alternatively or additionally, use a **ReentrancyGuard** -- a modifier that prevents re-entering a function.

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  // VULNERABLE: state update AFTER external call
  contract VulnerableBank {
      mapping(address => uint256) public balances;

      function withdraw() public {
          uint256 amount = balances[msg.sender];
          require(amount > 0, "No balance");

          // DANGER: external call BEFORE state update
          (bool success, ) = msg.sender.call{value: amount}("");
          require(success, "Transfer failed");

          // Attacker re-enters before this line executes!
          balances[msg.sender] = 0;
      }
  }

  // Attacker contract
  contract Attacker {
      VulnerableBank public bank;

      constructor(address _bank) {
          bank = VulnerableBank(_bank);
      }

      function attack() external payable {
          bank.withdraw();
      }

      // Called when bank sends ETH -- re-enters withdraw()
      receive() external payable {
          if (address(bank).balance >= 1 ether) {
              bank.withdraw(); // Re-enter!
          }
      }
  }

  // SAFE: Checks-Effects-Interactions pattern
  contract SafeBank {
      mapping(address => uint256) public balances;
      bool private locked;

      modifier noReentrant() {
          require(!locked, "Reentrant call");
          locked = true;
          _;
          locked = false;
      }

      function withdraw() public noReentrant {
          uint256 amount = balances[msg.sender];
          require(amount > 0, "No balance");        // Check

          balances[msg.sender] = 0;                  // Effect (state update FIRST)

          (bool success, ) = msg.sender.call{value: amount}(""); // Interaction
          require(success, "Transfer failed");
      }
  }
  ```

  Reentrancy remains one of the most common vulnerabilities. In interviews, it is important not only to know the CEI pattern but also to understand that reentrancy is possible not only through `call` but also through `transfer`/`send` (though with a 2300 gas limit), and that cross-function reentrancy (re-entering through a different function of the contract) is also a real threat.
section: "blockchain"
order: 23
tags:
  - security
  - reentrancy
  - solidity
type: "trick"
---
