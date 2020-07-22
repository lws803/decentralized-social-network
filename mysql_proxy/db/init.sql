CREATE DATABASE social_network CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE USER 'bob'@'%' IDENTIFIED BY 'banana';

GRANT ALL ON social_network.* TO 'bob'@'%';

USE social_network;

CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> 6fcb42694cbf

CREATE TABLE social_groups (
    id VARCHAR(32) NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    metadata_json JSON, 
    created_at DATETIME NOT NULL DEFAULT now(), 
    updated_at DATETIME, 
    PRIMARY KEY (id), 
    CONSTRAINT uix_name UNIQUE (name)
);

CREATE TABLE users (
    id VARCHAR(32) NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    uid VARCHAR(255) NOT NULL, 
    metadata_json JSON, 
    created_at DATETIME NOT NULL, 
    updated_at DATETIME, 
    PRIMARY KEY (id), 
    CONSTRAINT uix_name UNIQUE (name)
);

CREATE TABLE posts (
    id VARCHAR(32) NOT NULL, 
    metadata_json JSON, 
    created_at DATETIME NOT NULL DEFAULT now(), 
    updated_at DATETIME, 
    social_group_id VARCHAR(32) NOT NULL, 
    owner_id VARCHAR(32) NOT NULL, 
    visibility ENUM('PUBLIC','PRIVATE') NOT NULL, 
    depth INTEGER NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(owner_id) REFERENCES users (id) ON DELETE CASCADE, 
    FOREIGN KEY(social_group_id) REFERENCES social_groups (id) ON DELETE CASCADE
);

CREATE TABLE social_group_members (
    id BIGINT NOT NULL AUTO_INCREMENT, 
    created_at DATETIME NOT NULL DEFAULT now(), 
    updated_at DATETIME, 
    user_id VARCHAR(32) NOT NULL, 
    social_group_id VARCHAR(32) NOT NULL, 
    `role` ENUM('ADMIN','MEMBER') NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(social_group_id) REFERENCES social_groups (id) ON DELETE CASCADE, 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE post_children (
    id BIGINT NOT NULL AUTO_INCREMENT, 
    parent_post_id VARCHAR(32) NOT NULL, 
    child_post_id VARCHAR(32) NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(child_post_id) REFERENCES posts (id) ON DELETE CASCADE, 
    FOREIGN KEY(parent_post_id) REFERENCES posts (id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id VARCHAR(32) NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    created_at DATETIME NOT NULL DEFAULT now(), 
    updated_at DATETIME, 
    post_id VARCHAR(32) NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(post_id) REFERENCES posts (id) ON DELETE CASCADE
);

CREATE TABLE votes (
    id VARCHAR(32) NOT NULL, 
    vote_type ENUM('DOWN','UP') NOT NULL, 
    created_at DATETIME NOT NULL DEFAULT now(), 
    updated_at DATETIME, 
    owner_id VARCHAR(32) NOT NULL, 
    post_id VARCHAR(32) NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(owner_id) REFERENCES users (id) ON DELETE CASCADE, 
    FOREIGN KEY(post_id) REFERENCES posts (id) ON DELETE CASCADE
);

INSERT INTO alembic_version (version_num) VALUES ('6fcb42694cbf');

-- Running upgrade 6fcb42694cbf -> 7a812f4fc62c

CREATE TABLE blockchain (
    id BIGINT NOT NULL AUTO_INCREMENT, 
    hash VARCHAR(512) NOT NULL, 
    preceding_hash VARCHAR(512) NOT NULL, 
    sql_statement JSON NOT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE socialnetwork_version (
    version VARCHAR(512) NOT NULL, 
    PRIMARY KEY (version)
);

CREATE TABLE trackers (
    id BIGINT NOT NULL AUTO_INCREMENT, 
    url VARCHAR(255) NOT NULL, 
    status ENUM('STALE','ACTIVE') NOT NULL, 
    PRIMARY KEY (id)
);

UPDATE alembic_version SET version_num='7a812f4fc62c' WHERE alembic_version.version_num = '6fcb42694cbf';

