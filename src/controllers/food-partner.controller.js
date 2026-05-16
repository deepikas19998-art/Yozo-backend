const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');

async function getFoodPartnerById(req, res) {
  const foodPartnerId = req.params.id;

  const foodPartner = await foodPartnerModel.findById(foodPartnerId).select('-password');
  if (!foodPartner) {
    return res.status(404).json({ message: 'Food partner not found' });
  }

  const foodItems = await foodModel.find({ foodPartner: foodPartnerId });

  
  const totalLikes = foodItems.reduce((acc, f) => acc + (f.likeCount || 0), 0);

  res.status(200).json({
    message: 'Food partner retrieved successfully',
    foodPartner: {
      ...foodPartner.toObject(),
      foodItems,
      totalMeals: foodItems.length,   
      totalLikes                       
    }
  });
}

module.exports = { getFoodPartnerById };