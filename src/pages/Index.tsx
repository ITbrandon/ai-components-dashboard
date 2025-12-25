import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { MetricsOverview } from "../components/dashboard/MetricsOverview";
import { SmartSearch } from "../components/dashboard/SmartSearch";
import { AIChatPanel } from "../components/dashboard/AIChatPanel";
import { AIFormAssistant } from "../components/dashboard/AIFormAssistant";
import { Search, MessageSquare, FileEdit, Sparkles } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <DashboardHeader />

      <main className="relative container mx-auto px-6 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, <span className="gradient-ai-text">John</span>
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your dashboard today.
          </p>
        </motion.div>

        {/* Metrics Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <MetricsOverview />
        </motion.section>

        {/* AI Components Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg gradient-ai">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">AI-Powered Components</h3>
              <p className="text-sm text-muted-foreground">
                Interactive widgets with intelligent features
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 bg-secondary/50 border border-border p-1">
              <TabsTrigger
                value="search"
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                <Search className="w-4 h-4" />
                Smart Search
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                <MessageSquare className="w-4 h-4" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger
                value="form"
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                <FileEdit className="w-4 h-4" />
                Form Assistant
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="mt-0">
              <motion.div
                key="search"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <SmartSearch />
              </motion.div>
            </TabsContent>

            <TabsContent value="chat" className="mt-0">
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <AIChatPanel />
              </motion.div>
            </TabsContent>

            <TabsContent value="form" className="mt-0">
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <AIFormAssistant />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.section>

        {/* Feature Highlights */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Streaming Responses",
              description: "Watch AI responses generate in real-time with smooth typing animations",
              gradient: "from-primary/20 to-primary/5",
            },
            {
              title: "Smart State Management",
              description: "Seamless transitions between idle, loading, success, and error states",
              gradient: "from-accent/20 to-accent/5",
            },
            {
              title: "Graceful Error Handling",
              description: "Automatic retry mechanisms and clear error feedback for reliability",
              gradient: "from-success/20 to-success/5",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`rounded-xl border border-border bg-gradient-to-br ${feature.gradient} p-6`}
            >
              <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-6 mt-12">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>AI Dashboard Demo • Built with React, TypeScript & Framer Motion</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
