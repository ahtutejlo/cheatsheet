---
ua_question: "Як організувати мультитенантність у Kubernetes для кількох команд?"
en_question: "How do you organize multi-tenancy in Kubernetes for multiple teams?"
ua_answer: |
  **Scenario:** П'ять команд розробників спільно використовують один Kubernetes-кластер. Виникають проблеми: одна команда споживає всі ресурси, Pod однієї команди можуть звертатися до сервісів іншої, і немає чіткого розмежування прав доступу.

  **Approach:**
  1. Створити окремий namespace для кожної команди з ResourceQuotas для обмеження ресурсів
  2. Налаштувати NetworkPolicies для ізоляції мережевого трафіку між командами
  3. Створити RBAC-ролі, що обмежують доступ кожної команди лише до свого namespace

  **Solution:**
  ```yaml
  # Namespace for team-alpha
  apiVersion: v1
  kind: Namespace
  metadata:
    name: team-alpha
    labels:
      team: alpha
  ---
  # ResourceQuota -- limit team resource consumption
  apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: team-alpha-quota
    namespace: team-alpha
  spec:
    hard:
      requests.cpu: "8"
      requests.memory: "16Gi"
      limits.cpu: "16"
      limits.memory: "32Gi"
      pods: "50"
      persistentvolumeclaims: "10"
      services.loadbalancers: "2"
  ---
  # LimitRange -- default limits for pods without explicit resources
  apiVersion: v1
  kind: LimitRange
  metadata:
    name: team-alpha-limits
    namespace: team-alpha
  spec:
    limits:
      - default:
          cpu: "500m"
          memory: "256Mi"
        defaultRequest:
          cpu: "100m"
          memory: "128Mi"
        type: Container
  ---
  # NetworkPolicy -- deny all ingress from other namespaces
  apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    name: deny-cross-namespace
    namespace: team-alpha
  spec:
    podSelector: {}
    policyTypes:
      - Ingress
    ingress:
      - from:
          - namespaceSelector:
              matchLabels:
                team: alpha
  ---
  # RBAC -- Role for team namespace access
  apiVersion: rbac.authorization.k8s.io/v1
  kind: Role
  metadata:
    name: team-alpha-developer
    namespace: team-alpha
  rules:
    - apiGroups: ["", "apps", "batch"]
      resources: ["pods", "deployments", "services", "configmaps", "secrets", "jobs"]
      verbs: ["get", "list", "watch", "create", "update", "delete"]
    - apiGroups: [""]
      resources: ["pods/log", "pods/exec"]
      verbs: ["get", "create"]
  ---
  # RoleBinding -- bind team members to role
  apiVersion: rbac.authorization.k8s.io/v1
  kind: RoleBinding
  metadata:
    name: team-alpha-binding
    namespace: team-alpha
  subjects:
    - kind: Group
      name: team-alpha-devs
      apiGroup: rbac.authorization.k8s.io
  roleRef:
    kind: Role
    name: team-alpha-developer
    apiGroup: rbac.authorization.k8s.io
  ```

  ```bash
  # Apply configuration for all teams
  for team in alpha beta gamma delta epsilon; do
    kubectl apply -f namespace-${team}.yaml
  done

  # Verify resource quotas
  kubectl get resourcequota -A

  # Test network isolation
  kubectl exec -n team-alpha test-pod -- curl -s team-beta-svc.team-beta.svc:80
  # Should timeout if NetworkPolicy is working

  # Check RBAC permissions
  kubectl auth can-i create deployments -n team-alpha --as=user@team-alpha
  kubectl auth can-i create deployments -n team-beta --as=user@team-alpha
  ```

  Додатково розгляньте: Pod Security Standards для обмеження привілейованих контейнерів, OPA Gatekeeper для policy enforcement, та ієрархічні namespace (HNC) для спрощення управління великою кількістю команд.
en_answer: |
  **Scenario:** Five development teams share a single Kubernetes cluster. Problems arise: one team consumes all resources, Pods from one team can access another team's services, and there is no clear access control separation.

  **Approach:**
  1. Create a separate namespace for each team with ResourceQuotas to limit resource consumption
  2. Configure NetworkPolicies to isolate network traffic between teams
  3. Create RBAC roles that restrict each team's access to their own namespace only

  **Solution:**
  ```yaml
  # Namespace for team-alpha
  apiVersion: v1
  kind: Namespace
  metadata:
    name: team-alpha
    labels:
      team: alpha
  ---
  # ResourceQuota -- limit team resource consumption
  apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: team-alpha-quota
    namespace: team-alpha
  spec:
    hard:
      requests.cpu: "8"
      requests.memory: "16Gi"
      limits.cpu: "16"
      limits.memory: "32Gi"
      pods: "50"
      persistentvolumeclaims: "10"
      services.loadbalancers: "2"
  ---
  # LimitRange -- default limits for pods without explicit resources
  apiVersion: v1
  kind: LimitRange
  metadata:
    name: team-alpha-limits
    namespace: team-alpha
  spec:
    limits:
      - default:
          cpu: "500m"
          memory: "256Mi"
        defaultRequest:
          cpu: "100m"
          memory: "128Mi"
        type: Container
  ---
  # NetworkPolicy -- deny all ingress from other namespaces
  apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    name: deny-cross-namespace
    namespace: team-alpha
  spec:
    podSelector: {}
    policyTypes:
      - Ingress
    ingress:
      - from:
          - namespaceSelector:
              matchLabels:
                team: alpha
  ---
  # RBAC -- Role for team namespace access
  apiVersion: rbac.authorization.k8s.io/v1
  kind: Role
  metadata:
    name: team-alpha-developer
    namespace: team-alpha
  rules:
    - apiGroups: ["", "apps", "batch"]
      resources: ["pods", "deployments", "services", "configmaps", "secrets", "jobs"]
      verbs: ["get", "list", "watch", "create", "update", "delete"]
    - apiGroups: [""]
      resources: ["pods/log", "pods/exec"]
      verbs: ["get", "create"]
  ---
  # RoleBinding -- bind team members to role
  apiVersion: rbac.authorization.k8s.io/v1
  kind: RoleBinding
  metadata:
    name: team-alpha-binding
    namespace: team-alpha
  subjects:
    - kind: Group
      name: team-alpha-devs
      apiGroup: rbac.authorization.k8s.io
  roleRef:
    kind: Role
    name: team-alpha-developer
    apiGroup: rbac.authorization.k8s.io
  ```

  ```bash
  # Apply configuration for all teams
  for team in alpha beta gamma delta epsilon; do
    kubectl apply -f namespace-${team}.yaml
  done

  # Verify resource quotas
  kubectl get resourcequota -A

  # Test network isolation
  kubectl exec -n team-alpha test-pod -- curl -s team-beta-svc.team-beta.svc:80
  # Should timeout if NetworkPolicy is working

  # Check RBAC permissions
  kubectl auth can-i create deployments -n team-alpha --as=user@team-alpha
  kubectl auth can-i create deployments -n team-beta --as=user@team-alpha
  ```

  Additionally consider: Pod Security Standards for restricting privileged containers, OPA Gatekeeper for policy enforcement, and Hierarchical Namespaces (HNC) for simplifying management of many teams.
section: "kubernetes"
order: 30
tags:
  - namespaces
  - multi-tenancy
  - rbac
type: "practical"
---
