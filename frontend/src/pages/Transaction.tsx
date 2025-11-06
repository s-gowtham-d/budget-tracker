
// import { useState } from 'react';
// import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Plus, Search, Download, ArrowUpDown } from "lucide-react";
// import TransactionDialog from "@/components/transactions/TransactionDialog";
// import TransactionFilters from "@/components/transactions/TransactionFilters";
// import TransactionTable from "@/components/transactions/TransactionTable";

// // Pagination Component
// function Pagination({ currentPage, totalPages, onPageChange }) {
//     return (
//         <div className="flex items-center justify-between px-2 py-4">
//             <div className="text-sm text-muted-foreground">
//                 Page {currentPage} of {totalPages}
//             </div>
//             <div className="flex items-center gap-2">
//                 <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => onPageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                 >
//                     Previous
//                 </Button>
//                 <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => onPageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                 >
//                     Next
//                 </Button>
//             </div>
//         </div>
//     );
// }

// // Mock transaction data
// const INITIAL_TRANSACTIONS = [
//     {
//         id: 1,
//         name: 'Salary Payment',
//         category: 'Salary',
//         amount: 5000,
//         type: 'income',
//         date: '2025-11-02',
//         icon: '💰',
//         description: 'Monthly salary'
//     },
//     {
//         id: 2,
//         name: 'Grocery Store',
//         category: 'Food & Dining',
//         amount: -120,
//         type: 'expense',
//         date: '2025-11-01',
//         icon: '🛒'
//     },
//     {
//         id: 3,
//         name: 'Electric Bill',
//         category: 'Bills & Utilities',
//         amount: -85,
//         type: 'expense',
//         date: '2025-10-31',
//         icon: '💡'
//     },
//     {
//         id: 4,
//         name: 'Freelance Project',
//         category: 'Freelance',
//         amount: 1500,
//         type: 'income',
//         date: '2025-10-30',
//         icon: '💼',
//         description: 'Website development'
//     },
//     {
//         id: 5,
//         name: 'Restaurant',
//         category: 'Food & Dining',
//         amount: -45,
//         type: 'expense',
//         date: '2025-10-29',
//         icon: '🍽️'
//     },
//     {
//         id: 6,
//         name: 'Gas Station',
//         category: 'Transportation',
//         amount: -60,
//         type: 'expense',
//         date: '2025-10-28',
//         icon: '⛽'
//     },
//     {
//         id: 7,
//         name: 'Online Shopping',
//         category: 'Shopping',
//         amount: -250,
//         type: 'expense',
//         date: '2025-10-27',
//         icon: '🛍️'
//     },
//     {
//         id: 8,
//         name: 'Movie Tickets',
//         category: 'Entertainment',
//         amount: -30,
//         type: 'expense',
//         date: '2025-10-26',
//         icon: '🎬'
//     },
// ];

// export default function Transactions() {
//     const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
//     const [filteredTransactions, setFilteredTransactions] = useState(INITIAL_TRANSACTIONS);
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [editingTransaction, setEditingTransaction] = useState(null);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [sortBy, setSortBy] = useState('date-desc');

//     // Pagination
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;
//     const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
//     const paginatedTransactions = filteredTransactions.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//     );

//     // Filter transactions
//     const handleFilterChange = (filters) => {
//         let filtered = [...transactions];

//         // Filter by type
//         if (filters.type !== 'all') {
//             filtered = filtered.filter(t => t.type === filters.type);
//         }

//         // Filter by category
//         if (filters.category !== 'all') {
//             filtered = filtered.filter(t => t.category === filters.category);
//         }

//         // Filter by amount range
//         if (filters.minAmount) {
//             filtered = filtered.filter(t => Math.abs(t.amount) >= parseFloat(filters.minAmount));
//         }
//         if (filters.maxAmount) {
//             filtered = filtered.filter(t => Math.abs(t.amount) <= parseFloat(filters.maxAmount));
//         }

//         // Filter by date range
//         if (filters.startDate) {
//             filtered = filtered.filter(t => new Date(t.date) >= filters.startDate);
//         }
//         if (filters.endDate) {
//             filtered = filtered.filter(t => new Date(t.date) <= filters.endDate);
//         }

//         setFilteredTransactions(filtered);
//         setCurrentPage(1);
//     };

//     // Search transactions
//     const handleSearch = (query) => {
//         setSearchQuery(query);
//         if (query.trim() === '') {
//             setFilteredTransactions(transactions);
//         } else {
//             const filtered = transactions.filter(t =>
//                 t.name.toLowerCase().includes(query.toLowerCase()) ||
//                 t.category.toLowerCase().includes(query.toLowerCase())
//             );
//             setFilteredTransactions(filtered);
//         }
//         setCurrentPage(1);
//     };

//     // Sort transactions
//     const handleSort = (sortType) => {
//         setSortBy(sortType);
//         let sorted = [...filteredTransactions];

