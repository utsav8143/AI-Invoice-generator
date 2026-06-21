const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  quantity:    { type: Number, required: true },
  unitPrice:   { type: Number, required: true },
  taxPercent:  { type: Number, default: 0 }, 

  total:       { type: Number },               
});

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    invoiceDate: { type: Date },
    dueDate:     { type: Date },

    billFrom: {                      
      buisnessName: String,
      email:        String,
      address:      String,
      phone:        String,
    },

    billTo: {                        
      clientName: String,
      email:      String,
      address:    String,
      phone:      String,
    },

    items: [itemSchema],            

    notes: { type: String },

    payementTerms: {                 
      type: String,
      enum: ['Net 15', 'Net 30', 'Net 60', 'Due on Receipt'],  
      default: 'Net 15',
    },

    status: {                        
      type: String,
      enum: ['Paid', 'Unpaid', 'Pending', 'Overdue'],
      default: 'Unpaid',
    },

    subtotal: { type: Number, default: 0 },  
    taxTotal: { type: Number, default: 0 },
    total:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);