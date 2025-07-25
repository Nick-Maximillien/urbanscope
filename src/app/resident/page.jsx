"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import contractABI from "../../lib/abi.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const STATUS_MAP = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
};

export default function ResidentPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const count = await contract.getTotalChanges();
      const proposals = [];

      for (let i = 0; i < count; i++) {
        const proposal = await contract.getChange(i);
        proposals.push({
          id: i,
          parcelID: proposal[0],
          proposedUse: proposal[1],
          description: proposal[2],
          locationURI: proposal[3],
          status: STATUS_MAP[proposal[4]] || "Unknown",
          submittedBy: proposal[5],
          timestamp: Number(proposal[6]),
        });
      }

      setProposals(proposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resident-container">
      <header className="resident-header">
        <Image
          src="/images/logo.jpeg"
          alt="UrbanScope Logo"
          width={120}
          height={60}
          className="resident-logo"
        />
        <h1>Resident Dashboard</h1>
      </header>

      <section className="resident-section">
        <h2>Available Development Proposals</h2>
        <button className="refresh-btn" onClick={fetchProposals}>
          🔄 Refresh
        </button>

        {loading ? (
          <p>Loading proposals...</p>
        ) : proposals.length === 0 ? (
          <p>No development proposals found.</p>
        ) : (
          <table className="proposal-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Proposed Use</th>
                <th>Description</th>
                <th>Parcel ID</th>
                <th>Status</th>
                <th>Document</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{proposal.proposedUse}</td>
                  <td>{proposal.description}</td>
                  <td>{proposal.parcelID}</td>
                  <td>{proposal.status}</td>
                  <td>
                    <a
                      href={proposal.locationURI}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
