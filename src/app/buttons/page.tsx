import { Button } from "@/components/ui/button"

const ButtonPage = () => {
  return(
    <div className="p-4 space-y-4 flex flex-col max-w-[200px]">
      <Button>primary</Button>
      <Button variant="primary">Click me</Button>
      <Button variant="primaryOutline">Click me</Button>
      <Button variant="secondary">Click me</Button>
      <Button variant="secondaryOutline">Click me</Button>
      <Button variant="danger">Click me</Button>
      <Button variant="dangerOutline">Click me</Button>
      <Button variant="super">Click me</Button>
      <Button variant="superOutline">Click me</Button>
      <Button variant="ghost">Click me</Button>
      <Button variant="sidebar">Click me</Button>
      <Button variant="sidebarOutline">Click me</Button>
    </div>

  )
}

export default ButtonPage
