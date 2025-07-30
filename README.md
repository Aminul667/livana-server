1. npm init -y or yarn init -y
2. yarn add prisma typescript tsx @types/node -D
3. npx tsc --init
4. tsconfig.json:
   Search for rootDir and change it to src --> "rootDir": "./src", "outDir": "./dist"
5. npx prisma
6. npx prisma init (it will create a database url in .env)
7. copy the schema from here
   https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-typescript-PostgreSQL

8. npx prisma migrate dev --name init (to migrate to SQL code)
9. npx prisma studio

10. Install:-->

```tex
    @prisma/client
    ts-node-dev -D
    @prisma/client
    express
    bcrypt
    cloudinary
    cookie-parser
    cors
    date-fns
    dotenv
    http-status
    jsonwebtoken
    multer
    nodemailer
    zod
```

11. add the script

```js
    "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts"
    },
```

12. add "src/server.ts" in the root directory
13. copy and past the code to server.ts

```js
import express from "express";

const app = express();

const port = 3000;

app.listen(port, () => {
  console.log("App is listening on port", port);
});
```

14. run yarn dev
