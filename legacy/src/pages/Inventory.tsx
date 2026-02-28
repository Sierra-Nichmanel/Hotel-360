
import { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Boxes, 
  PackageOpen, 
  AlertTriangle,
  ArrowUpDown,
  ArrowDown,
  ArrowUp
} from "lucide-react";
import { useBreakpoint } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { db, InventoryItem } from "@/lib/db";
import { toast } from "sonner";

const inventoryCategories = [
  "Linens", 
  "Toiletries", 
  "Cleaning Supplies", 
  "Food & Beverage", 
  "Office Supplies", 
  "Maintenance"
];

// Inventory location options
const inventoryLocations = [
  "Main Storage",
  "Housekeeping Closet - 1st Floor",
  "Housekeeping Closet - 2nd Floor",
  "Housekeeping Closet - 3rd Floor",
  "Kitchen Storage",
  "Maintenance Shop",
  "Front Desk"
];

// Initial form values
const initialFormValues = {
  name: "",
  category: "",
  description: "",
  unit: "",
  quantity: 0,
  minQuantity: 0,
  cost: 0,
  location: "",
  supplier: ""
};

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: 'asc' | 'desc' } | null>(null);
  
  const breakpoint = useBreakpoint();
  const isTabletOrMobile = breakpoint === "mobile" || breakpoint === "tablet";

  // Fetch inventory data using React Query
  const { data: inventoryItems = [], isLoading, refetch } = useQuery({
    queryKey: ['inventoryItems'],
    queryFn: async () => {
      return await db.inventoryItems.toArray();
    }
  });

  // Calculate inventory statistics
  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.minQuantity).length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
  const categoryCount = inventoryItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostCommonCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: name === 'quantity' || name === 'minQuantity' || name === 'cost' 
        ? parseFloat(value) 
        : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.inventoryItems.add({
        ...formValues,
        lastRestockedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast.success("Inventory item added successfully!");
      setFormValues(initialFormValues);
      setShowAddItemDialog(false);
      refetch();
    } catch (error) {
      console.error("Error adding inventory item:", error);
      toast.error("Failed to add inventory item");
    }
  };

  // Handle sorting
  const requestSort = (key: keyof InventoryItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting and filtering
  const getSortedItems = () => {
    let filteredItems = [...inventoryItems];
    
    // Apply search filter
    if (searchTerm) {
      filteredItems = filteredItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (activeTab === "low-stock") {
      filteredItems = filteredItems.filter(item => item.quantity <= item.minQuantity);
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredItems;
  };

  const sortedItems = getSortedItems();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage hotel supplies and inventory.</p>
        </div>
        
        <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
                <DialogDescription>
                  Add a new item to track in your inventory system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formValues.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      name="category" 
                      value={formValues.category}
                      onValueChange={(value) => setFormValues({...formValues, category: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={formValues.description || ""}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input 
                      id="unit" 
                      name="unit"
                      value={formValues.unit}
                      onChange={handleInputChange}
                      placeholder="Each, Box, etc."
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input 
                      id="quantity" 
                      name="quantity"
                      type="number"
                      min="0"
                      value={formValues.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minQuantity">Minimum Quantity</Label>
                    <Input 
                      id="minQuantity" 
                      name="minQuantity"
                      type="number"
                      min="0"
                      value={formValues.minQuantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cost">Cost per Unit ($)</Label>
                    <Input 
                      id="cost" 
                      name="cost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formValues.cost}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Storage Location</Label>
                    <Select 
                      name="location" 
                      value={formValues.location || ""}
                      onValueChange={(value) => setFormValues({...formValues, location: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryLocations.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input 
                    id="supplier" 
                    name="supplier"
                    value={formValues.supplier || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddItemDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Item
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Items"
          value={totalItems}
          icon={Boxes}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockItems}
          description="Items below minimum quantity"
          icon={AlertTriangle}
          trend={lowStockItems > 0 ? { value: lowStockItems, label: "needs attention", positive: false } : undefined}
        />
        <StatCard
          title="Total Inventory Value"
          value={`$${totalValue.toFixed(2)}`}
          icon={PackageOpen}
        />
        <StatCard
          title="Most Common Category"
          value={mostCommonCategory}
          description={`${categoryCount[mostCommonCategory] || 0} items`}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1"></div>
        <Button variant="outline" size="sm" className="h-9">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="all" className="flex-1 sm:flex-none">All Items</TabsTrigger>
          <TabsTrigger value="low-stock" className="flex-1 sm:flex-none">Low Stock</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading inventory items...</p>
            </div>
          ) : (
            <>
              {isTabletOrMobile ? (
                <div className="space-y-4">
                  {sortedItems.map((item) => (
                    <Card key={item.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription>
                              <Badge variant="outline" className="mr-2">{item.category}</Badge>
                              {item.quantity <= item.minQuantity && (
                                <Badge variant="destructive">Low Stock</Badge>
                              )}
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Edit Item</DropdownMenuItem>
                              <DropdownMenuItem>Add Stock</DropdownMenuItem>
                              <DropdownMenuItem>Remove Stock</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete Item</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {item.description && <p className="text-muted-foreground">{item.description}</p>}
                          <div className="flex flex-col space-y-1">
                            <div className="flex justify-between">
                              <span>Quantity:</span>
                              <span className="font-medium">{item.quantity} {item.unit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Min Quantity:</span>
                              <span className="font-medium">{item.minQuantity} {item.unit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Unit Cost:</span>
                              <span className="font-medium">${item.cost.toFixed(2)}</span>
                            </div>
                            {item.location && (
                              <div className="flex justify-between">
                                <span>Location:</span>
                                <span className="font-medium">{item.location}</span>
                              </div>
                            )}
                            {item.supplier && (
                              <div className="flex justify-between">
                                <span>Supplier:</span>
                                <span className="font-medium">{item.supplier}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Value:</span>
                              <span className="font-medium">${(item.quantity * item.cost).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {sortedItems.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No inventory items found</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">
                          <div className="flex items-center cursor-pointer" onClick={() => requestSort('name')}>
                            Name
                            {sortConfig?.key === 'name' ? (
                              sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                            ) : <ArrowUpDown className="ml-1 h-4 w-4" />}
                          </div>
                        </TableHead>
                        <TableHead className="w-[150px]">
                          <div className="flex items-center cursor-pointer" onClick={() => requestSort('category')}>
                            Category
                            {sortConfig?.key === 'category' ? (
                              sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                            ) : <ArrowUpDown className="ml-1 h-4 w-4" />}
                          </div>
                        </TableHead>
                        <TableHead className="text-right w-[100px]">
                          <div className="flex items-center justify-end cursor-pointer" onClick={() => requestSort('quantity')}>
                            Quantity
                            {sortConfig?.key === 'quantity' ? (
                              sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                            ) : <ArrowUpDown className="ml-1 h-4 w-4" />}
                          </div>
                        </TableHead>
                        <TableHead className="text-right w-[100px]">
                          <div className="flex items-center justify-end cursor-pointer" onClick={() => requestSort('minQuantity')}>
                            Min Qty
                            {sortConfig?.key === 'minQuantity' ? (
                              sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                            ) : <ArrowUpDown className="ml-1 h-4 w-4" />}
                          </div>
                        </TableHead>
                        <TableHead className="w-[130px]">Unit</TableHead>
                        <TableHead className="text-right w-[100px]">
                          <div className="flex items-center justify-end cursor-pointer" onClick={() => requestSort('cost')}>
                            Unit Cost
                            {sortConfig?.key === 'cost' ? (
                              sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                            ) : <ArrowUpDown className="ml-1 h-4 w-4" />}
                          </div>
                        </TableHead>
                        <TableHead className="text-right w-[100px]">Value</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div>
                              {item.name}
                              {item.quantity <= item.minQuantity && (
                                <Badge variant="destructive" className="ml-2">Low</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{item.minQuantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">${(item.quantity * item.cost).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit Item</DropdownMenuItem>
                                <DropdownMenuItem>Add Stock</DropdownMenuItem>
                                <DropdownMenuItem>Remove Stock</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {sortedItems.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No inventory items found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="low-stock" className="mt-4">
          {/* Same as above but only for low stock items - content auto-filtered with the getSortedItems() function */}
          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading inventory items...</p>
            </div>
          ) : (
            <>
              {sortedItems.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No low stock items found</p>
                </div>
              ) : (
                isTabletOrMobile ? (
                  <div className="space-y-4">
                    {/* Same mobile cards view as above */}
                    {sortedItems.map((item) => (
                      <Card key={item.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div>
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <CardDescription>
                                <Badge variant="outline" className="mr-2">{item.category}</Badge>
                                <Badge variant="destructive">Low Stock</Badge>
                              </CardDescription>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Edit Item</DropdownMenuItem>
                                <DropdownMenuItem>Add Stock</DropdownMenuItem>
                                <DropdownMenuItem>Remove Stock</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Delete Item</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            {item.description && <p className="text-muted-foreground">{item.description}</p>}
                            <div className="flex flex-col space-y-1">
                              <div className="flex justify-between">
                                <span>Quantity:</span>
                                <span className="font-medium">{item.quantity} {item.unit}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Min Quantity:</span>
                                <span className="font-medium">{item.minQuantity} {item.unit}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Unit Cost:</span>
                                <span className="font-medium">${item.cost.toFixed(2)}</span>
                              </div>
                              {item.location && (
                                <div className="flex justify-between">
                                  <span>Location:</span>
                                  <span className="font-medium">{item.location}</span>
                                </div>
                              )}
                              {item.supplier && (
                                <div className="flex justify-between">
                                  <span>Supplier:</span>
                                  <span className="font-medium">{item.supplier}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Value:</span>
                                <span className="font-medium">${(item.quantity * item.cost).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">
                            <div className="flex items-center cursor-pointer" onClick={() => requestSort('name')}>
                              Name
                              {sortConfig?.key === 'name' ? (
                                sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                              ) : <ArrowUpDown className="ml-1 h-4 w-4" />}
                            </div>
                          </TableHead>
                          <TableHead className="w-[150px]">
                            <div className="flex items-center cursor-pointer" onClick={() => requestSort('category')}>
                              Category
                              {sortConfig?.key === 'category' ? (
                                sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                              ) : <ArrowUpDown className="ml-1 h-4 w-4" />}
                            </div>
                          </TableHead>
                          <TableHead className="text-right w-[100px]">
                            <div className="flex items-center justify-end cursor-pointer" onClick={() => requestSort('quantity')}>
                              Quantity
                              {sortConfig?.key === 'quantity' ? (
                                sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                              ) : <ArrowUpDown className="ml-1 h-4 w-4" />}
                            </div>
                          </TableHead>
                          <TableHead className="text-right w-[100px]">
                            <div className="flex items-center justify-end cursor-pointer" onClick={() => requestSort('minQuantity')}>
                              Min Qty
                              {sortConfig?.key === 'minQuantity' ? (
                                sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                              ) : <ArrowUpDown className="ml-1 h-4 w-4" />}
                            </div>
                          </TableHead>
                          <TableHead className="w-[130px]">Unit</TableHead>
                          <TableHead className="text-right w-[100px]">
                            <div className="flex items-center justify-end cursor-pointer" onClick={() => requestSort('cost')}>
                              Unit Cost
                              {sortConfig?.key === 'cost' ? (
                                sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
                              ) : <ArrowUpDown className="ml-1 h-4 w-4" />}
                            </div>
                          </TableHead>
                          <TableHead className="text-right w-[100px]">Value</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              <div>
                                {item.name}
                                <Badge variant="destructive" className="ml-2">Low</Badge>
                              </div>
                            </TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{item.minQuantity}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-medium">${(item.quantity * item.cost).toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit Item</DropdownMenuItem>
                                  <DropdownMenuItem>Add Stock</DropdownMenuItem>
                                  <DropdownMenuItem>Remove Stock</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
