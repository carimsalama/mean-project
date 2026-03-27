const User = require('../models/user.model');

const getUsers = async (req, res)=>{
     try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  } 
};

const getUser = async (req, res) => {
  try {
    //
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req,res)=>{

try {
  const {name,email,phone,gender,password} = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!user){
    return res.status(404).json({success:false , message: 'User not found'})
  }
   // update fields
    if (name)   user.name   = name;
    if (email)  user.email  = email;
    if (phone)  user.phone  = phone;
    if (gender) user.gender = gender;
    if (password && password.trim() !== '') 
      {user.password = password; }// pre-save hook will hash it
    if (req.file) {
      user.image = `/uploads/${req.file.filename}`;
    }

    await user.save(); // triggers pre-save hash
  const updated = await User.findById(req.user._id).select('-password')
    res.status(200).json({ success: true, data: updated });

} 
catch (error){
    res.status(500).json({ success: false, message: error.message });
}
}

module.exports = {getUsers,getUser,deleteUser,updateUser};
 