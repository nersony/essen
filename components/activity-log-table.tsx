"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getActivityLogsAction } from "@/app/actions/log-actions"
import type { ActivityLog, ActivityLogAction } from "@/lib/db/schema"

// Update the formatAction function to handle null or undefined action values
function formatAction(action: ActivityLogAction | null | undefined): string {
  if (!action) return "Unknown Action"

  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function ActivityLogTable() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)
  const [filters, setFilters] = useState({
    action: "",
    userEmail: "",
    fromDate: "",
    toDate: "",
  })
  const [tempFilters, setTempFilters] = useState({
    action: "",
    userEmail: "",
    fromDate: "",
    toDate: "",
  })

  // Load logs
  const loadLogs = async () => {
    setLoading(true)
    try {
      const result = await getActivityLogsAction(page, 20, {
        action: filters.action as ActivityLogAction | undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        // Use regex search for email
        ...(filters.userEmail ? { userId: filters.userEmail } : {}),
      })

      if (result.success && result.logs) {
        setLogs(result.logs)
        setTotalPages(result.pages || 1)
        setTotalLogs(result.total || 0)
      } else {
        console.error("Failed to load logs:", result.message)
      }
    } catch (error) {
      console.error("Error loading logs:", error)
    } finally {
      setLoading(false)
    }
  }

  // Load logs on mount and when page or filters change
  useEffect(() => {
    loadLogs()
  }, [page, filters])

  // Apply filters
  const applyFilters = () => {
    setFilters(tempFilters)
    setPage(1) // Reset to first page when filters change
  }

  // Reset filters
  const resetFilters = () => {
    setTempFilters({
      action: "",
      userEmail: "",
      fromDate: "",
      toDate: "",
    })
    setFilters({
      action: "",
      userEmail: "",
      fromDate: "",
      toDate: "",
    })
    setPage(1)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-muted/40 p-4 rounded-md space-y-4">
        <h3 className="font-medium">Filter Logs</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Action</label>
            <Select
              value={tempFilters.action}
              onValueChange={(value) => setTempFilters({ ...tempFilters, action: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="create_product">Create Product</SelectItem>
                <SelectItem value="update_product">Update Product</SelectItem>
                <SelectItem value="delete_product">Delete Product</SelectItem>
                <SelectItem value="create_user">Create User</SelectItem>
                <SelectItem value="update_user">Update User</SelectItem>
                <SelectItem value="delete_user">Delete User</SelectItem>
                <SelectItem value="view_logs">View Logs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">User Email</label>
            <Input
              placeholder="Search by email"
              value={tempFilters.userEmail}
              onChange={(e) => setTempFilters({ ...tempFilters, userEmail: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">From Date</label>
            <Input
              type="date"
              value={tempFilters.fromDate}
              onChange={(e) => setTempFilters({ ...tempFilters, fromDate: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">To Date</label>
            <Input
              type="date"
              value={tempFilters.toDate}
              onChange={(e) => setTempFilters({ ...tempFilters, toDate: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
          <Button onClick={applyFilters}>Apply Filters</Button>
        </div>
      </div>

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Showing {logs.length} of {totalLogs} logs
      </div>

      {/* Logs table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="hidden md:table-cell">IP Address</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading logs...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No logs found
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(log.timestamp), "MMM d, yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell>{log.userEmail}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {formatAction(log.action)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{log.ipAddress}</TableCell>
                  <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNumber = i + 1
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink onClick={() => setPage(pageNumber)} isActive={page === pageNumber}>
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
