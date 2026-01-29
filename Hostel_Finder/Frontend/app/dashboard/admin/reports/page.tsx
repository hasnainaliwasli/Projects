"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchReports, updateReportStatus, deleteReport, setCurrentReport } from "@/lib/slices/reportSlice";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Flag,
    Mail,
    MailOpen,
    Trash2,
    CheckCircle,
    Search,
    AlertTriangle,
    ShieldAlert,
    Clock,
    User,
    ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function ReportsPage() {
    const dispatch = useAppDispatch();
    const { reports, loading, error } = useAppSelector((state) => state.reports);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [reportToDelete, setReportToDelete] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        dispatch(fetchReports());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(`Error loading reports: ${error}`);
        }
    }, [error]);

    const handleSelectReport = (report: any) => {
        setSelectedReportId(report._id);
        if (report.status === 'unread') {
            dispatch(updateReportStatus({ id: report._id, status: 'read' }));
        }
    };

    const handleDeleteClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setReportToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!reportToDelete) return;

        try {
            await dispatch(deleteReport(reportToDelete)).unwrap();
            toast.success("Report deleted");
            if (selectedReportId === reportToDelete) setSelectedReportId(null);
            setShowDeleteModal(false);
            setReportToDelete(null);
        } catch (error) {
            toast.error("Failed to delete report");
        }
    };

    const handleMarkAs = async (id: string, status: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            await dispatch(updateReportStatus({ id, status })).unwrap();
            toast.success(`Marked as ${status}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredReports = reports.filter(report => {
        const matchesSearch =
            report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.type.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'resolved') return matchesSearch && report.status === 'resolved';
        if (activeTab === 'unresolved') return matchesSearch && report.status !== 'resolved';
        return matchesSearch;
    });

    const selectedReport = reports.find(r => r._id === selectedReportId);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'fraud': return <ShieldAlert className="h-4 w-4 text-destructive" />;
            case 'safety': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
            default: return <Flag className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                            <Flag className="h-5 w-5 md:h-8 md:w-8 text-primary" />
                            User Reports
                        </h1>
                        <p className="text-muted-foreground">Review and manage user submitted reports</p>
                    </div>
                </div>

                <div className="flex-1 flex gap-4 overflow-hidden">
                    {/* List Column */}
                    <Card className={`flex-1 flex flex-col overflow-hidden ${selectedReportId ? 'hidden md:flex md:w-1/2 lg:w-2/5' : 'w-full'}`}>
                        <div className="p-4 border-b space-y-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search reports..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="unresolved">Unresolved</TabsTrigger>
                                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <ScrollArea className="flex-1">
                            {loading && reports.length === 0 ? (
                                <div className="flex justify-center p-8"><Loader /></div>
                            ) : filteredReports.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">No reports found</div>
                            ) : (
                                <div className="divide-y">
                                    {filteredReports.map((report) => (
                                        <div
                                            key={report._id}
                                            onClick={() => handleSelectReport(report)}
                                            className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors flex gap-3 ${selectedReportId === report._id ? 'bg-muted/50' : ''} ${report.status === 'unread' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                        >
                                            <div className="mt-1">
                                                {report.status === 'unread' ? (
                                                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                                                ) : (
                                                    <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <span className={`text-sm font-medium truncate ${report.status === 'unread' ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                        {report.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                        {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs py-0 h-5 gap-1">
                                                        {getTypeIcon(report.type)}
                                                        <span className="capitalize">{report.type}</span>
                                                    </Badge>
                                                    {report.hostelName && (
                                                        <span className="text-xs text-muted-foreground truncate">
                                                            re: {report.hostelName}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {report.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </Card>

                    {/* Detail Column */}
                    {selectedReport ? (
                        <Card className="flex-[2] flex flex-col overflow-hidden h-full border-l shadow-xl md:shadow-none z-10 absolute inset-0 md:static bg-background">
                            <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedReportId(null)}>
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <h2 className="font-semibold text-lg flex items-center gap-2">
                                        {getTypeIcon(selectedReport.type)}
                                        <span className="capitalize">{selectedReport.type} Report</span>
                                    </h2>
                                </div>
                                <div className="flex gap-2">
                                    {selectedReport.status !== 'resolved' && (
                                        <Button size="sm" variant="outline" onClick={() => handleMarkAs(selectedReport._id, 'resolved')}>
                                            <CheckCircle className="mr-2 h-4 w-4" /> Resolve
                                        </Button>
                                    )}
                                    <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={(e) => handleDeleteClick(selectedReport._id, e)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 p-6">
                                <div className="space-y-6 max-w-3xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{selectedReport.name}</h3>
                                                <p className="text-sm text-muted-foreground">{selectedReport.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1 justify-end">
                                                <Clock className="h-3 w-3" />
                                                {new Date(selectedReport.createdAt).toLocaleString()}
                                            </div>
                                            <div className="mt-1">
                                                ID: {selectedReport._id.slice(-8)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-muted/30 p-4 rounded-lg border space-y-3">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Status</span>
                                                <Badge
                                                    className={`capitalize ${selectedReport.status === 'resolved' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                                        selectedReport.status === 'unread' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                                            'bg-gray-100 text-gray-800 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {selectedReport.status}
                                                </Badge>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Related Hostel</span>
                                                {selectedReport.hostelName ? (
                                                    <span className="font-medium">{selectedReport.hostelName}</span>
                                                ) : (
                                                    <span className="text-muted-foreground italic">None specified</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <MailOpen className="h-4 w-4" /> Description
                                        </h4>
                                        <div className="prose dark:prose-invert max-w-none text-sm p-4 bg-muted/10 rounded-lg border whitespace-pre-wrap">
                                            {selectedReport.description}
                                        </div>
                                    </div>

                                    {selectedReport.status === 'resolved' && (
                                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900 p-4 rounded-lg flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="font-medium text-green-900 dark:text-green-100">Report Resolved</p>
                                                <p className="text-sm text-green-700 dark:text-green-300">This issue has been marked as resolved by admin.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </Card>
                    ) : (
                        <div className="hidden md:flex flex-[2] bg-muted/10 items-center justify-center flex-col text-muted-foreground border-l border-dashed">
                            <Mail className="h-16 w-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Select a report to view details</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md my-0 shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <Trash2 className="h-5 w-5" />
                                Delete Report
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to delete this report?
                            </p>
                            <p className="text-sm text-muted-foreground mb-6">
                                This action is permanent and cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setReportToDelete(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={confirmDelete}
                                    variant="destructive"
                                >
                                    Delete Report
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
}
