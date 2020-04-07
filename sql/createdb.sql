SELECT 'CREATE DATABASE piirtopeli'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'piirtopeli')\gexec
\c piirtopeli