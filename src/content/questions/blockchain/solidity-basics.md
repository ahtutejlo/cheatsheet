---
ua_question: "Що таке Solidity?"
en_question: "What is Solidity?"
ua_answer: |
  **Solidity** -- це об'єктно-орієнтована мова програмування для написання смарт-контрактів на платформі Ethereum та сумісних блокчейнах (Polygon, BSC, Avalanche). Синтаксис подібний до JavaScript, C++ та Python.

  Основні концепції Solidity:
  - **Контракти** -- аналог класів в ООП, містять стан (змінні) та поведінку (функції)
  - **Типи даних** -- `uint256`, `address`, `bool`, `string`, `mapping`, `struct`
  - **Модифікатори доступу** -- `public`, `private`, `internal`, `external`
  - **Events** -- механізм логування подій для зовнішніх слухачів
  - **Modifiers** -- декоратори для перевірки умов перед виконанням функції

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  contract Token {
      string public name;
      mapping(address => uint256) public balances;

      event Transfer(address indexed from, address indexed to, uint256 amount);

      modifier onlyPositive(uint256 amount) {
          require(amount > 0, "Amount must be positive");
          _;
      }

      constructor(string memory _name) {
          name = _name;
          balances[msg.sender] = 1000000;
      }

      function transfer(address to, uint256 amount)
          public onlyPositive(amount)
      {
          require(balances[msg.sender] >= amount, "Insufficient balance");
          balances[msg.sender] -= amount;
          balances[to] += amount;
          emit Transfer(msg.sender, to, amount);
      }
  }
  ```
en_answer: |
  **Solidity** is an object-oriented programming language for writing smart contracts on the Ethereum platform and compatible blockchains (Polygon, BSC, Avalanche). Its syntax is similar to JavaScript, C++, and Python.

  Key Solidity concepts:
  - **Contracts** -- analogous to classes in OOP, containing state (variables) and behavior (functions)
  - **Data types** -- `uint256`, `address`, `bool`, `string`, `mapping`, `struct`
  - **Access modifiers** -- `public`, `private`, `internal`, `external`
  - **Events** -- logging mechanism for external listeners
  - **Modifiers** -- decorators for checking conditions before function execution

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  contract Token {
      string public name;
      mapping(address => uint256) public balances;

      event Transfer(address indexed from, address indexed to, uint256 amount);

      modifier onlyPositive(uint256 amount) {
          require(amount > 0, "Amount must be positive");
          _;
      }

      constructor(string memory _name) {
          name = _name;
          balances[msg.sender] = 1000000;
      }

      function transfer(address to, uint256 amount)
          public onlyPositive(amount)
      {
          require(balances[msg.sender] >= amount, "Insufficient balance");
          balances[msg.sender] -= amount;
          balances[to] += amount;
          emit Transfer(msg.sender, to, amount);
      }
  }
  ```
section: "blockchain"
order: 14
tags:
  - solidity
---
