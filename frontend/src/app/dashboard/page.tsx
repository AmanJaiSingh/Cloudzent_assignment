"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useIncidentStore, Incident } from "@/store/useIncidentStore";
import { IncidentTable } from "@/components/IncidentTable";
import { IncidentModal } from "@/components/IncidentModal";
import { DashboardSummary } from "@/components/DashboardSummary";
import { Button } from "@/components/ui/Button";
import { Plus, Filter } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { setIncidents, addIncident, updateIncident, removeIncident } = useIncidentStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incidentToEdit, setIncidentToEdit] = useState<Incident | null>(null);

  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchIncidents = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const url = filterStatus ? `/incidents?status=${filterStatus}` : "/incidents";
      const res = await api.get(url);
      setIncidents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [filterStatus, setIncidents]);

  useEffect(() => {
    fetchIncidents();

    // Poll every 5 seconds for real-time updates silently
    // (SSE/WebSockets don't work on Vercel serverless)
    const interval = setInterval(() => {
      fetchIncidents(false);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchIncidents]);

  const handleCreateNew = () => {
    setIncidentToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (incident: Incident) => {
    setIncidentToEdit(incident);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Dashboard</h1>
          <p className="text-base text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your team's incidents and track resolutions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <select
              className="h-10 pl-9 pr-4 rounded-md border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 appearance-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Incident
          </Button>
        </div>
      </div>

      <DashboardSummary />

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 dark:border-neutral-800 dark:border-t-neutral-50"></div>
        </div>
      ) : (
        <IncidentTable onEdit={handleEdit} />
      )}

      <IncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        incidentToEdit={incidentToEdit}
      />
    </motion.div>
  );
}
