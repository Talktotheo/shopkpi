import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PrinterIcon, LogOut, BarChart3, PlusCircle, FileSpreadsheet } from "lucide-react";
import { User } from "@shared/schema";

interface HeaderProps {
  selectedUserId: string;
  onUserChange: (userId: string) => void;
}

export function Header({ selectedUserId, onUserChange }: HeaderProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: user?.role === "admin",
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <PrinterIcon className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-gray-900">ShopKPI</h1>
          </div>

          <nav className="hidden md:flex space-x-1">
            <Link href="/">
              <Button
                variant={location === "/" ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/submit">
              <Button
                variant={location === "/submit" ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Submit KPIs
              </Button>
            </Link>
            {user?.role === 'admin' && (
              <Link href="/reports">
                <Button
                  variant={location === "/reports" ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Reports
                </Button>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Admin Controls */}
          {user?.role === "admin" && users && location === "/" && (
            <Select value={selectedUserId} onValueChange={onUserChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="👥 All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">👥 All Users</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id.toString()}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600">
              <span>{user?.name}</span>
              <Badge variant="secondary" className="ml-2">
                {user?.role === "admin" ? "Admin" : "User"}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
