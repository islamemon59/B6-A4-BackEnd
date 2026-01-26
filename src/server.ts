import app from "./app";
import { prisma } from "./lib/prisma";
const port = process.env.PORT || 5000;

const main = async () => {
  try {
    await prisma.$connect();
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error(error)
    await prisma.$disconnect()
  }
};

main();
