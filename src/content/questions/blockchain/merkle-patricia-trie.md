---
ua_question: "Як Ethereum зберігає стан у Modified Merkle Patricia Trie?"
en_question: "How does Ethereum store state in a Modified Merkle Patricia Trie?"
ua_answer: |
  Ethereum використовує **Modified Merkle Patricia Trie (MPT)** -- спеціалізовану структуру даних для зберігання всього стану мережі: балансів акаунтів, коду контрактів, storage контрактів та даних транзакцій. Корінь (root hash) цієї структури зберігається у заголовку кожного блоку, що дозволяє верифікувати цілісність всього стану.

  MPT поєднує дві структури: **Patricia Trie** (для ефективного пошуку за ключами) та **Merkle Tree** (для криптографічної верифікації). Дерево має три типи вузлів: **Branch nodes** (16 дочірніх елементів для кожного hex-символу + значення), **Extension nodes** (спільний префікс шляху для стиснення) та **Leaf nodes** (кінцевий фрагмент шляху + значення). Ключі кодуються у hex (nibbles), а кожен вузол хешується через Keccak-256.

  Коли змінюється навіть один акаунт, змінюються хеші від leaf до root, створюючи новий state root. Це дозволяє **light clients** верифікувати стан без завантаження всього блокчейну -- достатньо Merkle proof (шлях від leaf до root з сусідніми хешами).

  ```javascript
  // Conceptual structure of Ethereum state trie
  // Key: keccak256(address) -> Account state

  // Account state (RLP-encoded):
  // [nonce, balance, storageRoot, codeHash]

  // Example path in trie for address 0xABC...
  // Root -> Branch[A] -> Branch[B] -> Branch[C] -> ... -> Leaf(account)

  // Merkle proof verification (simplified)
  function verifyProof(rootHash, key, value, proof) {
      let currentHash = rootHash;
      for (const node of proof) {
          // Each node in proof is a trie node on the path
          const computedHash = keccak256(rlpEncode(node));
          if (computedHash !== currentHash) return false;
          // Navigate to next node using key nibble
          currentHash = node[key.nextNibble()];
      }
      return currentHash === keccak256(rlpEncode(value));
  }
  ```

  Знання MPT важливе для розуміння, чому storage операції дорогі (кожен запис змінює дерево від leaf до root), як працюють light clients та чому Ethereum потребує state pruning.
en_answer: |
  Ethereum uses a **Modified Merkle Patricia Trie (MPT)** -- a specialized data structure for storing the entire network state: account balances, contract code, contract storage, and transaction data. The root hash of this structure is stored in each block header, allowing verification of the entire state's integrity.

  MPT combines two structures: **Patricia Trie** (for efficient key-based lookups) and **Merkle Tree** (for cryptographic verification). The tree has three node types: **Branch nodes** (16 children for each hex character + value), **Extension nodes** (shared path prefix for compression), and **Leaf nodes** (final path fragment + value). Keys are encoded in hex (nibbles), and each node is hashed via Keccak-256.

  When even a single account changes, hashes from leaf to root change, creating a new state root. This allows **light clients** to verify state without downloading the entire blockchain -- a Merkle proof (path from leaf to root with sibling hashes) is sufficient.

  ```javascript
  // Conceptual structure of Ethereum state trie
  // Key: keccak256(address) -> Account state

  // Account state (RLP-encoded):
  // [nonce, balance, storageRoot, codeHash]

  // Example path in trie for address 0xABC...
  // Root -> Branch[A] -> Branch[B] -> Branch[C] -> ... -> Leaf(account)

  // Merkle proof verification (simplified)
  function verifyProof(rootHash, key, value, proof) {
      let currentHash = rootHash;
      for (const node of proof) {
          // Each node in proof is a trie node on the path
          const computedHash = keccak256(rlpEncode(node));
          if (computedHash !== currentHash) return false;
          // Navigate to next node using key nibble
          currentHash = node[key.nextNibble()];
      }
      return currentHash === keccak256(rlpEncode(value));
  }
  ```

  Understanding MPT is important for grasping why storage operations are expensive (each write modifies the tree from leaf to root), how light clients work, and why Ethereum needs state pruning.
section: "blockchain"
order: 17
tags:
  - data-structures
  - ethereum
  - state
type: "deep"
---
