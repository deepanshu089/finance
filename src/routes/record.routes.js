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
 * /records:
 *   get:
 *     summary: Get all records (Analyst or Admin)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 */
router.route("/")
  .get(restrictTo("ANALYST", "ADMIN"), validate(querySchema), getRecords)
  .post(restrictTo("ADMIN"), validate(createRecordSchema), createRecord);

router.route("/:id")
  .get(restrictTo("ANALYST", "ADMIN"), getRecord)
  .patch(restrictTo("ADMIN"), validate(updateRecordSchema), updateRecord)
  .delete(restrictTo("ADMIN"), deleteRecord);

module.exports = router;