//         switch (sortType) {
//             case 'date-desc':
//                 sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//                 break;
//             case 'date-asc':
//                 sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//                 break;
//             case 'amount-desc':
//                 sorted.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
//                 break;
//             case 'amount-asc':
//                 sorted.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
//                 break;
//             case 'name-asc':
//                 sorted.sort((a, b) => a.name.localeCompare(b.name));
//                 break;
//             case 'name-desc':
//                 sorted.sort((a, b) => b.name.localeCompare(a.name));
//                 break;
//         }

//         setFilteredTransactions(sorted);
//     };

//     // Save transaction
//     const handleSaveTransaction = (transaction) => {
//         if (editingTransaction) {
//             // Update existing
//             setTransactions(prev =>
//                 prev.map(t => t.id === transaction.id ? transaction : t)
//             );
//             setFilteredTransactions(prev =>
//                 prev.map(t => t.id === transaction.id ? transaction : t)
//             );
//         } else {
//             // Add new
//             setTransactions(prev => [transaction, ...prev]);
//             setFilteredTransactions(prev => [transaction, ...prev]);
//         }
//         setEditingTransaction(null);
//     };

//     // Edit transaction
//     const handleEditTransaction = (transaction) => {
//         setEditingTransaction(transaction);
//         setDialogOpen(true);
//     };

//     // Delete transaction
//     const handleDeleteTransaction = (id) => {
//         setTransactions(prev => prev.filter(t => t.id !== id));
//         setFilteredTransactions(prev => prev.filter(t => t.id !== id));
//     };

//     // Reset filters
//     const handleResetFilters = () => {
//         setFilteredTransactions(transactions);
//         setSearchQuery('');
//         setCurrentPage(1);
//     };

//     // Export to CSV
//     const handleExport = () => {
//         const headers = ['Date', 'Name', 'Category', 'Type', 'Amount'];
//         const rows = filteredTransactions.map(t => [
//             t.date,
//             t.name,
//             t.category,
//             t.type,
//             t.amount
//         ]);

//         const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
//         const blob = new Blob([csv], { type: 'text/csv' });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'transactions.csv';
//         a.click();
//     };

//     return (
//         <SidebarProvider>
//             <AppSidebar />
//             <SidebarInset>
//                 {/* Header */}
//                 <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
//                     <SidebarTrigger className="-ml-1" />
//                     <Separator orientation="vertical" className="mr-2 h-4" />
//                     <div className="flex items-center gap-2 flex-1">
//                         <h1 className="text-xl font-semibold">Transactions</h1>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <Button variant="outline" size="sm" onClick={handleExport}>
//                             <Download className="h-4 w-4 mr-2" />
//                             Export
//                         </Button>
//                         <Button size="sm" onClick={() => {
//                             setEditingTransaction(null);
//                             setDialogOpen(true);
//                         }}>
//                             <Plus className="h-4 w-4 mr-2" />
//                             Add Transaction
//                         </Button>
//                     </div>
//                 </header>

//                 {/* Main Content */}
//                 <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
//                     <div className="max-w-7xl mx-auto">
//                         <div className="grid gap-6 lg:grid-cols-4">
//                             {/* Filters Sidebar */}
//                             <div className="lg:col-span-1">
//                                 <TransactionFilters
//                                     onFilterChange={handleFilterChange}
//                                     onReset={handleResetFilters}
//                                 />
//                             </div>

//                             {/* Transactions List */}
//                             <div className="lg:col-span-3 space-y-4">
//                                 {/* Search and Sort */}
//                                 <div className="flex items-center gap-4">
//                                     <div className="relative flex-1">
//                                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                                         <Input
//                                             placeholder="Search transactions..."
//                                             value={searchQuery}
//                                             onChange={(e) => handleSearch(e.target.value)}
//                                             className="pl-9"
//                                         />
//                                     </div>
//                                     <Select value={sortBy} onValueChange={handleSort}>
//                                         <SelectTrigger className="w-[180px]">
//                                             <ArrowUpDown className="h-4 w-4 mr-2" />
//                                             <SelectValue />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="date-desc">Date (Newest)</SelectItem>
//                                             <SelectItem value="date-asc">Date (Oldest)</SelectItem>
//                                             <SelectItem value="amount-desc">Amount (High)</SelectItem>
//                                             <SelectItem value="amount-asc">Amount (Low)</SelectItem>
//                                             <SelectItem value="name-asc">Name (A-Z)</SelectItem>
//                                             <SelectItem value="name-desc">Name (Z-A)</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>

//                                 {/* Transactions Table */}
//                                 <TransactionTable
//                                     transactions={paginatedTransactions}
//                                     onEdit={handleEditTransaction}
//                                     onDelete={handleDeleteTransaction}
//                                 />

//                                 {/* Pagination */}
//                                 {totalPages > 1 && (
//                                     <Pagination
//                                         currentPage={currentPage}
//                                         totalPages={totalPages}
//                                         onPageChange={setCurrentPage}
//                                     />
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//             </SidebarInset>

//             {/* Add/Edit Dialog */}
//             <TransactionDialog
//                 open={dialogOpen}
//                 onOpenChange={setDialogOpen}
//                 transaction={editingTransaction}
//                 onSave={handleSaveTransaction}
//             />
//         </SidebarProvider>
//     );
// }



