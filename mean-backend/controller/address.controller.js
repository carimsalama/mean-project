const Address = require('../models/address.model')


const getAddresses = async (req, res)=>{
    try {
        const addresses = await Address.find({userId:req.user._id})
        res.json({success: true,message:'Addresses', data:addresses})
    }   
    catch (error){
    res.status(500).json({ success: false, message: error.message });
    }
}

const addAddress = async (req, res)=>{
    try{
        const idUser = req.user._id
        const {city, street, building, label, isDefault} = req.body;
        if(isDefault){
            await Address.updateMany({userId:idUser},{isDefault:false})
        }
        const address = await Address.create({
            userId: idUser,
            city,street,building,label,
            isDefault: isDefault || false // to be in safeSide 
        });
        res.status(201).json({ success: true, message: "Address Created!",data:address})
    }
    catch (error){
    res.status(500).json({ success: false, message: error.message });
    }
}

const updateAddress = async (req, res)=>{
try {
    const addressId = req.params.id;
    const idUser = req.user._id;
    const address = await Address.findOne({_id:addressId, userId:idUser})
    if (!address){
        return res.status(404).json({success:false, message:'Address Not Found'})
    }
    const {city,street,building,label,isDefault}= req.body;

    if(isDefault){
        await Address.updateMany({userId:idUser}, {isDefault:false})
    }
    
    const updated = await Address.findByIdAndUpdate(
        addressId,
        {city,street,building,label,isDefault}, 
        {new: true, runValidators:true}
    );
    res.json({success: true, message:'Address Updated',data:updated})


}
catch (error){
    res.status(500).json({ success: false, message: error.message });
}
}

const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }
    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {getAddresses,addAddress,updateAddress,deleteAddress}