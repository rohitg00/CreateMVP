import { useUser } from "@/lib/userContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserProfile() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Not Logged In</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please log in to view your profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.profile.profileImageUrl || undefined} alt={user.username} />
          <AvatarFallback>{user.username?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user.username}</CardTitle>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {user.profile.bio && (
            <div>
              <p className="font-medium">Bio:</p>
              <p className="text-muted-foreground">{user.profile.bio}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
