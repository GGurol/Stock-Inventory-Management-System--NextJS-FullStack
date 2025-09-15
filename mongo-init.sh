#!/bin/bash

# Start the MongoDB server in the background
mongod --replSet rs0 --bind_ip_all &

# Capture the process ID of the MongoDB server
MONGOD_PID=$!

# Wait until the MongoDB server is ready to accept connections
until mongosh --eval "print(\"Waited for connection\")" > /dev/null 2>&1
do
  sleep 1
done

echo "Connection finished"
echo "Creating replica set"

# Initiate the replica set. The check ensures this only runs once.
mongosh --eval "rs.status()" | grep -q "no replset config" && mongosh --eval "rs.initiate()"

echo "Replica set created"

# Bring the MongoDB server process to the foreground
wait $MONGOD_PID