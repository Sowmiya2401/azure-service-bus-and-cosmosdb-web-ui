"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Database, ChevronRight, Folder, RefreshCw, AlertTriangle } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

interface DatabaseInfo {
    id: string;
}

interface ContainerInfo {
    id: string;
    partitionKey: string;
}

export default function CosmosPage() {
    const [databases, setDatabases] = useState<DatabaseInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedDb, setExpandedDb] = useState<string | null>(null);
    const [containers, setContainers] = useState<Record<string, ContainerInfo[]>>({});
    const [loadingContainers, setLoadingContainers] = useState<string | null>(null);

    const fetchDatabases = () => {
        setLoading(true);
        fetch("/api/cosmos/databases")
            .then(async (res) => {
                if (res.status === 401) {
                    throw new Error("Unauthorized");
                }
                return res.json();
            })
            .then((data) => {
                if (data.error) {
                    throw new Error(data.error);
                }
                if (Array.isArray(data)) {
                    setDatabases(data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("CosmosPage Error:", err);
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDatabases();
    }, []);

    const loadContainers = async (databaseId: string) => {
        if (expandedDb === databaseId) {
            setExpandedDb(null);
            return;
        }

        if (containers[databaseId]) {
            setExpandedDb(databaseId);
            return;
        }

        setLoadingContainers(databaseId);
        try {
            const res = await fetch(`/api/cosmos/databases/${encodeURIComponent(databaseId)}/containers`);
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setContainers(prev => ({ ...prev, [databaseId]: data }));
            setExpandedDb(databaseId);
        } catch (err) {
            console.error("Error loading containers:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoadingContainers(null);
        }
    };

    if (loading) {
        return (
            <AuthGuard>
                <div className="flex justify-center items-center p-12">
                    <div className="text-center">
                        <Loader2 className="animate-spin text-[#e30613] w-10 h-10 mx-auto mb-4" />
                        <p className="text-[#666666]">Loading databases...</p>
                    </div>
                </div>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard>
            <div className="space-y-6 animate-fadeIn">
                {/* Page Header */}
                <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                <Database className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-[#002147]">Cosmos DB Explorer</h1>
                                <p className="text-[#666666]">Browse databases, containers, and documents</p>
                            </div>
                        </div>
                        <button onClick={fetchDatabases} className="btn-secondary">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Database List Card */}
                <div className="card">
                    <div className="card-header">
                        <div className="flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            <span>Databases & Containers</span>
                            <span className="ml-2 px-2 py-0.5 bg-[rgba(255,255,255,0.2)] rounded text-xs font-medium">
                                {databases.length}
                            </span>
                        </div>
                    </div>
                    
                    <div className="divide-y divide-[#e0e0e0]">
                        {error ? (
                            <div className="p-8 text-center">
                                <AlertTriangle className="w-12 h-12 text-[#e30613] mx-auto mb-3" />
                                <p className="text-[#e30613] font-medium">Error loading databases</p>
                                <p className="text-[#666666] text-sm mt-1">{error}</p>
                                <button onClick={fetchDatabases} className="btn-primary mt-4">
                                    <RefreshCw className="w-4 h-4" />
                                    Retry
                                </button>
                            </div>
                        ) : databases.length === 0 ? (
                            <div className="p-12 text-center">
                                <Database className="w-12 h-12 text-[#e0e0e0] mx-auto mb-3" />
                                <p className="text-[#666666]">No databases found</p>
                            </div>
                        ) : (
                            databases.map((db) => (
                                <div key={db.id}>
                                    {/* Database Row */}
                                    <div
                                        className="p-4 hover:bg-[#f5f5f5] transition-colors cursor-pointer flex items-center justify-between"
                                        onClick={() => loadContainers(db.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <ChevronRight
                                                className={`w-5 h-5 text-[#666666] transition-transform ${
                                                    expandedDb === db.id ? "rotate-90" : ""
                                                }`}
                                            />
                                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                                <Database className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="font-semibold text-[#002147]">{db.id}</span>
                                        </div>
                                        {loadingContainers === db.id && (
                                            <Loader2 className="w-5 h-5 animate-spin text-[#002147]" />
                                        )}
                                    </div>
                                    
                                    {/* Containers List */}
                                    {expandedDb === db.id && containers[db.id] && (
                                        <div className="bg-[#f5f5f5] border-t border-[#e0e0e0] animate-slideIn">
                                            {containers[db.id].length === 0 ? (
                                                <div className="p-6 pl-16 text-[#666666] text-sm">
                                                    No containers found
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-[#e0e0e0]">
                                                    {containers[db.id].map((container) => (
                                                        <Link
                                                            key={container.id}
                                                            href={`/cosmos/${encodeURIComponent(db.id)}/${encodeURIComponent(container.id)}`}
                                                            className="flex items-center justify-between p-4 pl-16 hover:bg-white transition-colors group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Folder className="w-5 h-5 text-yellow-500 group-hover:text-yellow-600" />
                                                                <span className="font-medium text-[#333333] group-hover:text-[#002147]">
                                                                    {container.id}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs bg-[#efefef] px-2 py-1 rounded text-[#666666]">
                                                                    PK: {container.partitionKey}
                                                                </span>
                                                                <ChevronRight className="w-4 h-4 text-[#666666] group-hover:text-[#002147]" />
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
