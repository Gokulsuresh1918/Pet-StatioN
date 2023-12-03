
const { orderCollection } = require("../../model/orderDB");
const { contactCollection } = require("../../model/contactDB");
const { addressCollection } = require("../../model/addressDB");
const {productCollection}=require('../../model/productDB')
const path = require('path');
const { log } = require("console");












//OrderGet------------------------------------------------------------------------
exports.orderGet = async (req, res) => {
    try {
        const orderdata = await orderCollection.find();
        orderdata.reverse()
     
        const addresses = orderdata.map(order => order.address);
       
        res.render("Admin/order", { orderdata, addresses });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ error: 'Internal Server Error' });  
    }
};    

exports.viewProductOrder=async (req,res)=>{
   const orderid= req.body.id
   const orderData = await orderCollection.findOne({ _id: orderid });

   const productDetails = orderData.productdetails ;
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
}  
exports.viewAddressOrder=async (req,res)=>{
    const orderid= req.body.id
    const orderData = await orderCollection.findOne({ _id: orderid });
    const addressDetails = orderData.address ;
   res.status(200).json(addressDetails);  
  }        
