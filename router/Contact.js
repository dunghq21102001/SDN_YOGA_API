const express = require('express')
const cors = require("cors");
const contactsModel = require('../models/Contact');
const contactRouter = express.Router()
contactRouter.use(cors())

contactRouter.get('/', cors(), async (req, res) => {
    try {
        const contacts = await contactsModel.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

contactRouter.post('/', cors(), async (req, res) => {
    const contact = new contactsModel({
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message
    });

    try {
        const newContact = await contact.save();
        res.status(201).json(newContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// API route: Lấy thông tin một contact theo ID
contactRouter.get('/:id', cors(), getContact, (req, res) => {
    res.json(res.contact);
});

// API route: Cập nhật thông tin một contact theo ID
contactRouter.put('/:id', cors(), getContact, async (req, res) => {
    if (req.body.fullName != null) {
        res.contact.fullName = req.body.fullName;
    }
    if (req.body.email != null) {
        res.contact.email = req.body.email;
    }
    if (req.body.phone != null) {
        res.contact.phone = req.body.phone;
    }
    if (req.body.message != null) {
        res.contact.message = req.body.message;
    }

    try {
        const updatedContact = await res.contact.save();
        res.json(updatedContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// API route: Xóa một contact theo ID
contactRouter.delete('/:id', cors(), getContact, async (req, res) => {
    try {
        console.log(res.contact);
        await contactsModel.deleteOne({_id: res.contact._id})
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware function: Lấy thông tin một contact theo ID
async function getContact(req, res, next) {
    try {
        const contact = await contactsModel.findById(req.params.id);
        if (contact == null) {
            return res.status(404).json({ message: 'Cannot find contact' });
        }
        res.contact = contact;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



module.exports = contactRouter