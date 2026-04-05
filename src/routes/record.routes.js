const express = require("express");
const { 
  getRecords, 
  getRecord, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} = require("../controllers/record.controller");
const { protect, restrictTo } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const { 
  createRecordSchema, 
  updateRecordSchema, 
  querySchema 
} = require("../validations/record.validation");

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Financial records management (CRUD)
 */

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get all records with filtering and pagination
 *     description: Accessible by Admin and Analyst. Viewers are restricted.
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *         description: Filter by record type (e.g., INCOME or EXPENSE)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name (e.g., Salary, Food, Rent)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter records from this date (ISO string Format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter records up to this date (ISO string Format)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: List of financial records
 */
router.route("/")
  .get(restrictTo("ANALYST", "ADMIN"), validate(querySchema), getRecords)
  /**
   * @swagger
   * /records:
   *   post:
   *     summary: Create a new financial record (Admin only)
   *     tags: [Records]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - amount
   *               - type
   *               - category
   *               - date
   *             properties:
   *               amount:
   *                 type: number
   *                 example: 1500.50
   *               type:
   *                 type: string
   *                 enum: [INCOME, EXPENSE]
   *                 example: INCOME
   *               category:
   *                 type: string
   *                 example: Freelance Project
   *               date:
   *                 type: string
   *                 format: date-time
   *                 example: "2024-04-10T10:00:00Z"
   *               notes:
   *                 type: string
   *                 example: "Payment for the Q1 website update"
   *     responses:
   *       201:
   *         description: Record created successfully
   *       403:
   *         description: Forbidden (Only Admins can create records)
   */
  .post(restrictTo("ADMIN"), validate(createRecordSchema), createRecord);

router.route("/:id")
  /**
   * @swagger
   * /records/{id}:
   *   get:
   *     summary: Get a single record by ID
   *     tags: [Records]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The record's unique CUID
   *     responses:
   *       200:
   *         description: Record details
   *       404:
   *         description: Record not found
   */
  .get(restrictTo("ANALYST", "ADMIN"), getRecord)
  /**
   * @swagger
   * /records/{id}:
   *   patch:
   *     summary: Update an existing record (Admin only)
   *     tags: [Records]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               amount:
   *                 type: number
   *                 example: 2000
   *               category:
   *                 type: string
   *                 example: Updated Bonus
   *     responses:
   *       200:
   *         description: Record updated successfully
   */
  .patch(restrictTo("ADMIN"), validate(updateRecordSchema), updateRecord)
  /**
   * @swagger
   * /records/{id}:
   *   delete:
   *     summary: Soft delete a record (Admin only)
   *     tags: [Records]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Record deleted successfully (isDeleted marked as true)
   */
  .delete(restrictTo("ADMIN"), deleteRecord);

module.exports = router;
