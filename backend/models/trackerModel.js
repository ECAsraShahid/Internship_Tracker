import mongoose from "mongoose";

const trackerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Applied",
    },

    location: String,

    workMode: String,

    appliedDate: Date,

    salary: Number,

    jobLink: String,

    notes: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tracker", trackerSchema);
