import { cn } from "@/lib/utils";

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  name?: string;
}

interface UserLetterIconProps {
  user: User;
  className?: string;
}

export default function UserLetterIcon({ user, className }: UserLetterIconProps) {
  const getInitials = (user: User) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    }
    if (user.name) {
      const names = user.name.split(' ');
      return `${names[0]?.[0] || ''}${names[1]?.[0] || ''}`.toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const initials = getInitials(user);

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm",
        className
      )}
    >
      {initials}
    </div>
  );
}