const {Contact} = require('../models/contact.model')
const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ success: true, message: 'Message sent successfully', data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Your Messages', data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const markContactRead = async (req, res) => {
  try {
        const {isRead} = req.body; 
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead }, { new: true });
    res.status(200).json({ success: true,message:'Available Contact', data:contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitContact, getContacts, markContactRead };
