import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Button } from "@repo/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import { Badge } from "@repo/ui/components/badge";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import {
  Bell,
  CheckCircle,
  XCircle,
  Info,
  ArrowUpRight,
  Shield,
  UserPlus,
} from "lucide-react";
import {
  eventsAtom,
  eventsSidebarOpenAtom,
  unreadNotificationsAtom,
} from "@/store/events";
import { dayjs } from "@/lib/dayjs";

const getEventIcon = (type: string) => {
  switch (type) {
    case "transaction_created":
      return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    case "transaction_completed":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "transaction_rejected":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "approval_requested":
    case "approval_processed":
    case "user_role_updated":
      return <Shield className="w-4 h-4 text-blue-500" />;
    case "user_registered":
      return <UserPlus className="w-4 h-4 text-green-500" />;
    default:
      return <Info className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-800 border-green-200";
    case "error":
      return "bg-red-100 text-red-800 border-red-200";
    case "info":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function EventsSidebar() {
  const [events] = useAtom(eventsAtom);
  const [isOpen, setIsOpen] = useAtom(eventsSidebarOpenAtom);
  const [unreadCount] = useAtom(unreadNotificationsAtom);
  const resetEvents = useResetAtom(eventsAtom);
  const resetUnread = useResetAtom(unreadNotificationsAtom);

  // Reset unread count when sidebar opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      resetUnread();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Blockchain Events</span>
            <div className="flex items-center gap-2 mr-4">
              {events.length > -1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetEvents}
                  className="h-6 px-2 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full mt-4">
          <div className="space-y-3 pr-4">
            {events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No events yet</p>
                <p className="text-sm">Blockchain events will appear here</p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getEventIcon(event.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {event.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getStatusColor(event.status)}`}
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{dayjs(event.timestamp).fromNow()}</span>
                        <span className="font-mono">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
