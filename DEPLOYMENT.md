# Deployment Guide

## 🐳 Docker Compose Deployment

### Production
```bash
docker-compose up -d
```

### Development
```bash
docker-compose -f docker-compose.dev.yml up
```

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (minikube, k3s, GKE, EKS, AKS)
- kubectl configured
- Docker images built and pushed to registry

### Deploy
```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Apply all resources
kubectl apply -k k8s/

# Or apply individually
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/monitoring.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/backup-cronjob.yaml
```

### Check Status
```bash
kubectl get all -n cursor-raffle
kubectl get pods -n cursor-raffle
kubectl logs -f deployment/backend -n cursor-raffle
```

### Scale
```bash
kubectl scale deployment backend --replicas=3 -n cursor-raffle
kubectl scale deployment frontend --replicas=3 -n cursor-raffle
```

## 🔄 Jenkins CI/CD

### Setup Jenkins
1. Install Jenkins plugins:
   - Docker Pipeline
   - Kubernetes
   - Pipeline
   - Git

2. Configure credentials:
   - `docker-registry-url` - Docker registry credentials
   - `kubeconfig` - Kubernetes config

3. Create pipeline:
   - New Item → Pipeline
   - Definition: Pipeline script from SCM
   - SCM: Git
   - Script Path: `Jenkinsfile`

### Run Pipeline
```bash
# Manual trigger
# Or push to main/master branch
```

## 📊 Monitoring

### Access
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (default: admin/admin)
- Alertmanager: http://localhost:9093

### Dashboards
- Backend Metrics
- Database Metrics
- System Resources

## 💾 Backup & Recovery

### Manual Backup
```bash
docker-compose exec postgres-backup /backup/postgres-backup.sh backup
```

### Automated Backup
- Runs daily at 2 AM (cronjob)
- Kubernetes CronJob handles scheduling

### Point-In-Time Recovery
```bash
# List backups
docker-compose exec postgres-backup /backup/postgres-restore.sh list

# Restore to specific time
docker-compose exec postgres-backup /backup/postgres-restore.sh restore 20240115_020000 "2024-01-15 10:30:00"
```

### Backup Retention
- Daily backups kept for 7 days
- Last 5 backups always retained
- WAL archives compressed after 1 hour

## 🔐 Secrets Management

### Docker Compose
- Environment variables in docker-compose.yml
- Use `.env` file for sensitive data (not in git)

### Kubernetes
- Secrets stored in `k8s/configmap.yaml`
- Use external secret manager (AWS Secrets Manager, HashiCorp Vault) for production

## 📈 Scaling

### Horizontal Pod Autoscaling (K8s)
- Backend: 2-5 replicas (CPU/Memory based)
- Frontend: 2-4 replicas (CPU based)

### Manual Scaling
```bash
kubectl scale deployment backend --replicas=5 -n cursor-raffle
```

## 🔍 Troubleshooting

### Pods Not Starting
```bash
kubectl describe pod <pod-name> -n cursor-raffle
kubectl logs <pod-name> -n cursor-raffle
```

### Database Connection Issues
```bash
kubectl exec -it postgres-0 -n cursor-raffle -- psql -U postgres -d cursor_raffle
```

### Monitoring Issues
```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Check Grafana datasources
# Login to Grafana and check configuration
```

