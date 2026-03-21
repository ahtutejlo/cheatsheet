---
ua_question: "Що таке дерево Меркла?"
en_question: "What is a Merkle tree?"
ua_answer: |
  **Дерево Меркла** (Merkle tree) -- це деревоподібна структура даних, де кожний листовий вузол містить хеш блоку даних, а кожний нелистовий вузол містить хеш своїх дочірніх вузлів. Корінь дерева (Merkle root) є одним хешем, що представляє всі дані.

  У блокчейні дерево Меркла використовується для ефективної організації та верифікації транзакцій у блоці. Замість перевірки всіх транзакцій, можна перевірити лише **Merkle proof** -- шлях від конкретної транзакції до кореня.

  **Переваги:**
  - **Ефективна верифікація** -- перевірка наявності транзакції потребує O(log n) операцій замість O(n)
  - **Економія трафіку** -- легкі клієнти (SPV nodes) можуть перевіряти транзакції без завантаження всього блоку
  - **Виявлення змін** -- будь-яка зміна в транзакції змінює Merkle root

  Структура для 4 транзакцій (TX):
  - Рівень 0 (листки): `H(TX1)`, `H(TX2)`, `H(TX3)`, `H(TX4)`
  - Рівень 1: `H(H(TX1) + H(TX2))`, `H(H(TX3) + H(TX4))`
  - Рівень 2 (корінь): `H(H12 + H34)` -- це **Merkle Root**, який зберігається у заголовку блоку
en_answer: |
  A **Merkle tree** is a tree-like data structure where each leaf node contains a hash of a data block, and each non-leaf node contains a hash of its child nodes. The root of the tree (Merkle root) is a single hash representing all the data.

  In blockchain, a Merkle tree is used for efficient organization and verification of transactions in a block. Instead of checking all transactions, you can verify just a **Merkle proof** -- the path from a specific transaction to the root.

  **Advantages:**
  - **Efficient verification** -- checking transaction existence requires O(log n) operations instead of O(n)
  - **Traffic savings** -- lightweight clients (SPV nodes) can verify transactions without downloading the entire block
  - **Change detection** -- any change in a transaction changes the Merkle root

  Structure for 4 transactions (TX):
  - Level 0 (leaves): `H(TX1)`, `H(TX2)`, `H(TX3)`, `H(TX4)`
  - Level 1: `H(H(TX1) + H(TX2))`, `H(H(TX3) + H(TX4))`
  - Level 2 (root): `H(H12 + H34)` -- this is the **Merkle Root**, stored in the block header
section: "blockchain"
order: 7
tags:
  - data-structures
---
