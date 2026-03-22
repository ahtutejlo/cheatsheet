---
ua_question: "Як оптимізувати функцію мінтингу NFT, щоб зменшити витрати gas?"
en_question: "How to optimize an NFT minting function to reduce gas costs?"
ua_answer: |
  **Scenario:** NFT-проєкт має функцію mint, яка витрачає 250,000 gas за один мінт. При gas price 30 gwei це коштує ~$15. Потрібно знизити витрати до менше 100,000 gas, щоб зробити мінт доступним для користувачів.

  **Approach:**
  1. Оптимізувати storage: пакування змінних, використання `uint96` замість `uint256` де можливо
  2. Замінити `memory` на `calldata` для параметрів функцій, використати batch-мінт
  3. Використати ERC721A (оптимізований для batch mint) замість стандартного ERC721
  4. Мінімізувати SSTORE операції -- найдорожчий опкод

  **Solution:**
  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  // BEFORE: Unoptimized (~250k gas per mint)
  contract ExpensiveNFT {
      mapping(uint256 => address) public owners;
      mapping(address => uint256) public balances;
      uint256 public totalSupply;
      uint256 public maxSupply;
      uint256 public price;
      bool public saleActive;
      string public baseURI;

      function mint(uint256 quantity) external payable {
          require(saleActive, "Sale not active");
          require(msg.value >= price * quantity, "Insufficient payment");
          require(totalSupply + quantity <= maxSupply, "Exceeds max");

          for (uint256 i = 0; i < quantity; i++) {
              uint256 tokenId = totalSupply + 1;
              owners[tokenId] = msg.sender;  // SSTORE: 20,000 gas each
              balances[msg.sender] += 1;      // SSTORE: 5,000 gas each
              totalSupply += 1;               // SSTORE: 5,000 gas each
          }
      }
  }

  // AFTER: Optimized (~60k gas per mint)
  contract OptimizedNFT {
      // Pack related variables into single storage slot
      struct SaleConfig {
          uint64 price;        // 8 bytes
          uint32 maxSupply;    // 4 bytes
          uint32 totalSupply;  // 4 bytes
          bool saleActive;     // 1 byte
      }                        // Total: 17 bytes = 1 slot

      SaleConfig public config;

      // ERC721A-style: store owner only for first token in batch
      mapping(uint256 => address) private _owners;
      mapping(address => uint256) private _balances;

      function mint(uint256 quantity) external payable {
          SaleConfig memory cfg = config; // Single SLOAD (2,100 gas)

          require(cfg.saleActive, "Sale not active");
          require(msg.value >= uint256(cfg.price) * quantity, "Insufficient payment");
          require(cfg.totalSupply + quantity <= cfg.maxSupply, "Exceeds max");

          uint256 startId = cfg.totalSupply;

          // Single SSTORE for owner (batch optimization)
          _owners[startId] = msg.sender;
          _balances[msg.sender] += quantity;

          // Single SSTORE for totalSupply update
          config.totalSupply = uint32(startId + quantity);

          // No loop needed for batch mint!
      }

      // Resolve owner by walking back to find batch start
      function ownerOf(uint256 tokenId) public view returns (address) {
          require(tokenId < config.totalSupply, "Nonexistent token");
          for (uint256 id = tokenId; ; id--) {
              if (_owners[id] != address(0)) {
                  return _owners[id];
              }
          }
      }
  }
  ```

  Основні техніки оптимізації gas: пакування змінних у один storage slot (заощаджує SSTORE); завантаження storage у memory на початку функції (один SLOAD замість багатьох); batch-операції замість циклів; `unchecked` для безпечних арифметичних операцій; `calldata` замість `memory` для read-only параметрів.
en_answer: |
  **Scenario:** An NFT project has a mint function that costs 250,000 gas per mint. At 30 gwei gas price, this costs ~$15. The goal is to reduce costs to under 100,000 gas to make minting affordable for users.

  **Approach:**
  1. Optimize storage: variable packing, using `uint96` instead of `uint256` where possible
  2. Replace `memory` with `calldata` for function parameters, use batch minting
  3. Use ERC721A (optimized for batch mint) instead of standard ERC721
  4. Minimize SSTORE operations -- the most expensive opcode

  **Solution:**
  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  // BEFORE: Unoptimized (~250k gas per mint)
  contract ExpensiveNFT {
      mapping(uint256 => address) public owners;
      mapping(address => uint256) public balances;
      uint256 public totalSupply;
      uint256 public maxSupply;
      uint256 public price;
      bool public saleActive;
      string public baseURI;

      function mint(uint256 quantity) external payable {
          require(saleActive, "Sale not active");
          require(msg.value >= price * quantity, "Insufficient payment");
          require(totalSupply + quantity <= maxSupply, "Exceeds max");

          for (uint256 i = 0; i < quantity; i++) {
              uint256 tokenId = totalSupply + 1;
              owners[tokenId] = msg.sender;  // SSTORE: 20,000 gas each
              balances[msg.sender] += 1;      // SSTORE: 5,000 gas each
              totalSupply += 1;               // SSTORE: 5,000 gas each
          }
      }
  }

  // AFTER: Optimized (~60k gas per mint)
  contract OptimizedNFT {
      // Pack related variables into single storage slot
      struct SaleConfig {
          uint64 price;        // 8 bytes
          uint32 maxSupply;    // 4 bytes
          uint32 totalSupply;  // 4 bytes
          bool saleActive;     // 1 byte
      }                        // Total: 17 bytes = 1 slot

      SaleConfig public config;

      // ERC721A-style: store owner only for first token in batch
      mapping(uint256 => address) private _owners;
      mapping(address => uint256) private _balances;

      function mint(uint256 quantity) external payable {
          SaleConfig memory cfg = config; // Single SLOAD (2,100 gas)

          require(cfg.saleActive, "Sale not active");
          require(msg.value >= uint256(cfg.price) * quantity, "Insufficient payment");
          require(cfg.totalSupply + quantity <= cfg.maxSupply, "Exceeds max");

          uint256 startId = cfg.totalSupply;

          // Single SSTORE for owner (batch optimization)
          _owners[startId] = msg.sender;
          _balances[msg.sender] += quantity;

          // Single SSTORE for totalSupply update
          config.totalSupply = uint32(startId + quantity);

          // No loop needed for batch mint!
      }

      // Resolve owner by walking back to find batch start
      function ownerOf(uint256 tokenId) public view returns (address) {
          require(tokenId < config.totalSupply, "Nonexistent token");
          for (uint256 id = tokenId; ; id--) {
              if (_owners[id] != address(0)) {
                  return _owners[id];
              }
          }
      }
  }
  ```

  Key gas optimization techniques: packing variables into a single storage slot (saves SSTORE); loading storage into memory at function start (one SLOAD instead of many); batch operations instead of loops; `unchecked` for safe arithmetic operations; `calldata` instead of `memory` for read-only parameters.
section: "blockchain"
order: 28
tags:
  - gas
  - optimization
  - solidity
type: "practical"
---
