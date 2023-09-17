import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  const version = process.env.npm_package_version;

  res.render('pages/home', { version });
});

export default router;
