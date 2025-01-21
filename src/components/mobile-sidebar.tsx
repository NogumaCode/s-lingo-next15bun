import { Menu } from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Sidebar } from "./sidebar"
import { Button } from "./ui/button"

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white" />
      </SheetTrigger>
      <SheetContent className="p-0 z-[100] bg-white" side="left">
      <SheetHeader>
      <SheetTitle></SheetTitle>
      <SheetDescription>
      </SheetDescription>
    </SheetHeader>
        <Sidebar />
        <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
      </SheetContent>
    </Sheet>
  )
}
