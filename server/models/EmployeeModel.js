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
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", EmployeeSchema);

export default Employee;
