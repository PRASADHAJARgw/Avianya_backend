"use client"

import {
    ColumnDef, getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, PaginationState, SortingState, useReactTable, VisibilityState
} from "@tanstack/react-table"
import { MoreHorizontal, MessageSquare, Phone, Mail } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Contact } from "@/types/contact"
import Loading from "../../../loading"
import { AddContactDialog } from "./AddContactDialog"
import { ContactsTable } from "./ContactsTable"
import { fetchData, itemsPerPage } from "./fetchData"
import { AddBulkContactsDialog } from "./AddBulkContactsDialog"
import { useSupabase } from "@/contexts/AuthContext"

export default function ContactsClient() {
    console.log('🎯 ContactsClient component rendered');
    
    const { supabase } = useSupabase();
    console.log('🔌 Supabase context:', supabase ? 'Connected' : 'Not connected');
    
    const navigate = useNavigate()
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
    
    const columns = useMemo<ColumnDef<Contact>[]>(
        () => [
            {
                accessorKey: "wa_id",
                header: "Number",
                size: 160,
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue("wa_id")}</div>
                ),
            },
            {
                accessorKey: "profile_name",
                header: 'Name',
                size: 280,
                cell: ({ row }) => <div className="font-medium">{row.getValue("profile_name")}</div>,
            },
            {
                accessorKey: "created_at",
                header: 'Created At',
                size: 280,
                cell: ({ row }) => {
                    const date = new Date(row.getValue("created_at"));
                    return <div className="text-sm text-gray-500">{date.toLocaleDateString()}</div>
                },
            },
            {
                accessorKey: "tags",
                header: 'Tags',
                size: 280,
                cell: ({ row }) => {
                    const tags = (row.getValue('tags') as unknown as string[]) || [];
                    return (
                        <div className="flex gap-1 flex-wrap">
                            {tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                        </div>
                    )
                },
            },
            {
                id: "actions",
                size: 100,
                enableHiding: false,
                cell: ({ row }) => {
                    const contact = row.original;
                    return (
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate('/wa/live-chat/chats')}
                                className="gap-1"
                            >
                                <MessageSquare className="h-3 w-3" />
                                Chat
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate('/wa/live-chat/chats')}>
                                        Open Chat
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                },
            },
        ],
        [navigate]
    )

    const [{ pageIndex, pageSize }, setPagination] =
        React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: itemsPerPage,
        })
    const [ searchFilter, setSearchFilter ] = useState("")

    const fetchDataOptions = {
        pageIndex,
        pageSize,
        searchFilter
    }
    
    console.log('🔄 Query options:', fetchDataOptions);

    const dataQuery = useQuery({
        queryKey: ['data', fetchDataOptions],
        queryFn: () => {
            console.log('🚀 React Query executing fetchData...');
            return fetchData(supabase, fetchDataOptions);
        },
        placeholderData: keepPreviousData,
        retry: false // Disable retry to see errors immediately
    })
    
    console.log('📊 Query state:', {
        isLoading: dataQuery.isLoading,
        isError: dataQuery.isError,
        error: dataQuery.error,
        dataRowsCount: dataQuery.data?.rows?.length,
        pageCount: dataQuery.data?.pageCount
    });
    const defaultData = React.useMemo(() => [], [])

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable<Contact>({
        data: dataQuery.data?.rows ?? defaultData,
        columns,
        manualPagination: true,
        pageCount: dataQuery.data?.pageCount ?? -1,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
        },
    })

    const getInitials = (name: string) => {
        return name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="m-4 bg-white rounded-xl p-4">
            <div className="flex justify-between items-center py-4">
                <div className="flex gap-4 items-center flex-1">
                    <Input
                        placeholder="Search contacts by name or number..."
                        value={searchFilter}
                        onChange={(event) => setSearchFilter(event.target.value) }
                        className="max-w-sm"
                    />
                    <div className="flex gap-2">
                        <Button 
                            variant={viewMode === 'grid' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setViewMode('grid')}
                        >
                            Grid
                        </Button>
                        <Button 
                            variant={viewMode === 'table' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setViewMode('table')}
                        >
                            Table
                        </Button>
                    </div>
                </div>
                <div className="space-x-2">
                    <AddBulkContactsDialog onSuccessfulAdd={dataQuery.refetch}>
                        <Button className="ml-auto">Add Bulk Contacts</Button>
                    </AddBulkContactsDialog>
                    <AddContactDialog onSuccessfulAdd={dataQuery.refetch}>
                        <Button className="ml-auto">Add Contact</Button>
                    </AddContactDialog>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="relative">
                    {dataQuery.isLoading && (
                        <div className="absolute z-10 block w-full h-full bg-gray-500 opacity-30 rounded-md">
                            <Loading/>
                        </div>
                    )}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {(dataQuery.data?.rows ?? []).map((contact) => (
                            <Card 
                                key={contact.wa_id} 
                                className="hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => navigate('/wa/live-chat/chats')}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={contact.profile_pic_url} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                {getInitials(contact.name || contact.profile_name || 'Unknown')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate">
                                                {contact.name || contact.profile_name || contact.wa_id || 'Unknown'}
                                            </h3>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                                <Phone className="h-3 w-3" />
                                                <span className="truncate">{contact.wa_id}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-2">
                                                Added {formatDate(contact.created_at)}
                                            </div>
                                            {/* Tags removed - not in Contact type */}
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t flex gap-2">
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="flex-1 gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate('/wa/live-chat/chats');
                                            }}
                                        >
                                            <MessageSquare className="h-3 w-3" />
                                            Chat
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {(!dataQuery.data?.rows || dataQuery.data.rows.length === 0) && !dataQuery.isLoading && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                {searchFilter ? 'No contacts found matching your search' : 'No contacts yet. Add your first contact!'}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-md border relative">
                    {dataQuery.isLoading && (
                        <div className="absolute z-10 block w-full h-full bg-gray-500 opacity-30">
                            <Loading/>
                        </div>
                    )}
                    <ContactsTable table={table} totalColumns={columns.length} />
                </div>
            )}

            <div className="flex items-center justify-end space-x-2 py-4">
                {table.getPageCount() != -1 && (
                    <div className="text-sm text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                )}
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
