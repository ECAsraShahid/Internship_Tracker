import Tracker from "../models/trackerModel.js";

// GET ALL
export const getTrackers = async (req, res) => {
  try {

    const trackers = await Tracker.find({
      user: req.user.id,
    });

    res.json(trackers);

  } catch (err) {

    res.status(500).json({
      message: "Server error",
    });

  }
};

// GET SINGLE
export const getTrackerById = async (req, res) => {
  try {
    const tracker = await Tracker.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!tracker) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(tracker);

  } catch (err) {
    res.status(500).json({
      message: "Serevr Error",
    });
  }
};

// CREATE
export const createTracker = async (req, res) => {
  try {

    const body = req.body;

    if (!body.companyName || !body.role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const result = await Tracker.create({
      ...body,
      user: req.user.id,
    });

    res.status(201).json({
      message: "SUCCESS",
      data: result,
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error",
    });

  }
};

// UPDATE
export const updateTracker = async (req, res) => {
  try {
    const updated = await Tracker.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Data Updated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// DELETE
export const deleteTracker = async (req, res) => {
  try {
    const deleted = await Tracker.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Data Deleted",
    });

  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};
