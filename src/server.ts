import { useContainer as useClassValidatorContainer } from "class-validator";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { createConnection, useContainer } from "typeorm";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { stitchSchemas } from "@graphql-tools/stitch";
import { makeExecutableSchema } from "@graphql-tools/schema";
import session from "express-session";
import connectRedis from "connect-redis";
import { applyMiddleware } from "graphql-middleware";
import { Container } from "typedi";
import http from "http";
import { v4 } from "uuid";
import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import cors from "cors";

import { permissions } from "./permissions/permissions";
import redisClient from "./redis";
import { UploadRouter } from "./routes/uploadImage";

(async () => {
  const PORT = process.env.NODE_ENV || 7070;
  dotenv.config();

  const RedisStore = connectRedis(session);

  useClassValidatorContainer(Container, { fallback: true, fallbackOnErrors: true });
  useContainer(Container);

  const app = express();
  const httpServer = http.createServer(app);

  app.use(cors({ origin: ["http://localhost:3000", "https://studio.apollographql.com"], credentials: true }));

  app.use(express.json());
  app.use(UploadRouter);
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET_CODE as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 60 * 100 * 200,
        path: "/",
      },
      name: "lq-connect",
      genid: req => {
        return v4();
      },
    })
  );

  app.post("/auth/sessions", (req, res) => {
    console.log(req.session);

    const account_id = req.session!.account_id;
    const profile_id = req!.session!.profile_id;
    if (!account_id || !profile_id) {
      res.status(401).json({ error: "access denied" });
      return;
    }
    res.status(200).json({ data: "ok" });
  });

  const schema = await buildTypeDefsAndResolvers({
    resolvers: [__dirname + "/services/**/resolvers/*.{js,ts}"],
    container: Container,
  });
  const gateway = stitchSchemas({ subschemas: [{ schema: makeExecutableSchema(schema) }] });
  const server = new ApolloServer({
    schema: applyMiddleware(gateway, permissions),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ApolloServerPluginLandingPageLocalDefault()],
    context: ({ req, res }) => {
      const account_id = req.session!.account_id;
      const profile_id = req.session!.profile_id;
      const is_active = req.session!.is_active;
      return { req, res, account_id, profile_id, is_active };
    },
  });
  try {
    const db = await createConnection({
      type: "postgres",
      host: "localhost",
      username: "testuser",
      password: "casa",
      database: "testdb",
      entities: [__dirname + "/services/**/entities/*.{js,ts}"],
      synchronize: true,
      port: 5432,
      logging: false,
    });
    if (db.isConnected) {
      console.log("connected to database");
    }
  } catch (error) {
    console.log(error);
  }
  await server.start();
  server.applyMiddleware({ app, cors: false });
  await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(` 🚀  Server ready at http://localhost:${PORT}${server.graphqlPath}`);
})();
