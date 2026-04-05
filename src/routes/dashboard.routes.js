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
 *     description: Provides a real-time overview of financial health, including Total Income, Total Expenses, and Net Balance. Includes a breakdown of expenses by category. Accessible by all roles.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         description: Start date for analytics (ISO string Format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2024-12-31T23:59:59Z"
 *         description: End date for analytics (ISO string Format)
 *     responses:
 *       200:
 *         description: Dashboard summary data
 */
router.get("/summary", getDashboardSummary);

module.exports = router;
