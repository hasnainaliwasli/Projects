"use client";

import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchUserReports } from "@/lib/slices/reportSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, FileText, Calendar, CheckCircle2 } from "lucide-react";

export default function MyReportsPage() {
    const dispatch = useAppDispatch();
    const { reports, loading, error } = useAppSelector((state) => state.reports);
    const { currentUser } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchUserReports());
    }, [dispatch]);

    if (!currentUser) return null;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "resolved":
                return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Resolved</Badge>;
            case "read":
                return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Reviewed</Badge>;
            default:
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Under Review</Badge>;
        }
    };

    return (
        <DashboardLayout role={currentUser.role as any}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-2">My Reports</h1>
                    <p className="text-muted-foreground text-md">Track the status of your submitted reports</p>
                </div>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                        <div className="bg-destructive/10 p-4 rounded-full mb-3">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold text-destructive">Error Loading Reports</h3>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                ) : reports.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center h-64 text-center p-8">
                            <div className="bg-muted p-4 rounded-full mb-4">
                                <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No Reports Found</h3>
                            <p className="text-muted-foreground text-md mb-6 max-w-sm">
                                You haven't submitted any reports yet. If you encounter any issues with a hostel or user, you can submit a report.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {reports.map((report) => (
                            <Card key={report._id} className="overflow-hidden transition-all hover:shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-4 justify-between md:items-start">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-start justify-between md:justify-start gap-3">
                                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Issue
                                                </h3>
                                                <div className="md:hidden">
                                                    {getStatusBadge(report.status)}
                                                </div>
                                            </div>

                                            {report.hostelName && (
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Hostel: <span className="text-foreground">{report.hostelName}</span>
                                                </p>
                                            )}

                                            <div className="bg-muted/30 p-3 rounded-md text-sm text-foreground/80 mt-2">
                                                {report.description}
                                            </div>

                                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(report.createdAt).toLocaleDateString()}
                                                </div>
                                                {report.cnic && (
                                                    <span>CNIC: {report.cnic}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="hidden md:flex flex-col items-end gap-2 min-w-[120px]">
                                            {getStatusBadge(report.status)}
                                            {report.status === 'resolved' && (
                                                <div className="flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Resolved
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
