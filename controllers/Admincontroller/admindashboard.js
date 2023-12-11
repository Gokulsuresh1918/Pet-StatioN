const { adminCollection } = require("../../model/adminDB");
const mongoose = require('mongoose');
const { orderCollection } = require('../../model/orderDB')
const path = require('path');
const { log } = require("console");








//Admin login get
exports.LoginGet = (req, res) => {
  try {
    if (req.session.adminID) {
      res.render('Admin/adminLogin')
    } else {
      let admin = true
      res.render('admin/adminlogin', { admin })
    }
  } catch (error) {
    console.log(error.message);
  }
};



//Admin login post
exports.loginPost = async (req, res) => {
  try {
    const { username, password } = req.body
    const admindata = await adminCollection.findOne()

    if (admindata.name == username && admindata.password == password) {

      let admin = false
      req.session.adminID = admindata.name;
      res.redirect('/admin/dashboard');
    }
    else {
      let admin = true
      res.render("Admin/adminLogin", { msg: 'Invalid credentials', admin })
    }
  }
  catch (error) {
    console.log(error);
  }
};



//LogoutGet------------
exports.logoutGet = (req, res) => {

  if (req.session.adminID) {

    req.session.destroy((err) => {
      if (err) {
        console.error('Error', err);
      }
      console.log("session destriyod sucessfully");
      res.redirect('/admin/admin');
    });

  } else {
    res.redirect('/admin/admin');
  }
};


//DashboardGet---------------------------------------------------------------------------------
exports.dashboard = async (req, res) => {
  const admin = true
  let dailyData
  let monthlyData
  // Aggregate monthly orders
  const monthlyOrders = async () => {
    try {
      const monthlyresult = await orderCollection.aggregate([
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },{
          $project:{
            _id:1,
            totalOrders:1
          }
        }
      ])
      console.log("Monthly Orders:", monthlyresult)
      let data=[0,0,0,0,0,0,0,0,0,0,0,0]
      let k=0
      dailyData =data.map((ele,i)=>{
            if (monthlyresult[k]._id.month==i+1) {
              return monthlyresult[k++]?.totalOrders
            }else{
              return 0
            }
        })
          
      } catch (error) {
        console.error("Error aggregating daily orders:", error);
      }
    };
    
    
    // Aggregate yearly orders
    const yearlyOrders = async () => {
      try {
      const yearlyresult = await orderCollection.aggregate([
        {
          $group: {
            _id: { year: { $year: "$createdAt" } },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1 },
        },
      ]);
      monthlyData=yearlyresult.map((ele)=>{
        return ele.totalOrders
      })
      console.log(monthlyData);
      
    } catch (error) {
      console.error("Error aggregating yearly orders:", error);
    }
  };
  
  await monthlyOrders();
  await yearlyOrders();
  return res.render('Admin/Dashboard', { admin, dailyOrdersData:dailyData,monthlyData, errmsg: "please login" });
  
  // Aggregate daily orders
  // const dailyOrders = async () => {
  //   try {
    //     const dailyresult = await orderCollection.aggregate([
  //       {
    //         $group: {
  //           _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
  //           totalOrders: { $sum: 1 },
  //           totalSales: { $sum: "$total" },
  // dailyOrders();
  //         },
  //       },
  //       {
  //         $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
  //       },
  //     ]);

  //     console.log("Daily Orders:", dailyresult);
  //   } catch (error) {
  //     console.error("Error aggregating daily orders:", error);
  //     res.render('Admin/Dashboard', { admin, errmsg: "please login" });

  //   }
  // };



  // Call the functions to get the aggregated results


};














