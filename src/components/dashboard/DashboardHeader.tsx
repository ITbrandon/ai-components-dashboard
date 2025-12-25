import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, BarChart3 } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

export function DashboardHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl gradient-ai flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                AI Dashboard
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                  Beta
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground">Powered by intelligent insights</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-warning" />
              <span className="text-muted-foreground">API:</span>
              <span className="font-medium text-success">Healthy</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Security:</span>
              <span className="font-medium text-foreground">Active</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">Analytics:</span>
              <span className="font-medium text-foreground">Live</span>
            </div>
          </div>

          {/* User Avatar */}
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-medium">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </motion.header>
  );
}
