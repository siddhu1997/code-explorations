# Setting up Trino (PrestoSQL) for HyperLogLog

This is a small tutorial on running Trino on Docker and using HyperLogLog to get active number of connections.

<i>Note</i>: This guide is focused for Windows users.

Let's start by creating a Docker network called `trino-network`.
```
docker network create trino-network
```

## Step 1: Setting up MySQL 
We'll setup MySQL first so that we can use it with Trino.

#### Step 1.1 Pull MySQL docker image
```
docker pull mysql:latest
```

#### Step 1.2 Setup with default credentials
This will create root with `root_password` password. For demonstration this is fine, but when you are working on a real project do set up authentication properly!
```
docker run --name mysql-server -p 3306:3306 --network trino-network -e MYSQL_ROOT_PASSWORD=root_password -d mysql:latest
```

#### Step 1.3 Accessing MySQL
After executing the below command you'll be asked enter the `root_password` in the previous step.

```
docker exec -it mysql-server mysql -u root -p
```

#### Step 1.4 Creating a user for Trino
After logging into the MySQL server, you can create a database and a user for Trino. Do update `trino_password` below.

```
CREATE DATABASE connections;
CREATE USER 'trino'@'%' IDENTIFIED BY 'trino_password';
GRANT ALL PRIVILEGES ON connections.* TO 'trino'@'%';
FLUSH PRIVILEGES;
```

## Step 1: Setting up PrestoSQL (Trino) on Docker
Let's start by pulling the Trino Docker image.
```
docker pull trinodb/trino:latest
```
Now start a command prompt in the repo's directory.

#### Start the Prestor Coordinator
```
docker run -d `
    --name trino-coordinator `
    --network trino-network `
    -p 8080:8080 `
    -v ${PWD}\Coordinator:/etc/trino `
    trinodb/trino:latest
```

#### Start the Worker Nodes
```
docker run -d `
    --name trino-worker1 `
    --network trino-network `
    -v ${PWD}\Worker:/etc/trino `
    trinodb/trino:latest
```

Repeat the above command with different names (e.g., `trino-worker2`, `trino-worker3`, etc.) for additional worker nodes.

## Step 2: Creating fake data
You can find a `script.js` file. We'll use Node.js to insert data into our cluster. Assuminh your are in desired directory execute:

```
node script.js
```

## Step 3: Querying the DB with HyperLogLog
 To execute the query, open the presto db CLI:
 ```
 docker exec -it presto-coordinator presto
 ```

 Then run the following query to get the cardinality estimate:

 ```
 SELECT approx_distinct(user_id) FROM connections;
 ```

 ## Next steps:
 - Test your setup and see the workers list [here](http://localhost:8080/ui/workers.html) 
 - Verify the result (cardinality) from Step 2 and Step 3. Remember HLL gives you an estimate and not the exact value.


