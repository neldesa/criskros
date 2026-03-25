import { Router, type IRouter } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router: IRouter = Router();

const strapiUrl = process.env.STRAPI_URL || "http://localhost:9000";

router.use(
  "/cms",
  createProxyMiddleware({
    target: strapiUrl,
    changeOrigin: true,
    pathRewrite: { "^/api/cms": "" },
  })
);

router.use(
  "/strapi-admin",
  createProxyMiddleware({
    target: strapiUrl,
    changeOrigin: true,
    pathRewrite: { "^/api/strapi-admin": "" },
    on: {
      error: (err, req, res) => {
        (res as any).status(502).json({ error: "Strapi admin unavailable" });
      },
    },
  })
);

export const adminRouter: IRouter = Router();

adminRouter.use(
  "/",
  createProxyMiddleware({
    target: strapiUrl,
    changeOrigin: true,
    pathRewrite: { "^/": "/admin/" },
    on: {
      error: (err, req, res) => {
        (res as any).status(502).json({ error: "Strapi admin unavailable" });
      },
    },
  })
);

export default router;
