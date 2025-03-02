import mongoose from "mongoose"
import {Complaint} from "../models/complaint.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {contract} from "../utils/ComplaintSystemContract.js"


const addComplaint = asyncHandler(async (req, res) => {
    try {
      const { category, description } = req.body;
  
      const tx = await contract.addComplaint(category, description);
      await tx.wait();
  
      res.status(201).json(
        new ApiResponse(201, { tx }, "Complaint added successfully")
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })

const getAllComplaints = asyncHandler(async (req, res) => {
  try {
    const complaints = await contract.getAllComplaints();

    // Map and format complaints to avoid BigInt serialization issues
    const formattedComplaints = complaints.map((complaint) => {
      return {
        id: Number(complaint.id), // Convert BigInt to number
        category: complaint.category,
        description: complaint.description,
        timestamp: new Date(Number(complaint.timestamp) * 1000).toISOString(), // Convert Unix timestamp to ISO format
        status: complaint.status,
      };
    });

    res.status(200).json(formattedComplaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  })

const updateComplaintStatus = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      // const { newStatus } = req.body;
  
      const tx = await contract.updateComplaintStatus(id, "resolved");
      await tx.wait();
      res.status(201).json(
        new ApiResponse(201, { tx }, "Complaint status updated successfully")
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })

const getComplaint = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Call the contract to get the complaint details
    const complaint = await contract.getComplaint(id);

    // Format the complaint to avoid BigInt serialization issues
    const formattedComplaint = {
      id: Number(complaint.id), // Convert BigInt to number
      category: complaint.category,
      description: complaint.description,
      timestamp: new Date(Number(complaint.timestamp) * 1000).toISOString(), // Convert Unix timestamp
      status: complaint.status,
    };

    res.status(200).json(formattedComplaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  })

export {
    addComplaint, 
    getAllComplaints, 
    updateComplaintStatus,
    getComplaint
}




