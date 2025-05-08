
import { ModeToggle } from "../mode-toggle";

export function NavBar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center space-x-4">
        <ModeToggle />
      </div>
    </nav>
  );
}
