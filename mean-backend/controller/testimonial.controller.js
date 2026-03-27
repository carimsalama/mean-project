const {Testimonial} = require('../models/testimonial.model');

const getApprovedTestimonials = async (req,res)=>{
    try{
        const testimonials = await Testimonial.find({isApproved: true})
        .populate('userId', 'name avatar')
        .sort({createdAt: -1});
        res.status(200).json({success:true, message:'all testimonials', data:testimonials})

    }
    catch (error){
        res.status(500).json({ success: false, message: error.message })
    }
}

const submitTestimonial = async (req,res)=>{
      try{
        const {message, rating} = req.body;
        const existing = await Testimonial.findOne({userId: req.user._id})
        if(existing){
            existing.message = message;
            existing.rating = rating;
            existing.isApproved = false;
            await existing.save();
            return res.status(200).json({success: true, message: 'Testimonial updated, pending approval', data: existing })
        }
        const testimonial = await Testimonial.create({ userId: req.user._id, message, rating });
    res.status(201).json({ success: true, message: 'Testimonial submitted, pending approval', data:testimonial });
    }
    catch (error){
        res.status(500).json({ success: false, message: error.message })
    }
}

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, message:'All Testimonials',data:testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTestimonialStatus = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    const action = isApproved ? 'true' : 'false';
    res.status(200).json({ success: true, message: `Testimonial ${action}`, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
getApprovedTestimonials,
submitTestimonial,
getAllTestimonials,
updateTestimonialStatus,
deleteTestimonial

}