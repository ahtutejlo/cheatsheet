---
ua_question: "Як працюють CNI-плагіни та мережева модель Kubernetes?"
en_question: "How do CNI plugins work and what is the Kubernetes networking model?"
ua_answer: |
  **Container Network Interface (CNI)** -- це специфікація, яка визначає, як мережеві плагіни повинні налаштовувати мережу для контейнерів. Kubernetes делегує всю мережеву конфігурацію CNI-плагіну, який відповідає за призначення IP-адрес Pod та забезпечення зв'язку між ними.

  Мережева модель Kubernetes вимагає, щоб: кожен Pod мав унікальну IP-адресу, всі Pod могли спілкуватися один з одним без NAT, і агенти на вузлі могли спілкуватися з усіма Pod на цьому вузлі. CNI-плагіни реалізують ці вимоги різними способами.

  На рівні вузла CNI створює **veth-пари** (virtual ethernet) -- один кінець всередині мережевого простору імен Pod, інший на хостовому мосту (bridge). Для міжвузлової комунікації різні плагіни використовують різні підходи: **Flannel** використовує VXLAN-оверлей для інкапсуляції пакетів, **Calico** використовує BGP для маршрутизації без оверлею, що забезпечує кращу продуктивність.

  ```bash
  # Check which CNI plugin is installed
  ls /etc/cni/net.d/

  # View CNI configuration
  cat /etc/cni/net.d/10-calico.conflist

  # Inspect veth pairs on a node
  ip link show type veth

  # Check pod network namespace
  kubectl exec my-pod -- ip addr show

  # View Calico node status
  calicoctl node status

  # Check IP pool allocation
  calicoctl ipam show --show-blocks
  ```

  Розуміння CNI важливе для діагностики мережевих проблем у кластері, вибору правильного плагіна для конкретного сценарію та оптимізації мережевої продуктивності.
en_answer: |
  **Container Network Interface (CNI)** is a specification that defines how network plugins should configure networking for containers. Kubernetes delegates all network configuration to the CNI plugin, which is responsible for assigning IP addresses to Pods and ensuring connectivity between them.

  The Kubernetes networking model requires that: each Pod has a unique IP address, all Pods can communicate with each other without NAT, and agents on a node can communicate with all Pods on that node. CNI plugins implement these requirements in different ways.

  At the node level, CNI creates **veth pairs** (virtual ethernet) -- one end inside the Pod's network namespace, the other on the host bridge. For inter-node communication, different plugins use different approaches: **Flannel** uses VXLAN overlay to encapsulate packets, **Calico** uses BGP for overlay-free routing, providing better performance.

  ```bash
  # Check which CNI plugin is installed
  ls /etc/cni/net.d/

  # View CNI configuration
  cat /etc/cni/net.d/10-calico.conflist

  # Inspect veth pairs on a node
  ip link show type veth

  # Check pod network namespace
  kubectl exec my-pod -- ip addr show

  # View Calico node status
  calicoctl node status

  # Check IP pool allocation
  calicoctl ipam show --show-blocks
  ```

  Understanding CNI is important for diagnosing network issues in a cluster, choosing the right plugin for a specific scenario, and optimizing network performance.
section: "kubernetes"
order: 18
tags:
  - networking
  - cni
  - internals
type: "deep"
---
