// controllers/resource_back.js — Training Resources (videos & articles)
const Resource = require('../models/Resource');

const listResources = async (req, res) => {
    try {
        const filter = req.query.type ? { type: req.query.type } : {};
        const resources = await Resource.find(filter)
            .populate('uploadedBy', 'name')
            .sort({ createdAt: -1 });
        res.json(resources);
    } catch (err) {
        console.error('listResources error', err);
        res.status(500).json({ message: 'Failed to fetch resources' });
    }
};

const getResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id).populate('uploadedBy', 'name');
        if (!resource) return res.status(404).json({ message: 'Resource not found' });
        res.json(resource);
    } catch (err) {
        console.error('getResource error', err);
        res.status(500).json({ message: 'Failed to fetch resource' });
    }
};

const createResource = async (req, res) => {
    try {
        const { title, description, type, url } = req.body;
        if (!title || !type || !url) {
            return res.status(400).json({ message: 'title, type and url are required' });
        }
        const resource = new Resource({
            title,
            description,
            type,
            url,
            uploadedBy: req.user ? req.user.id : undefined
        });
        await resource.save();
        res.status(201).json({ message: 'Resource created', resource });
    } catch (err) {
        console.error('createResource error', err);
        res.status(500).json({ message: 'Failed to create resource' });
    }
};

const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });
        res.json({ message: 'Resource deleted' });
    } catch (err) {
        console.error('deleteResource error', err);
        res.status(500).json({ message: 'Failed to delete resource' });
    }
};

module.exports = { listResources, getResource, createResource, deleteResource };
