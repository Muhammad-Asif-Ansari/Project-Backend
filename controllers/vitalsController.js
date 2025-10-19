import { Vitals } from "../models/vitals.js";

// ✅ Add new vitals
export const addVitals = async (req, res) => {
  try {
    const { bloodPressure, sugarLevel, weight } = req.body;
    const userId = req.user?._id; // middleware se user mil raha hoga

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const vitals = await Vitals.create({
      userId,
      bloodPressure,
      sugarLevel,
      weight,
    });

    res.status(201).json({ success: true, message: "Vitals added", data: vitals });
  } catch (error) {
    console.error("Error adding vitals:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all vitals for logged-in user
export const getVitals = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const vitalsList = await Vitals.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: vitalsList });
  } catch (error) {
    console.error("Error fetching vitals:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update specific vitals entry
export const updateVitals = async (req, res) => {
  try {
    const { id } = req.params;
    const { bloodPressure, sugarLevel, weight } = req.body;
    const userId = req.user?._id;

    const vitals = await Vitals.findOne({ _id: id, userId });
    if (!vitals) return res.status(404).json({ success: false, message: "Vitals not found" });

    vitals.bloodPressure = bloodPressure || vitals.bloodPressure;
    vitals.sugarLevel = sugarLevel || vitals.sugarLevel;
    vitals.weight = weight || vitals.weight;

    await vitals.save();

    res.json({ success: true, message: "Vitals updated", data: vitals });
  } catch (error) {
    console.error("Error updating vitals:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete a vitals entry
export const deleteVitals = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const vitals = await Vitals.findOneAndDelete({ _id: id, userId });
    if (!vitals) return res.status(404).json({ success: false, message: "Vitals not found" });

    res.json({ success: true, message: "Vitals deleted" });
  } catch (error) {
    console.error("Error deleting vitals:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
