// Async handler use karte hain async errors ko handle karne ke liye
import asyncHandler from "../utils/asyncHandler.js";
// Stamuraiuser aur Stamuraitask models ko import karte hain
import { Stamuraiuser } from "../models/userModels.js";
import Stamuraitask from "../models/taskModels.js";

// Admin dashboard ka data fetch karne ka function
export const getAdminDashboard = asyncHandler(async (req, res) => {
  //step 1 URL se userId nikal rahe hain (id li user parama se)
  const { userId } = req.params;
  console.log(userId);

  //step -2 Check karte hain ki user admin hai ya nahi (us user id ko mongo me search kiya)
  const user = await Stamuraiuser.findById(userId);
  // agar user nahi hai to use tata bol diye
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  //step-3
  // 1  Total users ka count nikaalte hain (ab user total user ka count nikale )
  const totalUsers = await Stamuraiuser.countDocuments({
    // $nin : [admin, moderator feild ko exclude kar de (mongodb query )]
    role: { $nin: ["admin", "moderator"] },
  });

  // Is month ke finished tasks ka count karte hain
  const totalCompletedTasks = await Stamuraitask.countDocuments({
    status: "completed",
  });
  // Pending tasks ka count karte hain
  const totalPendingTasks = await Stamuraitask.countDocuments({
    status: "pending",
  });

  // Cancelled tasks ka count karte hain
  const totalCancelledTasks = await Stamuraitask.countDocuments({
    status: "cancelled",
  });

  // Current month ke start aur end ka date range nikalte hain
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Total tasks ka count (is month me assign kiye gaye)
  const totalMonthlyTasks = await Stamuraitask.countDocuments({
    createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
  });

  // Current date se pichle 5 months ka range calculate karte hain
  const sixMonthsAgo = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 5,
    1
  );

  const monthlyPerformance = await Stamuraitask.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo, $lte: currentDate },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          status: "$status",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: { month: "$_id.month", year: "$_id.year" },
        finished: {
          $sum: {
            $cond: [{ $eq: ["$_id.status", "completed"] }, "$count", 0],
          },
        },
        pending: {
          $sum: {
            $cond: [{ $eq: ["$_id.status", "pending"] }, "$count", 0],
          },
        },
        cancelled: {
          $sum: {
            $cond: [{ $eq: ["$_id.status", "cancelled"] }, "$count", 0],
          },
        },
        total: { $sum: "$count" },
      },
    },
    {
      $project: {
        _id: 0,
        month: {
          $let: {
            vars: {
              monthsInString: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
            },
            in: {
              $arrayElemAt: [
                "$$monthsInString",
                { $subtract: ["$_id.month", 1] },
              ],
            },
          },
        },
        year: "$_id.year",
        finished: 1,
        pending: 1,
        cancelled: 1,
        total: 1,
      },
    },
    { $sort: { year: 1, "_id.month": 1 } },
  ]);

  // Fill in missing months with zero values
  const filledMonthlyPerformance = fillMissingMonths(
    monthlyPerformance,
    sixMonthsAgo,
    currentDate
  );

  // Response JSON format me bhejte hain
  res.status(200).json({
    totalUsers,
    totalCompletedTasks,
    totalPendingTasks,
    totalCancelledTasks,
    totalMonthlyTasks,
    monthlyPerformance: filledMonthlyPerformance,
  });
});

function fillMissingMonths(data, startDate, endDate) {
  const months = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    months.push({
      month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        currentDate
      ),
      year: currentDate.getFullYear(),
      finished: 0,
      pending: 0,
      total: 0,
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Merge existing data with filled months
  data.forEach((item) => {
    const index = months.findIndex(
      (m) => m.month === item.month && m.year === item.year
    );
    if (index !== -1) {
      months[index] = item;
    }
  });

  return months;
}
