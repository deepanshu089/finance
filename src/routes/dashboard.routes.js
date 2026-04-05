const express = require("express");
const { getDashboardSummary } = require("../controllers/dashboard.controller");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard analytics summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Dashboard summary data
 */
router.get("/summary", getDashboardSummary);

module.exports = router;
