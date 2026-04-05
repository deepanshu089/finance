const prisma = require("../config/db");

/**
 * @desc    Get all records with filtering and pagination
 * @route   GET /api/records
 * @access  Private (Admin, Analyst)
 */
const getRecords = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, page, limit } = req.query;

    const query = {
      isDeleted: false,
    };

    if (type) query.type = type;
    if (category) query.category = category;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.gte = new Date(startDate);
      if (endDate) query.date.lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where: query,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          createdBy: {
            select: { id: true, name: true }
          }
        }
      }),
      prisma.financialRecord.count({ where: query })
    ]);

    res.status(200).json({
      success: true,
      count: records.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single record
 * @route   GET /api/records/:id
 * @access  Private (Admin, Analyst)
 */
const getRecord = async (req, res, next) => {
  try {
    const record = await prisma.financialRecord.findFirst({
      where: { 
        id: req.params.id,
        isDeleted: false
      },
      include: {
        createdBy: {
          select: { id: true, name: true }
        }
      }
    });

    if (!record) {
      return res.status(404).json({ success: false, error: "Record not found" });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new record
 * @route   POST /api/records
 * @access  Private (Admin)
 */
const createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await prisma.financialRecord.create({
      data: {
        amount,
        type,
        category,
        date: new Date(date),
        notes,
        createdById: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update record
 * @route   PATCH /api/records/:id
 * @access  Private (Admin)
 */
const updateRecord = async (req, res, next) => {
  try {
    const record = await prisma.financialRecord.findFirst({
      where: { id: req.params.id, isDeleted: false }
    });

    if (!record) {
      return res.status(404).json({ success: false, error: "Record not found" });
    }

    const { amount, type, category, date, notes } = req.body;
    
    const updateData = {};
    if (amount !== undefined) updateData.amount = amount;
    if (type !== undefined) updateData.type = type;
    if (category !== undefined) updateData.category = category;
    if (date !== undefined) updateData.date = new Date(date);
    if (notes !== undefined) updateData.notes = notes;

    const updatedRecord = await prisma.financialRecord.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: updatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft delete record
 * @route   DELETE /api/records/:id
 * @access  Private (Admin)
 */
const deleteRecord = async (req, res, next) => {
  try {
    const record = await prisma.financialRecord.findFirst({
      where: { id: req.params.id, isDeleted: false }
    });

    if (!record) {
      return res.status(404).json({ success: false, error: "Record not found" });
    }

    await prisma.financialRecord.update({
      where: { id: req.params.id },
      data: { isDeleted: true },
    });

    res.status(200).json({
      success: true,
      data: {},
      message: "Record deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
};
