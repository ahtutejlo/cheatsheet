---
ua_question: "Які проблеми масштабованості є у блокчейні?"
en_question: "What scalability challenges exist in blockchain?"
ua_answer: |
  **Масштабованість** -- це одна з головних проблем блокчейну, відома як частина **трилеми блокчейну**: неможливо одночасно досягти максимальної децентралізації, безпеки та масштабованості.

  **Проблеми:**
  - **Обмежена пропускна здатність** -- Bitcoin обробляє ~7 TPS, Ethereum ~30 TPS (порівняно з Visa ~65,000 TPS)
  - **Великий час підтвердження** -- транзакції можуть очікувати хвилини або навіть години
  - **Зростання розміру блокчейну** -- повна нода Bitcoin займає сотні гігабайт
  - **Високі комісії** -- при перевантаженні мережі комісії різко зростають

  **Рішення масштабованості:**
  - **Layer 2** -- рішення поверх основного блокчейну (Lightning Network для Bitcoin, Rollups для Ethereum)
  - **Sharding** -- розділення мережі на паралельні підмережі (планується для Ethereum)
  - **Sidechains** -- окремі блокчейни, з'єднані з основним (Polygon)
  - **State Channels** -- офчейн транзакції з фіналізацією на основному ланцюзі
  - **Optimistic Rollups** -- пакетне виконання транзакцій офчейн з оптимістичною перевіркою (Optimism, Arbitrum)
  - **ZK-Rollups** -- використання доказів з нульовим знанням для компресії транзакцій (zkSync, StarkNet)
en_answer: |
  **Scalability** is one of the main challenges of blockchain, known as part of the **blockchain trilemma**: it is impossible to simultaneously achieve maximum decentralization, security, and scalability.

  **Problems:**
  - **Limited throughput** -- Bitcoin processes ~7 TPS, Ethereum ~30 TPS (compared to Visa ~65,000 TPS)
  - **Long confirmation times** -- transactions can wait minutes or even hours
  - **Growing blockchain size** -- a full Bitcoin node takes hundreds of gigabytes
  - **High fees** -- fees spike dramatically during network congestion

  **Scalability solutions:**
  - **Layer 2** -- solutions built on top of the main blockchain (Lightning Network for Bitcoin, Rollups for Ethereum)
  - **Sharding** -- splitting the network into parallel sub-networks (planned for Ethereum)
  - **Sidechains** -- separate blockchains connected to the main one (Polygon)
  - **State Channels** -- off-chain transactions with finalization on the main chain
  - **Optimistic Rollups** -- batch execution of transactions off-chain with optimistic verification (Optimism, Arbitrum)
  - **ZK-Rollups** -- using zero-knowledge proofs for transaction compression (zkSync, StarkNet)
section: "blockchain"
order: 13
tags:
  - scalability
---
