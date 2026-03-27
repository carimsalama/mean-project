const {FAQ} = require('../models/faq.model');


const getFAQs = async (req,res)=>{
    try{
        const faqs = await FAQ.find({isActive: true})
        .sort({createdAt :-1 })
        res.status(200).json({success:true, message:"FAQs:",data:faqs})
    }
        catch(error){
    res.status(500).json({ success: false, message: error.message });
        }
}

const getAllFAQs = async (req,res)=>{
    try{
        const faqs = await FAQ.find()
        .sort({createdAt :-1 })
        res.status(200).json({success:true, message:"Admin FAQs:",data:faqs})
    }
        catch(error){
    res.status(500).json({ success: false, message: error.message });
        }
}

const createFAQ = async (req,res)=>{
    try{
        const {question, answer, isActive} = req.body;
        const faq = await FAQ.create({question, answer, isActive})
        res.status(201).json({success:true, message:'FAQ Created', data:faq})
    }
    catch(error){
    res.status(500).json({ success: false, message: error.message });
    }
}

const updateFAQ = async (req, res) => {
  try {
    const {question, answer, isActive} = req.body;
    const faq = await FAQ.findByIdAndUpdate(req.params.id, {question, answer, isActive}, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.status(200).json({ success: true, message: 'FAQ updated', data:faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFAQ = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  getFAQs, getAllFAQs, createFAQ, updateFAQ, deleteFAQ
};
