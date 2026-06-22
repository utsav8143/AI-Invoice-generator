require('dotenv').config();
const express=require("express");
const cors=require("cors");
const path=require("path");
const connectDB=require("./config/db");

const app=express();
app.use(express.json());

const authRoutes=require("./routes/authRoute");
const invoiceRoutes=require("./routes/invoiceRoute");
const aiRoutes=require("./routes/aiRoute");




//Middleware to handle CORS
app.use(
    cors({
        origin:"*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
    })
);

//Connect Database
connectDB();

//Middleware
app.use(express.json());

//Routes
app.use("/api/auth",authRoutes);
app.use("/api/invoices",invoiceRoutes);
app.use("/api/ai",aiRoutes);

//Start Server
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));