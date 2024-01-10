
const { orderCollection } = require("../../model/orderDB");
const { contactCollection } = require("../../model/contactDB");
const { addressCollection } = require("../../model/addressDB");
const { productCollection } = require('../../model/productDB')
const path = require('path');
const { log } = require("console");












//OrderGet------------------------------------------------------------------------
exports.orderGet = async (req, res) => {
  try {
    const pages = parseInt(req.query.page) || 1;
    const limit = 7; // Set the number of products per page
    const skip = (pages - 1) * limit;

    const orderdata = await orderCollection.find().skip(skip)
    .limit(limit)
    orderdata.reverse()
    const addresses = orderdata.map(order => order.address);

    // Pagination
    

    // Fetch products with pagination
   
    
    const totalorders = await orderCollection.countDocuments();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalorders / limit);
    
    // Adjust current page if it exceeds total pages
    const currentPage = Math.min(pages, totalPages);
    // console.log(currentPage,"   ",totalPages);
    res.render("Admin/order", { orderdata, addresses,currentPage,totalPages, page: 4 });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.viewProductOrder = async (req, res) => {
  const orderid = req.body.id
  const orderData = await orderCollection.findOne({ _id: orderid });

  const productDetails = orderData.productdetails;
  const products = [];

  for (const product of productDetails) {
    const productId = product.productId;
    const quantity = product.quantity;

    const productData = await productCollection.findOne({ _id: productId });

    products.push({
      productDetails: productData,
      quantity,
    });
  }
  res.status(200).json(products);
};







exports.viewAddressOrder = async (req, res) => {
  const orderid = req.body.id
  const orderData = await orderCollection.findOne({ _id: orderid });
  const addressDetails = orderData.address;
  res.status(200).json(addressDetails);
};



exports.manageOrder = async (req, res) => {
  const orderId = req.body.id
  const statusOfOrder = req.body.value

  try {
    if (statusOfOrder == "Pending") {
      const updatedOrder = await orderCollection.findOneAndUpdate(
        { _id: orderId },
        { $set: { status: "Pending" } },
        { new: true }
      );
      res.status(200).send('Order is canceled');

    } else if (statusOfOrder == "Cancel") {
      const updatedOrder = await orderCollection.findOneAndUpdate(
        { _id: orderId },
        { $set: { status: "Cancel" } },
        { new: true }
      );
      res.status(200).send('Order is canceled');

    } else if (statusOfOrder == "delivered") {
      const updatedOrder = await orderCollection.findOneAndUpdate(
        { _id: orderId },
        { $set: { status: "Delivered" } },
        { new: true }
      );
      res.status(200).send('Order is canceled');
    } else if (statusOfOrder == "Shipped") {
      const updatedOrder = await orderCollection.findOneAndUpdate(
        { _id: orderId },
        { $set: { status: "Shipped" } },
        { new: true }
      );
      res.status(200).send('Order is Shipped');
    }

  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).send('Internal Server Error');
  }
}

exports.cancelorder = async (req, res) => {
  const orderId = req.body.id;
  try {

    const updatedOrder = await orderCollection.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: "Cancel" } },
      { new: true }
    );
    res.status(200).send('Order is canceled');
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).send('Internal Server Error');
  }
};

// exports.deliveredorder = async (req, res) => {
//   const orderId = req.body.id
//   try {
//     const updatedOrder = await orderCollection.findOneAndUpdate(
//       { _id: orderId },
//       { $set: { status: "Delivered" } },
//       { new: true }
//     );
//     res.status(200).send('Order is canceled');
//   } catch (error) {
//     console.error('Error canceling order:', error);
//     res.status(500).send('Internal Server Error');
//   }
// };

// exports.shippedorder = async (req, res) => {
//   const orderId = req.body.id;
//   try {
//     const updatedOrder = await orderCollection.findOneAndUpdate(
//       { _id: orderId },
//       { $set: { status: "Shipped" } },
//       { new: true }
//     );
//     res.status(200).send('Order is Shipped');
//   } catch (error) {
//     console.error('Error Shipped order:', error);
//     res.status(500).send('Internal Server Error');
//   }
// };

