import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SubscriptionGuard } from "@/lib/subscription-guard";
import { Header } from "@/components/header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { Users, Plus, Mail, Trash2, Crown, UserPlus } from "lucide-react";
import { z } from "zod";

const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required").max(255, "Team name is too long"),
  description: z.string().optional(),
});

const inviteUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
});

type CreateTeamData = z.infer<typeof createTeamSchema>;
type InviteUserData = z.infer<typeof inviteUserSchema>;

export default function TeamManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showInviteUser, setShowInviteUser] = useState(false);

  const createTeamForm = useForm<CreateTeamData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const inviteUserForm = useForm<InviteUserData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  // Get user's team
  const { data: teamData, isLoading: teamLoading } = useQuery({
    queryKey: ["/api/team"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Get team members if user owns a team
  const { data: teamMembers, isLoading: membersLoading } = useQuery({
    queryKey: ["/api/team/members"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!teamData?.team && teamData.team.ownerId === user?.id,
  });

  // Create team mutation
  const createTeamMutation = useMutation({
    mutationFn: async (data: CreateTeamData) => {
      const response = await apiRequest("POST", "/api/team", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      setShowCreateTeam(false);
      createTeamForm.reset();
      toast({
        title: "Team Created",
        description: "Your team has been created successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Invite user mutation
  const inviteUserMutation = useMutation({
    mutationFn: async (data: InviteUserData) => {
      const response = await apiRequest("POST", "/api/team/invite", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team/members"] });
      setShowInviteUser(false);
      inviteUserForm.reset();
      toast({
        title: "Invitation Sent",
        description: "Team invitation has been sent successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest("DELETE", `/api/team/members/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team/members"] });
      toast({
        title: "Member Removed",
        description: "Team member has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onCreateTeam = (data: CreateTeamData) => {
    createTeamMutation.mutate(data);
  };

  const onInviteUser = (data: InviteUserData) => {
    inviteUserMutation.mutate(data);
  };

  const handleRemoveMember = (userId: number) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      removeMemberMutation.mutate(userId);
    }
  };

  if (teamLoading) {
    return (
      <SubscriptionGuard>
        <div className="min-h-screen bg-gray-50">
          <Header selectedUserId="" onUserChange={() => {}} />
          <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="text-center py-12">Loading...</div>
          </div>
        </div>
      </SubscriptionGuard>
    );
  }

  const isTeamOwner = teamData?.team && teamData.team.ownerId === user?.id;

  return (
    <SubscriptionGuard>
      <div className="min-h-screen bg-gray-50">
        <Header selectedUserId="" onUserChange={() => {}} />
        
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
            <p className="text-gray-600">
              Create and manage your team to collaborate on KPI tracking.
            </p>
          </div>

          {!teamData?.team ? (
            // No team - show create team option
            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-2xl">Create Your Team</CardTitle>
                <p className="text-gray-600">
                  Start collaborating by creating a team and inviting your colleagues.
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <Dialog open={showCreateTeam} onOpenChange={setShowCreateTeam}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-5 w-5 mr-2" />
                      Create Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Team</DialogTitle>
                    </DialogHeader>
                    <Form {...createTeamForm}>
                      <form onSubmit={createTeamForm.handleSubmit(onCreateTeam)} className="space-y-4">
                        <FormField
                          control={createTeamForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Team Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Print Shop Alpha" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={createTeamForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Brief description of your team..."
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowCreateTeam(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={createTeamMutation.isPending}
                            className="flex-1"
                          >
                            {createTeamMutation.isPending ? "Creating..." : "Create Team"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            // Has team - show team info and members
            <div className="space-y-6">
              {/* Team Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-6 w-6 text-blue-600" />
                        {teamData.team.name}
                        {isTeamOwner && <Crown className="h-5 w-5 text-yellow-500" />}
                      </CardTitle>
                      {teamData.team.description && (
                        <p className="text-gray-600 mt-2">{teamData.team.description}</p>
                      )}
                    </div>
                    {isTeamOwner && (
                      <Dialog open={showInviteUser} onOpenChange={setShowInviteUser}>
                        <DialogTrigger asChild>
                          <Button className="bg-green-600 hover:bg-green-700">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Invite Member
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invite Team Member</DialogTitle>
                          </DialogHeader>
                          <Form {...inviteUserForm}>
                            <form onSubmit={inviteUserForm.handleSubmit(onInviteUser)} className="space-y-4">
                              <FormField
                                control={inviteUserForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="email"
                                        placeholder="colleague@example.com" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={inviteUserForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex gap-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setShowInviteUser(false)}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  disabled={inviteUserMutation.isPending}
                                  className="flex-1"
                                >
                                  {inviteUserMutation.isPending ? "Sending..." : "Send Invitation"}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardHeader>
              </Card>

              {/* Team Members */}
              {isTeamOwner && (
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {membersLoading ? (
                      <div className="text-center py-6">Loading members...</div>
                    ) : teamMembers?.members?.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {teamMembers.members.map((member: any) => (
                            <TableRow key={member.id}>
                              <TableCell className="font-medium">{member.name}</TableCell>
                              <TableCell>{member.email}</TableCell>
                              <TableCell>
                                {member.id === teamData.team.ownerId ? (
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Owner
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">Member</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  className={
                                    member.inviteStatus === 'accepted' 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-yellow-100 text-yellow-800"
                                  }
                                >
                                  {member.inviteStatus || 'active'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {member.id !== teamData.team.ownerId && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        No team members yet. Invite someone to get started!
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </SubscriptionGuard>
  );
}