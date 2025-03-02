import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentContent = ({ content, user }) => {
  const [polls, setPolls] = useState([]);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("api/v1/complaint/add-complaint", { category, description });
      alert("Complaint submitted successfully!");
      setCategory(""); // Clear form
      setDescription("");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get("api/v1/voting/polls");
        setPolls(response.data.polls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    fetchPolls();
  }, []);

  const handleVote = async (pollId) => {
    try {
      await axios.post(`api/v1/voting/polls/${pollId}/vote`, {
        rollno: selectedCandidate,
      });
      alert("Vote successfully cast!");
      setSelectedCandidate("");
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to cast vote. Please try again.");
    }
  };
    
  if (content === 'complaint') {
    return (
      <div id="user-content">
      <h2 className="text-4xl">Complaint</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="category">Regarding</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Staff">Staff</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <textarea
          placeholder="Write your complaint here!"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          cols="30"
          rows="2"
        ></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
    );
  } else if (content === 'feedback') {
    return (
      <div id="user-content">
        <h2 className="text-4xl">Feedback</h2>
        <hr />
        <form action="">
          <div>
            <label htmlFor="">Regarding</label>
            <select name="" id="">
              <option value="">Food</option>
              <option value="">Staff</option>
              <option value="">Cleanliness</option>
              <option value="">Other</option>
            </select>
          </div>
          <textarea placeholder="Write your Feedback here!" name="" id="" cols="30" rows="2"></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  } else if (content === 'qr-code') {
    return (
      <div id="user-content">
        <h2 className="text-4xl">QR Code</h2>
        <hr />
        <div id='user-qrcode-div'>
          <img src={user?.qrcode} alt="Student QR Code" />
        </div>
      </div>
    );
  }
  else if(content == 'vote'){
    return (
      <div>
      <h1>Polls</h1>
      {polls.length === 0 ? (
        <p>No active polls at the moment.</p>
      ) : (
        polls.map((poll) => (
          <div key={poll.id} style={{ marginBottom: "20px" }}>
            <h2>{poll.title}</h2>
            <p>Purpose: {poll.purpose}</p>
            <p>Deadline: {new Date(poll.deadline).toLocaleString()}</p>
            <h3>Candidates</h3>
            {poll.candidates.map((candidate) => (
              <div key={candidate.rollno}>
                <label>
                  <input
                    type="radio"
                    name={`poll-${poll.id}`}
                    value={candidate.rollno}
                    checked={selectedCandidate === candidate.rollno}
                    onChange={() => {
                      setSelectedPollId(poll.id);
                      setSelectedCandidate(candidate.rollno);
                    }}
                  />
                  {candidate.name} ({candidate.rollno}) - {candidate.branch}
                </label>
              </div>
            ))}
            <button
              onClick={() => handleVote(selectedPollId)}
              disabled={!selectedPollId || !selectedCandidate}
            >
              Vote
            </button>
          </div>
        ))
      )}
    </div>
    );
  } else {
    return (
      <div id="user-info">
        <h2>User Info</h2>
        <hr />
        <div id="user-info-div">
          <p>Name: {user?.name}</p>
          <p>Roll No.: {user?.rollno}</p>
          <p>Email: {user?.email}</p>
          <p>Discipline: {user?.discipline}</p>
          <p>Registered Mess: {user?.regmess}</p>
        </div>
        <div id="user-info-actions">
          <button>Edit</button>
        </div>
      </div>
    );
  }
};

export default StudentContent;
