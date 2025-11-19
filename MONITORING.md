# Monitoring Guide

## 📊 Monitoring Stack

### Components
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization and dashboards
- **Alertmanager**: Alert routing and notification
- **Node Exporter**: System metrics
- **Postgres Exporter**: Database metrics

## Access

### Local (Docker Compose)
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)
- Alertmanager: http://localhost:9093

### Kubernetes
```bash
kubectl port-forward service/prometheus-service 9090:9090 -n cursor-raffle
kubectl port-forward service/grafana-service 3001:3000 -n cursor-raffle
```

## Metrics

### Backend Metrics
- Request rate (requests/second)
- Response time (p50, p95, p99)
- Error rate (5xx errors)
- JVM memory usage
- Thread pool metrics
- Database connection pool

### Database Metrics
- Connection count
- Query performance
- Database size
- Replication lag (if applicable)
- Lock wait time

### System Metrics
- CPU usage
- Memory usage
- Disk I/O
- Network I/O

## Alerts

### Critical Alerts
- Backend service down
- PostgreSQL down
- High error rate (>10%)
- Database connections (>80)

### Warning Alerts
- High response time (>1s p95)
- High CPU usage (>80%)
- High memory usage (>90%)
- Database growing rapidly

## Dashboards

### Backend Dashboard
- Request rate graph
- Response time percentiles
- Error rate graph
- JVM metrics

### Database Dashboard
- Connection count
- Query performance
- Database size trends
- Active queries

### System Dashboard
- CPU/Memory/Disk usage
- Network metrics
- Container metrics

## Custom Metrics

Add custom metrics in backend:
```java
@Autowired
private MeterRegistry meterRegistry;

public void recordCustomMetric() {
    Counter.builder("custom.metric")
        .tag("tag", "value")
        .register(meterRegistry)
        .increment();
}
```

## Alert Configuration

Edit `monitoring/prometheus/alert_rules.yml` to customize alerts.

Configure notification channels in `monitoring/alertmanager/config.yml`:
- Slack
- Email
- PagerDuty
- Webhooks

