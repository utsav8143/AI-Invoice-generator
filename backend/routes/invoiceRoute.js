const express = require("express");
const{
    createinvoice,
    getInvoices,
    getInvoicebyId,
    updateInvoice,
    deleteInvoice
}= require("../controllers/invoiceController");
 const {protect}=require("../middlewares/authMiddleware");

 const router=express.Router();

 router.route("/").post(protect,createinvoice).get(protect,getInvoices);

 router
      .route("/:id")
      .get(protect,getInvoicebyId)
      .put(protect,updateInvoice)
      .delete(protect,deleteInvoice);

    module.exports=router;
    