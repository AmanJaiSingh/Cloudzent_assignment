import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useIncidentStore, Incident } from "@/store/useIncidentStore";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, AlertTriangle, Info, Edit, Trash2 } from "lucide-react";

interface IncidentTableProps {
  onEdit: (incident: Incident) => void;
}

export function IncidentTable({ onEdit }: IncidentTableProps) {
  const { incidents, removeIncident } = useIncidentStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this incident?")) return;
    setLoadingId(id);
    try {
      await api.delete(`/incidents/${id}`);
      removeIncident(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete incident");
    } finally {
      setLoadingId(null);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "low":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      open: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      investigating: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const activeIncidents = incidents.filter(i => i.status === "open" || i.status === "investigating");
  const resolvedIncidents = incidents.filter(i => i.status === "resolved");

  const renderTable = (data: Incident[], title: string, emptyMessage: string) => {
    if (data.length === 0) {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">{title}</h2>
          <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <ActivityIcon className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mb-3" />
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">{emptyMessage}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">{title}</h2>
        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-400 text-nowrap">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300 uppercase text-xs font-semibold border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {data.map((incident) => (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    key={incident._id}
                    className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-50 truncate max-w-[200px]" title={incident.title}>
                      {incident.title}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(incident.severity)}
                        <span className="capitalize">{incident.severity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(incident.status)}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(incident.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(incident)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(incident._id)}
                        disabled={loadingId === incident._id}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <ActivityIcon className="h-12 w-12 text-neutral-300 dark:text-neutral-700 mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-1">No incidents reported</h3>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Your team currently has no reported incidents.</p>
      </div>
    );
  }

  return (
    <div>
      {renderTable(activeIncidents, "Active Incidents", "No active incidents currently reported.")}
      {renderTable(resolvedIncidents, "Resolved Incidents", "No incidents have been resolved yet.")}
    </div>
  );
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
