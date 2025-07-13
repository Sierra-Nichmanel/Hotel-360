
import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLiveQuery } from "dexie-react-hooks";
import { db, User } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";

const Users = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const { user: currentUser } = useAuth();
  
  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"admin" | "manager" | "receptionist" | "housekeeping" | "maintenance">("receptionist");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Fetch users data
  const users = useLiveQuery(() => db.users.toArray());
  
  // Reset form
  const resetForm = () => {
    setUsername("");
    setPassword("");
    setName("");
    setRole("receptionist");
    setEmail("");
    setPhone("");
    setFormError("");
  };
  
  // Handle form submission
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password || !name || !role) {
      setFormError("Please fill in all required fields");
      return;
    }
    
    try {
      setIsCreating(true);
      
      // Check if username already exists
      const existingUser = await db.users.where('username').equals(username).first();
      if (existingUser) {
        setFormError("Username already exists");
        setIsCreating(false);
        return;
      }
      
      // Create new user
      const userId = await db.users.add({
        username,
        password, // In a real app, you would hash this
        name,
        role,
        email: email || undefined,
        phone: phone || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });
      
      // Create staff record if role isn't admin
      if (role !== "admin") {
        await db.staff.add({
          userId,
          department: getDepartmentFromRole(role),
          position: role.charAt(0).toUpperCase() + role.slice(1),
          hireDate: new Date(),
          salary: getSalaryForRole(role),
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      toast({
        title: "Success",
        description: `New ${role} account created`,
      });
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
      setFormError("Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };
  
  // Helper function to get department based on role
  const getDepartmentFromRole = (role: string): "management" | "front_desk" | "housekeeping" | "maintenance" | "restaurant" => {
    switch (role) {
      case "admin":
      case "manager":
        return "management";
      case "receptionist":
        return "front_desk";
      case "housekeeping":
        return "housekeeping";
      case "maintenance":
        return "maintenance";
      default:
        return "front_desk";
    }
  };
  
  // Helper function to get salary based on role
  const getSalaryForRole = (role: string): number => {
    switch (role) {
      case "admin":
        return 90000;
      case "manager":
        return 70000;
      case "receptionist":
        return 45000;
      case "housekeeping":
        return 40000;
      case "maintenance":
        return 42000;
      default:
        return 40000;
    }
  };
  
  // Determine if current user can manage users
  const canManageUsers = currentUser?.role === "admin" || currentUser?.role === "manager";
  
  // Handle user deletion
  const handleDeleteUser = async (userId: number | undefined) => {
    if (!userId) return;
    
    try {
      // Don't allow deleting yourself
      if (currentUser && userId.toString() === currentUser.id) {
        toast({
          title: "Error",
          description: "You cannot delete your own account",
          variant: "destructive",
        });
        return;
      }
      
      // Soft delete by setting isActive to false
      await db.users.update(userId, { 
        isActive: false,
        updatedAt: new Date()
      });
      
      // Find and update related staff record
      const staffRecord = await db.staff.where('userId').equals(userId).first();
      if (staffRecord?.id) {
        await db.staff.update(staffRecord.id, { 
          isActive: false,
          updatedAt: new Date()
        });
      }
      
      toast({
        title: "Success",
        description: "User deactivated successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate user",
        variant: "destructive",
      });
    }
  };
  
  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "receptionist":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "housekeeping":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "maintenance":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (!canManageUsers) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Access Restricted</h3>
              <p className="text-sm text-muted-foreground mt-2">
                You don't have permission to access the user management section.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system. They will be able to log in with the credentials you provide.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name*
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username*
                  </Label>
                  <Input
                    id="username"
                    className="col-span-3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password*
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="col-span-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role*
                  </Label>
                  <Select 
                    value={role} 
                    onValueChange={(value) => setRole(value as any)}
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Roles</SelectLabel>
                        {currentUser?.role === "admin" && (
                          <>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                          </>
                        )}
                        <SelectItem value="receptionist">Receptionist</SelectItem>
                        <SelectItem value="housekeeping">Housekeeping</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="col-span-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    className="col-span-3"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                {formError && (
                  <div className="text-sm text-red-500 mt-2">{formError}</div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create User
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>
            Manage all user accounts in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!users ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b bg-muted/50">
                <div className="col-span-3">Name</div>
                <div className="col-span-2">Username</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Last Login</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              <div className="divide-y">
                {users
                  .sort((a, b) => {
                    // Sort by role importance, then by name
                    const roleOrder = {
                      admin: 1,
                      manager: 2,
                      receptionist: 3,
                      housekeeping: 4,
                      maintenance: 5,
                    };
                    
                    const roleA = roleOrder[a.role as keyof typeof roleOrder];
                    const roleB = roleOrder[b.role as keyof typeof roleOrder];
                    
                    if (roleA !== roleB) {
                      return roleA - roleB;
                    }
                    
                    return a.name.localeCompare(b.name);
                  })
                  .map((user) => (
                    <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                      <div className="col-span-3 font-medium">{user.name}</div>
                      <div className="col-span-2 text-muted-foreground">{user.username}</div>
                      <div className="col-span-2">
                        <Badge className={getRoleBadgeColor(user.role)} variant="outline">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        {user.isActive ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="col-span-2 text-muted-foreground">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                      </div>
                      <div className="col-span-1 flex justify-end space-x-2">
                        {/* Only allow deleting if you're admin, or if you're manager and user is not admin */}
                        {(currentUser?.role === "admin" || (currentUser?.role === "manager" && user.role !== "admin")) && 
                          user.id && currentUser && user.id.toString() !== currentUser.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
                              title={user.isActive ? "Deactivate User" : "User Already Inactive"}
                              disabled={!user.isActive}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          )
                        }
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
