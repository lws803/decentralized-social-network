const IpfsClient = require("ipfs-http-client");
const OrbitDB = require("orbit-db");

const ipfs = IpfsClient("/ip4/127.0.0.1/tcp/5001");

async function testDB() {
  const orbitdb = await OrbitDB.createInstance(ipfs);
  console.log(orbitdb.identity.id);
  var options = {
    accessController: {
      write: ["*"],
    },
    overwrite: true,
    replicate: true,
    meta: { hello: "meta hello" },
  };
  const db = await orbitdb.create("test-sharing", "eventlog", options);
  // TODO: Create or use existing
  await db.load();
  const dbAddress = await orbitdb.determineAddress(
    "test-sharing",
    "eventlog",
    options
  );
  console.log(dbAddress);

  for (let i = 0; i < 100; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const hash = await db.add("world");
    console.log(hash);
  }

  const all = db
    .iterator({ limit: -1 })
    .collect()
    .map(e => e.payload.value);
  console.log(all);
  await db.drop();
}

// Replica
async function openDB() {
  const orbitdb = await OrbitDB.createInstance(ipfs);
  const db = await orbitdb.open(
    "/orbitdb/zdpuB15qAeDBjLV5YV4NEEM7QFcDdAxFcp5gQhiYxMiYqgFpH/test-sharing",
    {
      replicate: true,
      overwrite: true,
    }
  );
  await db.load();

  db.events.on("replicate.progress", (address, hash, entry, progress, have) => {
    console.log(address, progress);
  });
  db.events.on("replicate", address => {
    const all = db
      .iterator({ limit: -1 })
      .collect()
      .map(e => e.payload.value);
    console.log(all);
  });
  const all = db
    .iterator({ limit: -1 })
    .collect()
    .map(e => e.payload.value);
  console.log(all);
}

testDB()
  .then(() => {
    console.log("done");
  })
  .catch(err => {
    console.log(err);
  });
