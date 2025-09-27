# Wärtsilä Metrics Database Dockerfile
FROM postgres:15-alpine

# Set environment variables for PostgreSQL
ENV POSTGRES_DB=sustainability_metrics
ENV POSTGRES_USER=sustainability_metrics_user

# Copy initialization scripts (PostgreSQL uses different path)
COPY init/ /docker-entrypoint-initdb.d/

# Copy migration scripts
COPY migrations/ /migrations/

# Expose PostgreSQL port
EXPOSE 5432

# Labels
LABEL maintainer="Djanbee"
LABEL description="PostgreSQL database for Wärtsilä metrics data"