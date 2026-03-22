---
ua_question: "Чи можна оновити смарт-контракт після розгортання на блокчейні?"
en_question: "Can a smart contract be upgraded after deployment on the blockchain?"
ua_answer: |
  > **Trap:** Смарт-контракти незмінні після розгортання, тому їх неможливо оновити чи виправити.

  Хоча байт-код контракту на конкретній адресі дійсно незмінний, існують **proxy-патерни**, що дозволяють змінювати логіку контракту, зберігаючи ту саму адресу та стан. Ця техніка широко використовується в продакшн-контрактах, включаючи Uniswap, Aave та OpenZeppelin.

  **Proxy pattern** працює через механізм `delegatecall`: proxy-контракт (що зберігає стан) делегує виконання implementation-контракту (що містить логіку). При оновленні змінюється лише адреса implementation, а proxy та його storage залишаються незмінними. Основні варіанти: **Transparent Proxy** (адмін не може викликати implementation-функції через proxy), **UUPS (Universal Upgradeable Proxy Standard)** (логіка оновлення у самому implementation), та **Beacon Proxy** (один beacon для групи proxy).

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  // Simplified proxy pattern
  contract Proxy {
      // EIP-1967 storage slot for implementation address
      // bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1)
      bytes32 private constant IMPL_SLOT =
          0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

      constructor(address implementation) {
          _setImplementation(implementation);
      }

      function _setImplementation(address impl) internal {
          assembly {
              sstore(IMPL_SLOT, impl)
          }
      }

      // All calls are delegated to implementation
      fallback() external payable {
          assembly {
              let impl := sload(IMPL_SLOT)
              calldatacopy(0, 0, calldatasize())
              let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
              returndatacopy(0, 0, returndatasize())
              switch result
              case 0 { revert(0, returndatasize()) }
              default { return(0, returndatasize()) }
          }
      }
  }

  // Implementation V1
  contract TokenV1 {
      uint256 public totalSupply;

      function mint(uint256 amount) external {
          totalSupply += amount;
      }
  }

  // Implementation V2 (upgrade adds burn)
  contract TokenV2 {
      uint256 public totalSupply;

      function mint(uint256 amount) external {
          totalSupply += amount;
      }

      function burn(uint256 amount) external {
          totalSupply -= amount;
      }
  }
  ```

  Важливо розуміти ризики: storage collision між версіями, відсутність constructor (використовується initializer), необхідність storage gap для майбутніх змінних, та централізація влади у адміністратора proxy. Незмінність -- це властивість байт-коду, а не системи в цілому.
en_answer: |
  > **Trap:** Smart contracts are immutable after deployment, so they cannot be updated or fixed.

  While the bytecode of a contract at a specific address is indeed immutable, **proxy patterns** exist that allow changing contract logic while preserving the same address and state. This technique is widely used in production contracts, including Uniswap, Aave, and OpenZeppelin.

  The **proxy pattern** works through the `delegatecall` mechanism: a proxy contract (which holds state) delegates execution to an implementation contract (which contains logic). During an upgrade, only the implementation address changes, while the proxy and its storage remain unchanged. Main variants: **Transparent Proxy** (admin cannot call implementation functions through proxy), **UUPS (Universal Upgradeable Proxy Standard)** (upgrade logic in the implementation itself), and **Beacon Proxy** (one beacon for a group of proxies).

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  // Simplified proxy pattern
  contract Proxy {
      // EIP-1967 storage slot for implementation address
      // bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1)
      bytes32 private constant IMPL_SLOT =
          0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

      constructor(address implementation) {
          _setImplementation(implementation);
      }

      function _setImplementation(address impl) internal {
          assembly {
              sstore(IMPL_SLOT, impl)
          }
      }

      // All calls are delegated to implementation
      fallback() external payable {
          assembly {
              let impl := sload(IMPL_SLOT)
              calldatacopy(0, 0, calldatasize())
              let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
              returndatacopy(0, 0, returndatasize())
              switch result
              case 0 { revert(0, returndatasize()) }
              default { return(0, returndatasize()) }
          }
      }
  }

  // Implementation V1
  contract TokenV1 {
      uint256 public totalSupply;

      function mint(uint256 amount) external {
          totalSupply += amount;
      }
  }

  // Implementation V2 (upgrade adds burn)
  contract TokenV2 {
      uint256 public totalSupply;

      function mint(uint256 amount) external {
          totalSupply += amount;
      }

      function burn(uint256 amount) external {
          totalSupply -= amount;
      }
  }
  ```

  It is important to understand the risks: storage collision between versions, no constructor (initializer is used instead), the need for a storage gap for future variables, and centralization of power in the proxy admin. Immutability is a property of bytecode, not the system as a whole.
section: "blockchain"
order: 25
tags:
  - upgrades
  - proxy
  - architecture
type: "trick"
---
