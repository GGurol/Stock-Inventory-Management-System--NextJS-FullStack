#!/bin/bash
set -e

mongod --replSet rs0 --keyFile /etc/mongo/mongo.key --bind_ip_all &
MONGOD_PID=$!

until mongosh --eval "print('Waited for connection')" > /dev/null 2>&1; do sleep 1; done
echo "MongoDB is ready for connections."

mongosh --eval 'rs.initiate({_id: "rs0", members: [{_id: 0, host: "db:27017"}]})'
echo "Replica set initiated."

until mongosh --eval "db.isMaster().ismaster" | grep -q "true"; do sleep 1; echo "..."; done
echo "Primary elected."

mongosh --eval "db.getSiblingDB('admin').createUser({user: '${MONGO_USER}', pwd: '${MONGO_PASS}', roles: [{role: 'root', db: 'admin'}]})"
echo "User created."

wait $MONGOD_PID