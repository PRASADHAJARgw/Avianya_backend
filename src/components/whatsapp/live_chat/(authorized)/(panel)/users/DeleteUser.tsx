'use client'

import { Button } from "@/components/ui/button"
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import { useCallback, useState } from "react"
import { deleteUser } from "./actions"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react"

export default function DeleteUser({ userId, userName }: {userId: string, userName?: string}) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const { toast } = useToast()
    
    const handleUserDelete = useCallback(async () => {
        setIsDeleting(true)
        try {
            await deleteUser(userId)
            toast({
                title: "Success",
                description: "User deleted successfully",
            })
            setIsOpen(false)
            // Refresh the page by navigating to the same route
            navigate('/wa/users', { replace: true })
            setTimeout(() => window.location.reload(), 100)
        } catch (error) {
            console.error('Delete user error:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete user",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }, [userId, navigate, toast])

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete {userName ? `"${userName}"` : 'this user'}? 
                        This action cannot be undone and will permanently remove the user from the system.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleUserDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete User'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}