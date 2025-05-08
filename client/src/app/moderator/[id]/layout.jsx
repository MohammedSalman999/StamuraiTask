// 'use client';

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Clipboard, BookX, BookCheck } from "lucide-react";
// import { ModeToggle } from "@/components/mode-toggle";
// import { AppSidebar } from "@/components/sidebar/app-sidebar";

// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarContent,
//   SidebarTrigger,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarMenuButton,
// } from "@/components/ui/sidebar";

// import {
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
// } from "@/components/ui/tooltip";

// export default function ModeratorLayout({ children }) {
//   const [showModeratorTasks, setShowModeratorTasks] = useState(false);
//   const pathname = usePathname();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   useEffect(() => {
//     setShowModeratorTasks(
//       pathname.includes("complete") || pathname.includes("cancelled") || pathname.includes("assign")
//     );
//   }, [pathname]);

//   return (
//     <SidebarProvider>
//       <AppSidebar>
//         <SidebarContent>
//           {showModeratorTasks && user && (
//             <SidebarGroup>
//               <SidebarGroupLabel>Moderator Tasks</SidebarGroupLabel>

//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <SidebarMenuButton className="hover:bg-blue-400" asChild>
//                     <Link
//                       className="w-full flex items-center"
//                       href={`/moderator/assign`}
//                     >
//                       <Clipboard className="text-blue-600" />
//                       <span>Assign Tasks</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </TooltipTrigger>
//                 <TooltipContent side="right">
//                   <span>Assign Tasks</span>
//                 </TooltipContent>
//               </Tooltip>
//             </SidebarGroup>
//           )}

//           <SidebarGroup>
//             <SidebarGroupLabel>View Tasks</SidebarGroupLabel>

//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <SidebarMenuButton className="hover:bg-green-400" asChild>
//                   <Link className="w-full flex items-center" href={`/moderator/complete`}>
//                     <BookCheck className="text-green-600" />
//                     <span>Completed Tasks</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </TooltipTrigger>
//               <TooltipContent side="right">
//                 <span>Completed Tasks</span>
//               </TooltipContent>
//             </Tooltip>

//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <SidebarMenuButton className="hover:bg-orange-400" asChild>
//                   <Link className="w-full flex items-center" href={`/moderator/cancelled`}>
//                     <BookX className="text-orange-600 h-6 w-6" />
//                     <span>Cancelled Tasks</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </TooltipTrigger>
//               <TooltipContent side="right">
//                 <span>Cancelled Tasks</span>
//               </TooltipContent>
//             </Tooltip>
//           </SidebarGroup>
//         </SidebarContent>
//       </AppSidebar>

//       <SidebarInset>
//         <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
//           <header className="mx-3 mt-2 rounded-lg border-b bg-white dark:bg-gray-800 shadow-sm">
//             <div className="flex h-12 items-center px-4">
//               <SidebarTrigger className="mr-2" />
//               <div className="ml-auto flex items-center space-x-4">
//                 <ModeToggle />
//               </div>
//             </div>
//           </header>

//           <main className="flex-1 space-y-5 p-3">{children}</main>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

// // app/moderator/[id]/layout.jsx

// // 'use client';

// // import { useEffect, useState } from 'react';
// // import Link from 'next/link';
// // import { usePathname } from 'next/navigation';
// // import { Clipboard, BookCheck, BookX } from 'lucide-react';
// // import { SidebarProvider, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
// // import { AppSidebar } from '@/components/sidebar/app-sidebar';
// // import { ModeToggle } from '@/components/mode-toggle';
// // import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
// // import { SidebarInset } from '@/components/ui/sidebar';

// // export default function ModeratorLayout({ children }) {
// //   const pathname = usePathname();
// //   const [user, setUser] = useState(null);

// //   useEffect(() => {
// //     const storedUser = localStorage.getItem("user");
// //     if (storedUser) {
// //       setUser(JSON.parse(storedUser));
// //     }
// //   }, []);

