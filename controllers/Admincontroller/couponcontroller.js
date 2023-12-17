

const { UserCollection } = require("../../model/userDB");
const { contactCollection } = require("../../model/contactDB");
const { CouponCollection } = require("../../model/couponDB");
const path = require('path');




exports.couponGet = async (req, res) => {
    try {
        const coupondata = await CouponCollection.find();
        // console.log(coupondata);
        if ( req.app.locals.data) {
  
          err = req.app.locals.data
          req.app.locals.data = null
        } else {
          err = ''
        }
        return res.render('Admin/coupon', { coupondata, errorMessage: err })
  
      } catch (error) {
        console.log(error);
      }
    },



exports.couponpost = async (req, res) => {
    try {
        let data = req.body
        const coupons = await CouponCollection.findOne({ code: data.code });
        if (coupons) {
            req.app.locals.data = 'Coupon Name already exist';
            return res.redirect(`/admin/coupon`)
        }
        let end = new Date(req.body.endDate);
        let start = new Date(req.body.startDate);

        if (start > end) {
            req.app.locals.data = 'The end date should be after the start date';
            return res.redirect(`/admin/coupon`)
        } else if (start == end) {
            req.app.locals.data = 'Coupon should be minium oneDay';
            return res.redirect(`/admin/coupon`)
        }
        const coupon = new CouponCollection({
            userId: req.session.userId,
            code: req.body.code,
            discountType: req.body.discountType,
            discountValue: req.body.discountvalue,
            minimumPurchase: req.body.Minimum,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        });

        await coupon.save()
        return res.redirect('/admin/coupon')

    } catch (error) {

        console.log(error);
    }
};

//   // edit coupon
//   exports.editCoupon= async (req, res) => {
//     try {
//       const cId = req.body.id
//       let data = req.body
//       const coupons = await CouponCollection.findOne({ code: data.code });

//       let end = new Date(req.body.endDate);
//       let start = new Date(req.body.startDate);

//       if (start > end) {
//         req.app.locals.data = 'The end date should after start date';
//         return res.redirect(`/admin/couponManagement`)
//       } else if (start > end) {
//         req.app.locals.data = 'Minimun one day should be there';
//         return res.redirect(`/admin/couponManagement`)
//       }
//       delete data.id
//       let coupon = await Coupon.findByIdAndUpdate(cId, data, { new: true })
//       return res.redirect(`/admin/couponManagement`)
//     } catch (error) {
//       console.log(error);
//     }
//   },

  // delete the coupon

  exports.couponDelete = async (req, res) => {
    try {
      const id = req.params._id;
  
      // Validate if the id is a valid ObjectId before attempting to delete
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid coupon ID' });
      }
  
      const result = await CouponCollection.deleteOne({ _id: id });
  
      if (result.deletedCount === 1) {
        return res.status(200).json({ message: 'Coupon deleted successfully' });
      } else {
        return res.status(404).json({ error: 'Coupon not found' });
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  

