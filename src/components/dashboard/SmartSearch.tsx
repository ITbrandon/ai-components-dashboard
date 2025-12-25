import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, X, ArrowRight, Download, FileText, Bell, Users, Calendar, Mail, Loader2, RefreshCw } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ShimmerLoader, ShimmerPill } from "../../components/ui/ShimmerLoader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAISearch } from "../../hooks/useAISearch";
import { cn } from "../../lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  download: Download,
  "file-text": FileText,
  bell: Bell,
  users: Users,
  calendar: Calendar,
  mail: Mail,
  sparkles: Sparkles,
};

export function SmartSearch() {
  const { query, results, status, error, search, retry, clear } = useAISearch();
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      search(value);
    }, 500);
  };

  const handleClear = () => {
    setInputValue("");
    clear();
    inputRef.current?.focus();
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const isActive = isFocused || inputValue.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Header */}
      <Card className="mb-4">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-ai">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-sm">AI Smart Search</CardTitle>
              <CardDescription className="text-xs">Search with intelligent suggestions</CardDescription>
            </div>
          </div>
          <StatusBadge status={status} />
        </CardHeader>
        <CardContent className="pt-0">
          {/* Search Input */}
          <motion.div
            className={cn(
              "relative rounded-xl border transition-all duration-300",
              isActive 
                ? "border-primary/50 glow-primary bg-card" 
                : "border-border bg-secondary/30"
            )}
            animate={{
              boxShadow: isActive ? "0 0 30px hsl(var(--primary) / 0.15)" : "none",
            }}
          >
            <div className="flex items-center px-4 py-3">
              <Search className={cn(
                "w-5 h-5 mr-3 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search anything... AI will suggest filters and actions"
                className="border-0 bg-transparent p-0 focus-visible:ring-0 placeholder:text-muted-foreground/60"
              />
              <AnimatePresence>
                {inputValue && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={handleClear}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              {status === "loading" && (
                <Loader2 className="w-5 h-5 text-primary animate-spin ml-2" />
              )}
            </div>

            {/* Results Panel */}
            <AnimatePresence>
              {(status === "loading" || results || error) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-border overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    {/* Loading State */}
                    {status === "loading" && (
                      <div className="space-y-4">
                        <ShimmerLoader lines={2} />
                        <div className="flex gap-2">
                          <ShimmerPill />
                          <ShimmerPill />
                          <ShimmerPill />
                        </div>
                      </div>
                    )}

                    {/* Error State */}
                    {status === "error" && error && (
                      <Alert variant="destructive">
                        <AlertDescription className="flex items-center justify-between">
                          <span>{error}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={retry}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Success State */}
                    {status === "success" && results && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        {/* AI Summary */}
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 rounded-md bg-primary/10">
                            <Sparkles className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            {results.content}
                          </p>
                        </div>

                        {/* Suggested Filters */}
                        {results.filters && results.filters.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Suggested Filters
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {results.filters.map((filter, i) => (
                                <motion.div
                                  key={filter.value}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                >
                                  <Badge
                                    variant="outline"
                                    className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors"
                                  >
                                    {filter.label}
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quick Actions */}
                        {results.actions && results.actions.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Quick Actions
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {results.actions.map((action, i) => {
                                const Icon = iconMap[action.icon] || Sparkles;
                                return (
                                  <motion.div
                                    key={action.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.05 }}
                                  >
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      className="group"
                                    >
                                      <Icon className="w-4 h-4 mr-2" />
                                      {action.label}
                                      <ArrowRight className="w-3 h-3 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Button>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Example Queries */}
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Try:</span>
            {["analytics trends", "user behavior", "sales report"].map((example) => (
              <Button
                key={example}
                variant="ghost"
                size="sm"
                onClick={() => handleInputChange(example)}
                className="h-auto px-2 py-1 text-xs"
              >
                {example}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
