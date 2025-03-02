// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ComplaintSystem {
    // Complaint structure
    struct Complaint {
        uint id;                // Complaint ID
        string category;        // Complaint category (Food, Staff, Cleanliness, Other)
        string description;     // Complaint description
        uint timestamp;         // Complaint submission timestamp
        string status;          // Complaint status (default: "Open")
    }

    // Array to store complaints
    Complaint[] public complaints;

    // Event to notify when a new complaint is added
    event ComplaintAdded(uint id, string category, string description, uint timestamp, string status);

    // Add a new complaint
    function addComplaint(string memory _category, string memory _description) public {
        uint complaintId = complaints.length;
        complaints.push(Complaint({
            id: complaintId,
            category: _category,
            description: _description,
            timestamp: block.timestamp,
            status: "Open"
        }));
        emit ComplaintAdded(complaintId, _category, _description, block.timestamp, "Open");
    }

    // Get a specific complaint by ID
    function getComplaint(uint _id) public view returns (uint, string memory, string memory, uint, string memory) {
        require(_id < complaints.length, "Complaint ID does not exist.");
        Complaint memory c = complaints[_id];
        return (c.id, c.category, c.description, c.timestamp, c.status);
    }

    // Get all complaints
    function getAllComplaints() public view returns (Complaint[] memory) {
        return complaints;
    }

    // Update complaint status (admin-only in production)
    function updateComplaintStatus(uint _id, string memory _newStatus) public {
        require(_id < complaints.length, "Complaint ID does not exist.");
        complaints[_id].status = _newStatus;
    }
}
