const Report = require('../models/Report');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Submit a new report
// @route   POST /api/reports
// @access  Public
const createReport = async (req, res) => {
    const { name, hostelName, type, description, cnic, evidence } = req.body;

    if (!name || !type || !description || !cnic) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const report = await Report.create({
            name,
            email: req.user.email,
            userId: req.user.id,
            cnic,
            evidence,
            hostelName,
            type,
            description
        });

        // Notify Admins
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
            await createNotification({
                recipient: admin._id,
                // No sender ID for anonymous reports if needed, but here req.user might not be available if public
                // If public endpoint, sender is null (system)
                sender: req.user ? req.user.id : null,
                type: 'NEW_REPORT',
                title: 'New Report Submitted',
                message: `New report regarding ${hostelName || 'General Issue'}`,
                relatedId: report._id,
                relatedModel: 'Report'
            });
        }

        res.status(201).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user reports
// @route   GET /api/reports/my-reports
// @access  Private
const getUserReports = async (req, res) => {
    try {
        const reports = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update report status
// @route   PATCH /api/reports/:id/status
// @access  Private/Admin
const updateReportStatus = async (req, res) => {
    const { status } = req.body;

    if (!['unread', 'read', 'resolved'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.status = status;

        if (status === 'resolved') {
            report.resolvedBy = req.user.id;
            report.resolvedAt = Date.now();
        }

        await report.save();

        res.status(200).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
const deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        await report.deleteOne();

        res.status(200).json({ message: 'Report removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createReport,
    getAllReports,
    createReport,
    getAllReports,
    getUserReports,
    updateReportStatus,
    deleteReport
};
