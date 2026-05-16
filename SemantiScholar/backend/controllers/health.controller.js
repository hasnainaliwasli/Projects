/**
 * @desc    Health check endpoint
 * @route   GET /api/health
 * @access  Public
 */
const getHealth = (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
};

module.exports = { getHealth };
