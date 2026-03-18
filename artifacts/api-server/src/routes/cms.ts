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

export default router;
