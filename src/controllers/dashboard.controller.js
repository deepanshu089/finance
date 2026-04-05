const prisma = require("../config/db");

/**
 * @desc    Get dashboard summary statistics
 * @route   GET /api/dashboard/summary
 * @access  Private (All roles)
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default to current month if no dates provided
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.gte = new Date(startDate);
      if (endDate) dateFilter.date.lte = new Date(endDate);
    }

    const baseWhereQuery = {
      isDeleted: false,
      ...dateFilter
    };

    // 1. Calculate totals
    const totals = await prisma.financialRecord.groupBy({
      by: ['type'],
      where: baseWhereQuery,
      _sum: {
        amount: true,
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    totals.forEach((item) => {
      if (item.type === "INCOME") totalIncome = item._sum.amount || 0;
      if (item.type === "EXPENSE") totalExpense = item._sum.amount || 0;
    });

    const netBalance = totalIncome - totalExpense;

    // 2. Category wise totals for expenses
    const categoryExpenses = await prisma.financialRecord.groupBy({
      by: ['category'],
      where: {
        ...baseWhereQuery,
        type: "EXPENSE"
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc'
        }
      }
    });

    const formattedCategoryExpenses = categoryExpenses.map(c => ({
      category: c.category,
      total: c._sum.amount
    }));

    // 3. Recent activity (last 5 records)
    const recentActivity = await prisma.financialRecord.findMany({
      where: baseWhereQuery,
      orderBy: { date: 'desc' },
      take: 5,
      select: {
        id: true,
        amount: true,
        type: true,
        category: true,
        date: true,
      }
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalIncome,
          totalExpense,
          netBalance,
        },
        expensesByCategory: formattedCategoryExpenses,
        recentActivity,
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
};
