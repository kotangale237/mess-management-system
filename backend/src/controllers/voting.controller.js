import {contract} from "../utils/VotingSystemContract.js"
import { ethers } from "ethers"; 
import {Voting} from "../models/voting.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getPollStatus =  async (req, res) => {
  const { pollId } = req.params;

  try {
      const status = await contract.getPollStatus(pollId);
      res.status(201).json(
        new ApiResponse(201, {  status })
      )
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

const addCandidateToPoll = async (req, res) => {
  const { pollID } = req.params;
  const { name, rollno, branch, cgpa } = req.body;

  try {
    const scaledCgpa = Math.floor(cgpa * 10); // Scale the CGPA to remove the decimal
    const tx = await contract.addCandidateToPoll(pollID, name, rollno, branch, scaledCgpa);
    await tx.wait(); // Wait for the transaction to be mined

    res.status(201).json(
      new ApiResponse(201, { tx }, "Candidate added successfully")
    )
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  

const createPoll = async (req, res) => {
  const { title, description, deadline } = req.body;

  try {
    const tx = await contract.createPoll(title, description, deadline);
    await tx.wait();
    res.status(200).json({ message: 'Poll created successfully', transactionHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const voteInPoll = async (req, res) => {
  const { pollId } = req.params;
  const { rollno } = req.body;

  try {
      const tx = await contract.voteInPoll(pollId, rollno);
      await tx.wait();
      res.status(200).json({ message: 'Vote cast successfully', transactionHash: tx.hash });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

const getCandidateRollnos = async (req, res) => {
  const { pollId } = req.params;

  try {
      const rollNumbers = await contract.getCandidateRollnos(pollId);
      res.status(200).json({ candidates: rollNumbers });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

const getCandidateDetails = async (req, res) => {
  const { pollId, rollno } = req.params;

  try {
      const candidate = await contract.getCandidate(pollId, rollno);
      res.status(200).json({
          name: candidate[0],
          branch: candidate[1],
          cgpa: candidate[2],
          voteCount: candidate[3]
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

const getPollResults = async (req, res) => {
  const { pollId } = req.params;

  try {
      const results = await contract.getPollResults(pollId);
      res.status(200).json({ results });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

const endPoll = async (req, res) => {
  const { pollId } = req.params;

  try {
      const tx = await contract.checkAndEmitPollEnd(pollId);
      await tx.wait();
      res.status(200).json({ message: 'Poll ended event emitted', transactionHash: tx.hash });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}


export {
    createPoll,
    addCandidateToPoll,
    getPollStatus,
    voteInPoll,
    getCandidateRollnos,
    getCandidateDetails,
    getPollResults,
    endPoll
}