// //   return (
// //     <SidebarProvider>
// //       <AppSidebar>
// //         <SidebarContent>
// //           <SidebarGroup>
// //             <SidebarGroupLabel>Moderator Tasks</SidebarGroupLabel>

// //             <Tooltip>
// //               <TooltipTrigger asChild>
// //                 <SidebarMenuButton asChild>
// //                   <Link href={`/moderator/${user.id}/assign`} className="flex items-center gap-2">
// //                     <Clipboard className="text-blue-600" />
// //                     <span>Assign Tasks</span>
// //                   </Link>
// //                 </SidebarMenuButton>
// //               </TooltipTrigger>
// //               <TooltipContent side="right">Assign Tasks</TooltipContent>
// //             </Tooltip>

// //             <Tooltip>
// //               <TooltipTrigger asChild>
// //                 <SidebarMenuButton asChild>
// //                   <Link href={`/moderator/${user.id}/complete`} className="flex items-center gap-2">
// //                     <BookCheck className="text-green-600" />
// //                     <span>Completed Tasks</span>
// //                   </Link>
// //                 </SidebarMenuButton>
// //               </TooltipTrigger>
// //               <TooltipContent side="right">Completed Tasks</TooltipContent>
// //             </Tooltip>

// //             <Tooltip>
// //               <TooltipTrigger asChild>
// //                 <SidebarMenuButton asChild>
// //                   <Link href={`/moderator/${user.id}/canselled`} className="flex items-center gap-2">
// //                     <BookX className="text-orange-600" />
// //                     <span>Cancelled Tasks</span>
// //                   </Link>
// //                 </SidebarMenuButton>
// //               </TooltipTrigger>
// //               <TooltipContent side="right">Cancelled Tasks</TooltipContent>
// //             </Tooltip>
// //           </SidebarGroup>
// //         </SidebarContent>
// //       </AppSidebar>

// //       <SidebarInset>
// //         <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
// //           <header className="mx-3 mt-2 rounded-lg border-b bg-white dark:bg-gray-800 shadow-sm">
// //             <div className="flex h-12 items-center px-4">
// //               <SidebarTrigger className="mr-2" />
// //               <div className="ml-auto flex items-center space-x-4">
// //                 <ModeToggle />
// //               </div>
// //             </div>
// //           </header>

// //           <main className="flex-1 space-y-5 p-3">
// //             {children}
// //           </main>
// //         </div>
// //       </SidebarInset>
// //     </SidebarProvider>
// //   );
// // }

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clipboard, BookCheck, BookX } from 'lucide-react'
import {
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export default function ModeratorLayout({ children }) {
  const pathname = usePathname()
  const [user, setUser] = useState(null)

  // Extract the ID from the current path
  const id = pathname?.split('/')[2] // /moderator/[id]/assign => split and get [id]

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Moderator Tasks</SidebarGroupLabel>

            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton asChild>
                  <Link href={`/moderator/${id}/assign`} className="flex items-center gap-2">
                    <Clipboard className="text-blue-600" />
                    <span>Assign Tasks</span>
                  </Link>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right">Assign Tasks</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton asChild>
                  <Link href={`/moderator/${id}/complete`} className="flex items-center gap-2">
                    <BookCheck className="text-green-600" />
                    <span>Completed Tasks</span>
                  </Link>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right">Completed Tasks</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton asChild>
                  <Link href={`/moderator/${id}/cancelled`} className="flex items-center gap-2">
                    <BookX className="text-orange-600" />
                    <span>Cancelled Tasks</span>
                  </Link>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right">Cancelled Tasks</TooltipContent>
            </Tooltip>
          </SidebarGroup>
        </SidebarContent>
      </AppSidebar>

      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          <header className="mx-3 mt-2 rounded-lg border-b bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex h-12 items-center px-4">
              <SidebarTrigger className="mr-2" />
              <div className="ml-auto flex items-center space-x-4">
                <ModeToggle />
              </div>
            </div>
          </header>

          <main className="flex-1 space-y-5 p-3">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
 