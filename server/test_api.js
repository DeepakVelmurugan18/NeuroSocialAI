const axios = require('axios');
async function main() {
  try {
    const syncRes = await axios.get('http://localhost:5000/api/stats/sync');
    console.log("SYNC SUCCESS:", syncRes.data);
  } catch (err) {
    console.log("SYNC ERROR:", err.response?.data || err.message);
  }
  
  try {
    const statsRes = await axios.get('http://localhost:5000/api/stats');
    console.log("STATS:", statsRes.data);
  } catch (err) {
    console.log("STATS ERROR:", err.response?.data || err.message);
  }
}
main();
