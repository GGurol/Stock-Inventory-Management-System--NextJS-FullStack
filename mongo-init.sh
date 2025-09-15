#!/bin/bash

# Start the MongoDB server in the background WITH the keyFile
mongod --replSet rs0 --keyFile /etc/mongo/mongo.key --bind_ip_all &

# Capture the process ID of the MongoDB server
MONGOD_PID=$!

# Construct the connection string with credentials from environment variables
MONGO_URI="mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/admin"

# Wait until the MongoDB server is ready to accept connections
until mongosh "${MONGO_URI}" --eval "print(\"Waited for connection\")" > /dev/null 2>&1
do
  sleep 1
done

echo "Connection finished"
echo "Creating replica set"

# Initiate the replica set using the authenticated connection string
mongosh "${MONGO_URI}" --eval "rs.status()" | grep -q "no replset config" && mongosh "${MONGO_URI}" --eval "rs.initiate()"

echo "Replica set created"

# Wait until the replica set has a PRIMARY member
echo "Waiting for replica set to elect a primary..."
until mongosh "${MONGO_URI}" --eval "db.isMaster().ismaster" | grep -q "true"
do
  sleep 1
  echo "..."
done
echo "Primary elected."

# Bring the MongoDB server process to the foreground
wait $MONGOD_PID