"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import Image from "next/image";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "approveChange",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "parcelID",
				"type": "string"
			}
		],
		"name": "ProposalApproved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "parcelID",
				"type": "string"
			}
		],
		"name": "ProposalRejected",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "parcelID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "submittedBy",
				"type": "address"
			}
		],
		"name": "ProposalSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_parcelID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_proposedUse",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_locationURI",
				"type": "string"
			}
		],
		"name": "proposeChange",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "rejectChange",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "changes",
		"outputs": [
			{
				"internalType": "string",
				"name": "parcelID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "proposedUse",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "locationURI",
				"type": "string"
			},
			{
				"internalType": "enum LandUseNotification.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "submittedBy",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "cityHall",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getChange",
		"outputs": [
			{
				"internalType": "string",
				"name": "parcelID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "proposedUse",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "locationURI",
				"type": "string"
			},
			{
				"internalType": "enum LandUseNotification.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "submittedBy",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalChanges",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export default function AdminPage() {
  const [form, setForm] = useState({
    title: "",
    developer: "",
    location: "",
    parcelId: "",
    devType: "",
    description: "",
    docUrl: "",
  });
  const [proposals, setProposals] = useState([]);
  const [contract, setContract] = useState(null);

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) return alert("MetaMask not detected");

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      await browserProvider.send("eth_requestAccounts", []);
      const signer = await browserProvider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contract);
    } catch (err) {
      console.error("Wallet connection error:", err);
      alert("Failed to connect wallet.");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitProposal = async (e) => {
    e.preventDefault();
    if (!contract) return alert("Wallet not connected");

    try {
      const tx = await contract.proposeChange(
        form.parcelId,
        form.devType,
        form.description,
        form.docUrl
      );
      await tx.wait();
      setForm({
        title: "",
        developer: "",
        location: "",
        parcelId: "",
        devType: "",
        description: "",
        docUrl: "",
      });
      fetchProposals();
    } catch (err) {
      console.error("Submission error:", err);
      alert("Error submitting proposal");
    }
  };

  const fetchProposals = useCallback(async () => {
    if (!contract) return;

    try {
      const total = await contract.getTotalChanges();
      const fetched = [];

      for (let i = 0; i < total; i++) {
        const [
          parcelID,
          proposedUse,
          description,
          locationURI,
          statusEnum,
          submittedBy,
          timestamp,
        ] = await contract.getChange(i);

        fetched.push({
          id: i,
          parcelID,
          proposedUse,
          description,
          locationURI,
          status:
            Number(statusEnum) === 0
              ? "Pending"
              : Number(statusEnum) === 1
              ? "Approved"
              : "Rejected",
          submittedBy,
          timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
        });
      }

      setProposals(fetched);
    } catch (err) {
      console.error("Error fetching proposals", err);
    }
  }, [contract]);

  const updateStatus = async (id, status) => {
    if (!contract) return;

    try {
      const tx =
        status === "Approved"
          ? await contract.approveChange(id)
          : await contract.rejectChange(id);
      await tx.wait();
      fetchProposals();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  useEffect(() => {
    if (contract) fetchProposals();
  }, [contract, fetchProposals]);

  return (
    <main className="p-6 max-w-4xl mx-auto font-sans">
      <header className="flex items-center gap-4 mb-8">
        <Image
          src="/images/logo.jpeg"
          alt="UrbanScope Logo"
          width={48}
          height={48}
          className="rounded"
        />
        <h1 className="text-3xl font-bold text-blue-800">UrbanScope Admin Dashboard</h1>
      </header>

      <section className="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Submit New Development Proposal</h2>
        <form onSubmit={submitProposal} className="grid gap-4">
          {["title", "developer", "location", "parcelId", "docUrl"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field === "docUrl" ? "Document URL (IPFS or Web)" : field.replace(/([A-Z])/g, " $1")}
              className="border border-gray-300 p-2 rounded"
              required
            />
          ))}
          <select
            name="devType"
            value={form.devType}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          >
            <option value="">-- Select Development Type --</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Mixed">Mixed Use</option>
          </select>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Project Description"
            className="border border-gray-300 p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Submit Proposal
          </button>
        </form>
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Submitted Proposals</h2>
        <table className="w-full border border-collapse text-sm">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Parcel</th>
              <th className="p-2 border">Use</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {proposals.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-4">No proposals yet</td></tr>
            ) : (
              proposals.map((p) => (
                <tr key={p.id} className="odd:bg-gray-50">
                  <td className="border p-2">{p.id}</td>
                  <td className="border p-2">{p.parcelID}</td>
                  <td className="border p-2">{p.proposedUse}</td>
                  <td className="border p-2">{p.status}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => updateStatus(p.id, "Approved")}
                      className="text-green-600 hover:underline"
                    >
                      ✔ Approve
                    </button>
                    <button
                      onClick={() => updateStatus(p.id, "Rejected")}
                      className="text-red-600 hover:underline"
                    >
                      ✖ Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
