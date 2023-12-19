

const { UserCollection } = require("../../model/userDB");
const { contactCollection } = require("../../model/contactDB");
const { CouponCollection } = require("../../model/couponDB");
const { productCollection } = require("../../model/productDB");
const { categoryCollection } = require("../../model/categoryDB");
const { offerCollection } = require("../../model/offerDB");
const path = require('path');
const mongoose = require("mongoose");
const { orderCollection } = require("../../model/orderDB");
const PDFDocument = require("pdfkit-table");



exports.couponGet = async (req, res) => {
  try {
    const coupondata = await CouponCollection.find();
    let err = '';

    if (req.app.locals.data) {
      err = req.app.locals.data;
      req.app.locals.data = null;
    }

    // Render the template after resolving the asynchronous operation
    res.render('Admin/coupon', { coupondata, errorMessage: err });

  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error'); // Handle the error appropriately
  }
};




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



// edit coupon
exports.editCoupon = async (req, res) => {
  try {
    const id = req.params._id;
    const coupon = await CouponCollection.findOne({ _id: id });

    res.json(coupon); // Send the fetched coupon details as JSON
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};







// delete the coupon

exports.couponDelete = async (req, res) => {
  try {

    const id = req.params._id;

    // Validate if the id is a valid ObjectId before attempting to delete
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid coupon ID' });
    }
    const offer = await offerCollection.find({ _id: id })
    if (offer) {
      const offerdeleted = await offerCollection.deleteOne({ _id: id });

      if (offerdeleted.deletedCount === 1) {
        return res.status(200).json({ message: 'offer deleted successfully' });
      } else {
        return res.status(404).json({ error: 'offer not found' });
      }
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


exports.offerGet = async (req, res) => {
  const offers = await offerCollection.find()
  const productdb = await productCollection.find()
  const categories = await categoryCollection.find()
  for (const offer of offers) {
    if (offer.endDate < new Date()) {
      offer.isActive = false;
      await offer.save();
    }
  }
  res.render('Admin/offer', { offers, productdb, categories })
}






exports.offerpost = async (req, res) => {
  try {
    // Extract data from the form submission
    const {
      type,
      code,
      discount,
      startDate,
      endDate,
      isActive,
      selectedProducts,
      selectedCategories,
    } = req.body;

    const newOffer = new offerCollection({
      type,
      code,
      discount,
      startDate,
      endDate,
      isActive: Boolean(isActive), // Convert to boolean
      applicableProducts: selectedProducts || [],
      applicableCategories: selectedCategories || [],
    });
    await newOffer.save();


    res.redirect("/admin/offer");
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


// Pdf Download
exports.salesReport = async (req, res) => {
  try {
    // const startingDate = new Date(req.body.startingdate);
    // const endingDate = new Date(req.body.endingdate);

    // const orders = await orderCollection.find()
    // console.log(orders);
    // ({
    //   orderDate: { $gte: startingDate, $lte: endingDate },
    // });

    // Create a PDF document
    const orders = await orderCollection.find();

    const doc = new PDFDocument();
    const filename = "PetStation Sales Report.pdf";

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Add content to the PDF document
    doc.font("Helvetica-Bold").text("Sales Report", {font:30, align: "center", margin: 10 });
    
    doc.moveDown(); // Move down after the title
    const tableData = {
      headers: [
        "Username",
        "Product ",
        "Price",
        "Quantity",
        "Address",
        "Pincode",
        "State",
      ],
      rows: orders.map((order) => {
        const productRows = order.productdetails.map((productDetail) => [
          order.address.name,
          productDetail.productId,
          productDetail.uniquePriceTotal,
          productDetail.quantity,
          order.address.address,
          order.address.pincode,
          order.address.state,
        ]);

        return productRows;
      }).flat(),
    };


   
    // Customize the appearance of the table
    await doc.table(tableData, {
      prepareHeader: () => doc.font("Helvetica-Bold"),
      prepareRow: (row, i) => doc.font("Helvetica").fontSize(12),
      hLineColor: '#b2b2b2', // Horizontal line color
      vLineColor: '#b2b2b2', // Vertical line color
      textMargin: 5, // Margin between text and cell border
    });

    // Finalize the PDF document
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
};