import { useEffect, useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Download, ArrowUpDown, AlertCircle, Loader2 } from "lucide-react";
import TransactionDialog from "@/components/transactions/TransactionDialog";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionTable from "@/components/transactions/TransactionTable";
import { TableSkeleton } from "@/components/dashboard/TableSkeleton";
import { useTransactionStore } from "@/store/transactionStore";
// import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner"
import { useDashboardStore } from '@/store/dashboardStore';
import { FinanceAssistant } from '@/components/ai-assistant/FinanceAssistant';


function Pagination({ currentPage, totalPages, onPageChange }: any) {
    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

export default function Transactions() {
    const {
        transactions,
        categories,
        isLoading,
        error,
        currentPage,
        fetchTransactions,
        fetchCategories,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setPage,
    } = useTransactionStore();

    const { fetchSummary } = useDashboardStore()

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');
    const [filters, setFilters] = useState({});
    //   const { toast } = useToast();

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, [fetchTransactions, fetchCategories]);

    useEffect(() => {
        fetchSummary();
    }, [transactions, fetchSummary])

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
        fetchTransactions(newFilters);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        fetchTransactions({ ...filters, search: query });
    };

    const handleSort = (sortType: string) => {
        setSortBy(sortType);
        const ordering = sortType.includes('desc') ? `-${sortType.split('-')[0]}` : sortType.split('-')[0];
        fetchTransactions({ ...filters, ordering });
    };

    const handleSaveTransaction = async (transaction: any) => {
        try {
            if (editingTransaction) {
                await updateTransaction(editingTransaction.id, transaction);
                toast.success("Transaction updated successfully")
                // toast({
                //   title: "Success",
                //   description: "Transaction updated successfully",
                // });
            } else {
                await addTransaction(transaction);
                toast.success("Transaction added successfully")
                //     toast({
                //       title: "Success",
                //       description: "Transaction added successfully",
                //     });
            }
            setDialogOpen(false);
            setEditingTransaction(null);
        } catch (error) {
            toast.error("Failed to save transaction")
            // toast({
            //     title: "Error",
            //     description: "Failed to save transaction",
            //     variant: "destructive",
            // });
        }
    };

    const handleEditTransaction = (transaction: any) => {
        setEditingTransaction(transaction);
        setDialogOpen(true);
    };

    const handleDeleteTransaction = async (id: string | number) => {
        try {
            await deleteTransaction(id);
            toast.success("Transaction deleted successfully")
            // toast({
            //     title: "Success",
            //     description: "Transaction deleted successfully",
            // });
        } catch (error) {
            toast.error("Failed to delete transaction")
            // toast({
            //     title: "Error",
            //     description: "Failed to delete transaction",
            //     variant: "destructive",
            // });
        }
    };

    const handleExport = () => {
        if (!transactions?.results) return;

        const headers = ['Date', 'Name', 'Category', 'Type', 'Amount'];
        const rows = transactions.results.map(t => [
            t.date,
            t.name,
            t.category_name || t.category,
            t.type,
            t.amount
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions.csv';
        a.click();
    };

    const totalPages = transactions ? Math.ceil(transactions.count / 10) : 1;

    return (
        <SidebarProvider>
            <AppSidebar />
            <FinanceAssistant />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex items-center gap-2 flex-1">
                        <h1 className="text-xl font-semibold">Transactions</h1>
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleExport} disabled={isLoading}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        <Button size="sm" onClick={() => {
                            setEditingTransaction(null);
                            setDialogOpen(true);
                        }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Transaction
                        </Button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-7xl mx-auto">
                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {error} <Button onClick={() => fetchTransactions()} variant="link" className="p-0 h-auto">Try again</Button>
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid gap-6 lg:grid-cols-4">
                            <div className="lg:col-span-1">
                                <TransactionFilters
                                    onFilterChange={handleFilterChange}
                                    onReset={() => {
                                        setFilters({});
                                        fetchTransactions();
                                    }}
                                />
                            </div>

                            <div className="lg:col-span-3 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search transactions..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <Select value={sortBy} onValueChange={handleSort}>
                                        <SelectTrigger className="w-[180px]">
                                            <ArrowUpDown className="h-4 w-4 mr-2" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="date-desc">Date (Newest)</SelectItem>
                                            <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                                            <SelectItem value="amount-desc">Amount (High)</SelectItem>
                                            <SelectItem value="amount-asc">Amount (Low)</SelectItem>
                                            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                                            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {isLoading ? (
                                    <TableSkeleton rows={10} />
                                ) : (
                                    <>
                                        <TransactionTable
                                            transactions={transactions?.results || []}
                                            onEdit={handleEditTransaction}
                                            onDelete={handleDeleteTransaction}
                                        />

                                        {totalPages > 1 && (
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={setPage}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </SidebarInset>

            <TransactionDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                transaction={editingTransaction}
                onSave={handleSaveTransaction}
                categories={categories}
            />
        </SidebarProvider>
    );
}

