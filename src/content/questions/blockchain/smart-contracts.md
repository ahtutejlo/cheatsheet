---
ua_question: "Що таке смарт-контракти?"
en_question: "What are smart contracts?"
ua_answer: |
  **Смарт-контракт** -- це програма, що зберігається та виконується на блокчейні. Вона автоматично виконує умови угоди між сторонами без потреби у посередниках. Термін вперше використав Нік Сабо у 1990-х.

  Смарт-контракти є **детерміністичними** -- за однакових вхідних даних вони завжди дають однаковий результат. Після розгортання на блокчейні код контракту стає незмінним.

  Основні застосування:
  - **DeFi** -- кредитування, обмін токенів, ліквідність
  - **NFT** -- створення та торгівля цифровими активами
  - **DAO** -- децентралізоване управління організаціями
  - **Supply Chain** -- відстеження товарів

  ```solidity
  // Простий смарт-контракт на Solidity
  pragma solidity ^0.8.0;

  contract SimpleStorage {
      uint256 private value;

      event ValueChanged(uint256 newValue);

      function set(uint256 _value) public {
          value = _value;
          emit ValueChanged(_value);
      }

      function get() public view returns (uint256) {
          return value;
      }
  }
  ```
en_answer: |
  A **smart contract** is a program stored and executed on a blockchain. It automatically enforces the terms of an agreement between parties without the need for intermediaries. The term was first used by Nick Szabo in the 1990s.

  Smart contracts are **deterministic** -- given the same inputs, they always produce the same result. Once deployed to the blockchain, the contract code becomes immutable.

  Main applications:
  - **DeFi** -- lending, token swaps, liquidity
  - **NFT** -- creation and trading of digital assets
  - **DAO** -- decentralized organization governance
  - **Supply Chain** -- goods tracking

  ```solidity
  // Simple smart contract in Solidity
  pragma solidity ^0.8.0;

  contract SimpleStorage {
      uint256 private value;

      event ValueChanged(uint256 newValue);

      function set(uint256 _value) public {
          value = _value;
          emit ValueChanged(_value);
      }

      function get() public view returns (uint256) {
          return value;
      }
  }
  ```
section: "blockchain"
order: 4
tags:
  - smart-contracts
---
