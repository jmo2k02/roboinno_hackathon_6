import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

interface DialogProps {
    open: boolean;
    setOpen: () => void;
}

export function DialogDemo({open, setOpen}: DialogProps) {

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
           
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            
          </div>
        </div> */}
        <DialogFooter>
          <Button type="submit">Save changes</Button>
          <Button onClick={() => setOpen()}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
