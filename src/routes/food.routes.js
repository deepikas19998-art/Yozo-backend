const express = require('express');
const foodController = require('../controllers/food.controller');
const authMiddleware = require('../middlewares/auth.middleware');
console.log("foodController:", foodController);
console.log("authMiddleware:", authMiddleware);
const router = express.Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });


router.post('/',
  
  upload.single('video'),
  foodController.createFood
);


router.get('/partner',
  authMiddleware.authFoodPartnerMiddleware,
  foodController.getFoodPartnerFoods
);



router.get('/',
  authMiddleware.authUserMiddleware,
  foodController.getFoodItems
);


router.post('/like',
  authMiddleware.authUserMiddleware,
  foodController.likeFood
);


router.post('/save',
  authMiddleware.authUserMiddleware,
  foodController.saveFood
);


router.get('/save',
  authMiddleware.authUserMiddleware,
  foodController.getSaveFood
);


router.post('/comment',
  authMiddleware.authUserMiddleware,
  foodController.addComment
);


router.get('/:foodId/comments',
  authMiddleware.authUserMiddleware,
  foodController.getComments
);

module.exports = router;