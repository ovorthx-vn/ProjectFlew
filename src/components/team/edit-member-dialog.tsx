"use client"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Image from "next/image"

import type { User as UserType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ImageCropperDialog } from "./image-cropper-dialog"

const memberFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  availability: z.enum(["Available", "Busy", "On Vacation"]),
  avatar: z.string(),
})

type MemberFormValues = z.infer<typeof memberFormSchema>

interface EditMemberDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpdateMember: (data: UserType) => void
  user: UserType
}

export function EditMemberDialog({
  isOpen,
  onClose,
  onUpdateMember,
  user
}: EditMemberDialogProps) {
  const [imageToCrop, setImageToCrop] = React.useState<string | null>(null);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: user.name,
      role: user.role,
      availability: user.availability,
      avatar: user.avatar,
    },
  })
  
  React.useEffect(() => {
    form.reset({
      name: user.name,
      role: user.role,
      availability: user.availability,
      avatar: user.avatar,
    });
  }, [user, form]);


  function onSubmit(data: MemberFormValues) {
    onUpdateMember({ ...user, ...data });
    onClose();
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedImageUrl: string) => {
    form.setValue('avatar', croppedImageUrl);
    setImageToCrop(null);
  };

  const currentAvatar = form.watch('avatar');

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update the details for {user.name}.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Busy">Busy</SelectItem>
                        <SelectItem value="On Vacation">On Vacation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                          <AvatarImage src={currentAvatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <FormControl>
                          <Input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleAvatarChange} 
                              className="flex-1"
                          />
                      </FormControl>
                  </div>
                  <FormMessage />
              </FormItem>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {imageToCrop && (
        <ImageCropperDialog
          image={imageToCrop}
          onClose={() => setImageToCrop(null)}
          onSave={onCropComplete}
        />
      )}
    </>
  )
}
