import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    class: { type: String, required: true },
    subjects: [{ type: String }],
    attendance: [
      {
        date: { type: String },
        status: {
          type: String,
          enum: ["Present", "Absent", "Leave", "Week Off"],
        },
      },
    ],
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", EmployeeSchema);

export default Employee;
