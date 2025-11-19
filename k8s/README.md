# Kubernetes Deployment

## Quick Start

```bash
# Deploy everything
kubectl apply -k k8s/

# Check status
kubectl get all -n cursor-raffle

# View logs
kubectl logs -f deployment/backend -n cursor-raffle
```

## Components

- **Namespace**: cursor-raffle
- **PostgreSQL**: StatefulSet with persistent storage
- **Backend**: Deployment with HPA (2-5 replicas)
- **Frontend**: Deployment with HPA (2-4 replicas)
- **Monitoring**: Prometheus + Grafana
- **Backup**: CronJob for daily backups
- **Ingress**: Nginx ingress with TLS

## Port Forwarding

```bash
# Backend
kubectl port-forward service/backend-service 8080:8080 -n cursor-raffle

# Frontend
kubectl port-forward service/frontend-service 8081:8081 -n cursor-raffle

# Grafana
kubectl port-forward service/grafana-service 3001:3000 -n cursor-raffle

# Prometheus
kubectl port-forward service/prometheus-service 9090:9090 -n cursor-raffle
```

## Backup & Recovery

```bash
# List backup cronjobs
kubectl get cronjob -n cursor-raffle

# Manual backup
kubectl create job --from=cronjob/postgres-backup manual-backup-$(date +%s) -n cursor-raffle

# View backup jobs
kubectl get jobs -n cursor-raffle
```

