# Wärtsilä Operations Database Dockerfile
FROM postgres:15-alpine

# Set environment variables for PostgreSQL
ENV POSTGRES_DB=sustainability_platform
ENV POSTGRES_USER=sustainability_user

# Copy initialization scripts (PostgreSQL uses different path)
COPY init/ /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432

# Labels
LABEL maintainer="Djanbee"
LABEL description="PostgreSQL database for Wärtsilä operations data"