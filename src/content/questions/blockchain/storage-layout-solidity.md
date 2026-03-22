---
ua_question: "Як Solidity розміщує змінні стану у storage-слотах EVM?"
en_question: "How does Solidity map state variables to EVM storage slots?"
ua_answer: |
  Кожен смарт-контракт в Ethereum має виділений **storage** -- постійне key-value сховище, де ключ та значення мають розмір 256 біт (32 байти). Solidity автоматично розміщує змінні стану у storage-слотах за чіткими правилами, і знання цих правил є критичним для оптимізації gas та роботи з proxy-контрактами.

  **Базові правила розміщення:** змінні стану займають слоти послідовно, починаючи зі слоту 0. Якщо кілька змінних поміщаються в один 32-байтовий слот, вони **пакуються** разом. Наприклад, `uint128` + `uint128` займуть один слот, але `uint128` + `uint256` займуть два слоти, бо `uint256` потребує повний слот.

  **Динамічні масиви** зберігають довжину у призначеному слоті `p`, а елементи починаються зі слоту `keccak256(p)`. Це гарантує відсутність колізій із іншими змінними. **Mapping** не зберігає ключі -- значення для ключа `k` знаходиться у слоті `keccak256(k . p)`, де `p` -- номер слоту mapping, а `.` -- конкатенація.

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  contract StorageLayout {
      uint256 public value;        // Slot 0 (full 32 bytes)
      address public owner;        // Slot 1 (20 bytes)
      bool public active;          // Slot 1 (1 byte, packed with owner)
      uint128 public a;            // Slot 2 (16 bytes)
      uint128 public b;            // Slot 2 (16 bytes, packed with a)
      uint256[] public arr;        // Slot 3 (length), elements at keccak256(3)
      mapping(address => uint256) public balances; // Slot 4

      // Read raw storage slot
      function getSlot(uint256 slot) public view returns (bytes32) {
          bytes32 result;
          assembly {
              result := sload(slot)
          }
          return result;
      }

      // Calculate array element slot
      function getArrayElementSlot(uint256 index) public pure returns (uint256) {
          return uint256(keccak256(abi.encode(3))) + index;
      }

      // Calculate mapping value slot
      function getMappingSlot(address key) public pure returns (uint256) {
          return uint256(keccak256(abi.encode(key, 4)));
      }
  }
  ```

  Знання storage layout необхідне для: оптимізації gas через пакування змінних, коректної роботи proxy-контрактів (storage collision prevention), аналізу контрактів через `eth_getStorageAt`, та розуміння вразливостей, пов'язаних із storage layout при оновленні контрактів.
en_answer: |
  Every smart contract in Ethereum has dedicated **storage** -- a persistent key-value store where both key and value are 256 bits (32 bytes). Solidity automatically maps state variables to storage slots following precise rules, and understanding these rules is critical for gas optimization and working with proxy contracts.

  **Basic layout rules:** state variables occupy slots sequentially starting from slot 0. If multiple variables fit within a single 32-byte slot, they are **packed** together. For example, `uint128` + `uint128` will occupy one slot, but `uint128` + `uint256` will occupy two slots because `uint256` requires a full slot.

  **Dynamic arrays** store their length in the assigned slot `p`, and elements start at slot `keccak256(p)`. This guarantees no collisions with other variables. **Mappings** do not store keys -- the value for key `k` is located at slot `keccak256(k . p)`, where `p` is the mapping's slot number and `.` is concatenation.

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  contract StorageLayout {
      uint256 public value;        // Slot 0 (full 32 bytes)
      address public owner;        // Slot 1 (20 bytes)
      bool public active;          // Slot 1 (1 byte, packed with owner)
      uint128 public a;            // Slot 2 (16 bytes)
      uint128 public b;            // Slot 2 (16 bytes, packed with a)
      uint256[] public arr;        // Slot 3 (length), elements at keccak256(3)
      mapping(address => uint256) public balances; // Slot 4

      // Read raw storage slot
      function getSlot(uint256 slot) public view returns (bytes32) {
          bytes32 result;
          assembly {
              result := sload(slot)
          }
          return result;
      }

      // Calculate array element slot
      function getArrayElementSlot(uint256 index) public pure returns (uint256) {
          return uint256(keccak256(abi.encode(3))) + index;
      }

      // Calculate mapping value slot
      function getMappingSlot(address key) public pure returns (uint256) {
          return uint256(keccak256(abi.encode(key, 4)));
      }
  }
  ```

  Knowledge of storage layout is essential for: gas optimization through variable packing, correct proxy contract implementation (storage collision prevention), contract analysis via `eth_getStorageAt`, and understanding vulnerabilities related to storage layout during contract upgrades.
section: "blockchain"
order: 19
tags:
  - solidity
  - storage
  - evm
type: "deep"
---
