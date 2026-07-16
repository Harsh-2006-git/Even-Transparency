const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIyMjhiNWM3LWZkNmMtNDExOC1hNDIyLWNiYjRlYjEwMzEyNiIsImVtYWlsIjoib25ib2FyZGluZ0BldmVuY2FyZ28uaW4iLCJ0eXBlIjoiZW1wbG95ZXIiLCJpYXQiOjE3ODQxMzgwNDcsImV4cCI6MTc4NDE0MTY0NywiaXNzIjoiZXZlbi1jYXJnby1wb3J0YWwifQ.jKixBUOBNV0YhFocy5ufkCpM7rSE3XmkA-kTSz4J3VE";

const endpoints = [
  "/employer/company",
  "/employer/documents",
  "/employer/dashboard-stats"
];

async function run() {
  for (const endpoint of endpoints) {
    const start = Date.now();
    console.log(`\nFetching ${endpoint}...`);
    try {
      const res = await fetch(`http://localhost:5000/api${endpoint}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log(`Status: ${res.status} in ${Date.now() - start} ms`);
      const body = await res.json();
      console.log("Response keys:", Object.keys(body));
      if (res.status !== 200) {
        console.log("Error response:", body);
      }
    } catch (err) {
      console.error(`Fetch failed for ${endpoint}:`, err.message);
    }
  }
}

run();
