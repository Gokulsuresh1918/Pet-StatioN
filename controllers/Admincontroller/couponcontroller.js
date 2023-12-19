

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
const ExcelJS = require("exceljs");


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
  // Create a PDF document
  const mode = req.params.id

  if (mode == "pdf") {
    try {
      const startingDate = new Date(req.body.startDate);
      const endingDate = new Date(req.body.endDate);
      const orders = await orderCollection.find({
        createdAt: { $gte: startingDate, $lte: endingDate },
      });


      const doc = new PDFDocument();
      const filename = "PetStation Sales Report.pdf";

      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.setHeader("Content-Type", "application/pdf");

      doc.pipe(res);

      // Add content to the PDF document
      doc.font("Helvetica-Bold").text("Sales Report", { font: 30, align: "center", margin: 10 });

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
      console.error("Error generating pdf:", error);
      res.status(500).send("Internal Server Error");
    }

  } else {
    try {
      // Chart Excel Download-------------------------------
      
      const excelstartingDate =  req.body.startDate;
      const excelendingDate =  req.body.endDate;

      const orderCursor = await orderCollection.find({
        createdAt: { $gte: excelstartingDate, $lte: excelendingDate },
      });


      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet 1");
      
      // Add data to the worksheet
      worksheet.columns = [
        { header: "Order Number", key: "ordernumber", width: 15 },
        { header: "User ID", key: "userId", width: 20 },
        { header: "Product Name", key: "productname", width: 20 },
        { header: "Quantity", key: "quantity", width: 15 },
        { header: "Price", key: "price", width: 15 },
        { header: "Status", key: "status", width: 15 },
        { header: "Order Date", key: "orderdate", width: 18 },
        { header: "Address", key: "address", width: 30 },
        { header: "City", key: "city", width: 20 },
        { header: "Pincode", key: "pincode", width: 15 },
        { header: "State", key: "state", width: 15 },
      ];
      
      for (const orderItem of orderCursor) {
        // Fetch address details based on the address ID
      
        worksheet.addRow({
          ordernumber: orderItem.Ordernumber,
          userId: orderItem.userId,
          productname: orderItem.productdetails
            .map((productDetail) => productDetail.productId)
            .join(", "),
          quantity: orderItem.productdetails
            .map((productDetail) => productDetail.quantity)
            .join(", "),
          price: orderItem.productdetails
            .map((productDetail) => productDetail.uniquePriceTotal)
            .join(", "),
          status: orderItem.status,
          orderdate: orderItem.createdAt.toISOString(), // Assuming createdAt is a valid Date object
          address: orderItem.address.address,
          city: orderItem.address.district, // Assuming district is the city field
          pincode: orderItem.address.pincode,
          state: orderItem.address.state,
        });
      }
      
      // Generate the Excel file and send it as a response
      workbook.xlsx.writeBuffer().then((buffer) => {
        const excelBuffer = Buffer.from(buffer);
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx");
        res.send(excelBuffer);
      });
      



    } catch (error) {
      console.error("Error generating excel:", error);
      res.status(500).send("Internal Server Error");
    }
  }


};