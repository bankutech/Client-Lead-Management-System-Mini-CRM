const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Lead = require('../models/Lead');
const FollowUp = require('../models/FollowUp');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Get all leads
router.get('/', authenticateToken, async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a lead (Public)
router.post('/', async (req, res) => {
    try {
        const lead = new Lead(req.body);
        await lead.save();
        res.status(201).json({ id: lead._id, message: 'Lead added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update lead status (Kanban drag-and-drop)
router.put('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        await Lead.findByIdAndUpdate(req.params.id, { status });
        res.json({ message: 'Lead status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update entire lead
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        await Lead.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'Lead updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete lead
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        // Also delete associated follow-ups
        await FollowUp.deleteMany({ leadId: req.params.id });
        res.json({ message: 'Lead deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Analytics
router.get('/analytics', authenticateToken, async (req, res) => {
    try {
        const total = await Lead.countDocuments();
        const converted = await Lead.countDocuments({ status: 'Converted' });
        const newLeads = await Lead.countDocuments({ status: 'New Lead' });
        
        // Pipeline grouped by source
        const sourceDistribution = await Lead.aggregate([
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]);

        // Pipeline grouped by status
        const statusDistribution = await Lead.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        res.json({
            stats: {
                total,
                converted,
                newLeads,
                conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) : 0
            },
            sourceDistribution,
            statusDistribution
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
