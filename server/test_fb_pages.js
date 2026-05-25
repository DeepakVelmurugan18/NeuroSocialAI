const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'deepakdivya241@gmail.com' } });
  if (!user || !user.facebookAccessToken) return console.log("No FB token");

  try {
    const pagesRes = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${user.facebookAccessToken}`);
    console.log("Pages returned by Meta:", pagesRes.data);
  } catch (err) {
    console.log("Error:", err.response?.data || err.message);
  }
}
main().finally(() => prisma.$disconnect());
