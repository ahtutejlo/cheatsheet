---
ua_question: "Як розгорнути токен-контракт з можливістю оновлення без міграції балансів?"
en_question: "How to deploy a token contract that can be upgraded without migrating balances?"
ua_answer: |
  **Scenario:** Команда розгортає ERC-20 токен для DeFi-протоколу. Після запуску виявлено баг у логіці розрахунку комісій. Потрібно виправити код без міграції сотень тисяч балансів користувачів на новий контракт, зберігаючи ту саму адресу для інтеграцій.

  **Approach:**
  1. Використати UUPS proxy pattern -- proxy зберігає стан (баланси), а логіку можна замінити
  2. Замінити constructor на initializer функцію (constructor не працює з proxy)
  3. Додати storage gap для безпечного додавання змінних у майбутніх версіях
  4. Використати OpenZeppelin Upgradeable бібліотеку для перевіреного коду

  **Solution:**
  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
  import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
  import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

  // V1: Initial deployment
  contract TokenV1 is ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
      uint256 public feePercent;
      uint256[50] private __gap; // Reserve storage for future variables

      function initialize(string memory name, string memory symbol)
          public initializer
      {
          __ERC20_init(name, symbol);
          __Ownable_init(msg.sender);
          __UUPSUpgradeable_init();
          feePercent = 1; // 1% fee (buggy calculation)
          _mint(msg.sender, 1000000 * 10 ** decimals());
      }

      function _authorizeUpgrade(address newImplementation)
          internal override onlyOwner
      {}

      // Bug: fee calculation uses integer division incorrectly
      function transferWithFee(address to, uint256 amount) external {
          uint256 fee = amount * feePercent / 10000; // Bug: should be /100
          _transfer(msg.sender, to, amount - fee);
      }
  }

  // V2: Upgrade with fix
  contract TokenV2 is ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
      uint256 public feePercent;
      address public feeCollector;      // New variable (uses gap space)
      uint256[49] private __gap;        // Reduced gap by 1

      // No initializer needed for upgrade, use reinitializer if new init logic required
      function initializeV2(address _feeCollector) public reinitializer(2) {
          feeCollector = _feeCollector;
      }

      function _authorizeUpgrade(address newImplementation)
          internal override onlyOwner
      {}

      // Fixed: correct fee calculation
      function transferWithFee(address to, uint256 amount) external {
          uint256 fee = amount * feePercent / 100; // Fixed!
          _transfer(msg.sender, feeCollector, fee);
          _transfer(msg.sender, to, amount - fee);
      }
  }
  ```

  ```bash
  # Deployment and upgrade workflow using Hardhat
  # 1. Deploy V1 (creates proxy + implementation)
  npx hardhat run scripts/deploy.js --network mainnet

  # 2. Verify on Etherscan
  npx hardhat verify --network mainnet PROXY_ADDRESS

  # 3. Deploy V2 implementation and upgrade proxy
  npx hardhat run scripts/upgrade.js --network mainnet

  # Key: proxy address stays the same, all balances preserved
  ```

  Ключові правила при оновленні: ніколи не змінюйте порядок існуючих storage-змінних; нові змінні додавайте тільки в кінець (використовуючи gap); не використовуйте constructor в upgradeable-контрактах; ретельно тестуйте сумісність storage між версіями.
en_answer: |
  **Scenario:** A team deploys an ERC-20 token for a DeFi protocol. After launch, a bug is discovered in the fee calculation logic. The code needs to be fixed without migrating hundreds of thousands of user balances to a new contract, while preserving the same address for integrations.

  **Approach:**
  1. Use the UUPS proxy pattern -- proxy stores state (balances), while logic can be replaced
  2. Replace the constructor with an initializer function (constructors do not work with proxies)
  3. Add a storage gap for safely adding variables in future versions
  4. Use the OpenZeppelin Upgradeable library for battle-tested code

  **Solution:**
  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
  import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
  import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

  // V1: Initial deployment
  contract TokenV1 is ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
      uint256 public feePercent;
      uint256[50] private __gap; // Reserve storage for future variables

      function initialize(string memory name, string memory symbol)
          public initializer
      {
          __ERC20_init(name, symbol);
          __Ownable_init(msg.sender);
          __UUPSUpgradeable_init();
          feePercent = 1; // 1% fee (buggy calculation)
          _mint(msg.sender, 1000000 * 10 ** decimals());
      }

      function _authorizeUpgrade(address newImplementation)
          internal override onlyOwner
      {}

      // Bug: fee calculation uses integer division incorrectly
      function transferWithFee(address to, uint256 amount) external {
          uint256 fee = amount * feePercent / 10000; // Bug: should be /100
          _transfer(msg.sender, to, amount - fee);
      }
  }

  // V2: Upgrade with fix
  contract TokenV2 is ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
      uint256 public feePercent;
      address public feeCollector;      // New variable (uses gap space)
      uint256[49] private __gap;        // Reduced gap by 1

      // No initializer needed for upgrade, use reinitializer if new init logic required
      function initializeV2(address _feeCollector) public reinitializer(2) {
          feeCollector = _feeCollector;
      }

      function _authorizeUpgrade(address newImplementation)
          internal override onlyOwner
      {}

      // Fixed: correct fee calculation
      function transferWithFee(address to, uint256 amount) external {
          uint256 fee = amount * feePercent / 100; // Fixed!
          _transfer(msg.sender, feeCollector, fee);
          _transfer(msg.sender, to, amount - fee);
      }
  }
  ```

  ```bash
  # Deployment and upgrade workflow using Hardhat
  # 1. Deploy V1 (creates proxy + implementation)
  npx hardhat run scripts/deploy.js --network mainnet

  # 2. Verify on Etherscan
  npx hardhat verify --network mainnet PROXY_ADDRESS

  # 3. Deploy V2 implementation and upgrade proxy
  npx hardhat run scripts/upgrade.js --network mainnet

  # Key: proxy address stays the same, all balances preserved
  ```

  Key rules when upgrading: never change the order of existing storage variables; add new variables only at the end (using the gap); do not use constructors in upgradeable contracts; thoroughly test storage compatibility between versions.
section: "blockchain"
order: 26
tags:
  - upgrades
  - proxy
  - openzeppelin
type: "practical"
---
