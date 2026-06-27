require('dotenv').config();
const express=require("express");
const cors=require("cors");
const path=require("path");
const connectDB=require("./config/db");
const authRoutes=require("./routes/authRoute");
const invoiceRoutes=require("./routes/invoiceRoute");
const aiRoutes=require("./routes/aiRoute");

const app=express();






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

//Serve react frontend static files
app.use(express.static(path.join(__dirname,"dist")));

app.get("*",(req,res) =>{
    res.send(path.join(__dirname,"dist","index.html"));
})

//Start Server
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));