const express = require("express");
const prisma = require("../config/db");
const { protect, restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", restrictTo("ADMIN"), async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true }
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Update a user's role (Admin only)
 *     description: Change the role of any user to ADMIN, ANALYST, or VIEWER. Immediately takes effect for that user's next request.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique user ID (CUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [VIEWER, ANALYST, ADMIN]
 *                 example: ANALYST
 *     responses:
 *       200:
 *         description: User role updated successfully
 */
router.patch("/:id/role", restrictTo("ADMIN"), async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
