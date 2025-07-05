-- Database initialization script for comment application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom indexes for performance optimization
-- These will be created after TypeORM creates the tables

-- Users table optimizations
-- (TypeORM will create the basic table, we add performance indexes)

-- Comments table optimizations for nested queries
-- Index for efficient path-based queries (materialized path)
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_path ON comments USING gist(path);

-- Index for efficient parent-child queries
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_parent_created ON comments(parent_id, created_at);

-- Index for author queries
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_author_created ON comments(author_id, created_at);

-- Index for deleted comments filtering
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_deleted_created ON comments(is_deleted, created_at);

-- Notifications table optimizations
-- Index for user notifications
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at);

-- Index for unread notifications
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read, created_at);

-- Composite index for notification queries
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_type_read ON notifications(user_id, type, is_read);

-- Database settings for better performance
ALTER DATABASE comment_app SET log_statement = 'none';
ALTER DATABASE comment_app SET log_min_duration_statement = 1000;

-- Connection and performance settings
ALTER DATABASE comment_app SET shared_preload_libraries = 'pg_stat_statements';
ALTER DATABASE comment_app SET max_connections = 100;
ALTER DATABASE comment_app SET shared_buffers = '256MB';
ALTER DATABASE comment_app SET effective_cache_size = '1GB';
ALTER DATABASE comment_app SET maintenance_work_mem = '64MB';
ALTER DATABASE comment_app SET checkpoint_completion_target = 0.9;
ALTER DATABASE comment_app SET wal_buffers = '16MB';
ALTER DATABASE comment_app SET default_statistics_target = 100;