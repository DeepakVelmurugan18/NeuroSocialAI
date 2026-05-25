const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log(users.map(u => ({ email: u.email, fb: u.facebookConnected, fbF: u.facebookFollowers, ig: u.instagramConnected, yt: u.youtubeConnected, ytS: u.youtubeSubs })));
}
main().finally(() => prisma.$disconnect());
