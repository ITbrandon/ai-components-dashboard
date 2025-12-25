import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, Building2, Briefcase, Mail, AlertCircle, CheckCircle2, Lightbulb, Loader2 } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { fetchFormSuggestions, validateFormWithAI } from "../../lib/mockAI";
import { cn } from "../../lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  isLoadingSuggestions: boolean;
  placeholder: string;
}

function FormField({
  id,
  label,
  icon,
  value,
  onChange,
  suggestions,
  isLoadingSuggestions,
  placeholder,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            // Delay hiding to allow click on suggestion
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder={placeholder}
          className={cn(
            "transition-all",
            isFocused && "ring-2 ring-primary/50 border-primary/50"
          )}
        />
        
        {/* AI Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (suggestions.length > 0 || isLoadingSuggestions) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="absolute z-10 w-full mt-1 overflow-hidden shadow-lg">
                <CardHeader className="px-3 py-2 border-b border-border bg-secondary/30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-xs text-muted-foreground">AI Suggestions</span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoadingSuggestions ? (
                    <div className="px-3 py-3 flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Getting suggestions...</span>
                    </div>
                  ) : (
                    <div className="py-1">
                      {suggestions.map((suggestion, i) => (
                        <Button
                          key={suggestion}
                          variant="ghost"
                          className="w-full justify-start px-3 py-2 h-auto text-sm font-normal"
                          onClick={() => {
                            onChange(suggestion);
                            setShowSuggestions(false);
                          }}
                        >
                          <span className="text-muted-foreground mr-2">{i + 1}.</span>
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function AIFormAssistant() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
  });
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const [loadingField, setLoadingField] = useState<string | null>(null);
  const [validation, setValidation] = useState<{
    isValid: boolean;
    warnings: string[];
    tips: string[];
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const loadSuggestions = useCallback(async (field: string, value: string) => {
    setLoadingField(field);
    try {
      const fieldSuggestions = await fetchFormSuggestions(field, value);
      setSuggestions((prev) => ({ ...prev, [field]: fieldSuggestions }));
    } finally {
      setLoadingField(null);
    }
  }, []);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    loadSuggestions(field, value);
    // Clear validation when form changes
    setValidation(null);
  };

  const handleValidate = async () => {
    setIsValidating(true);
    setFormStatus("loading");
    try {
      const result = await validateFormWithAI(formData);
      setValidation(result);
      setFormStatus(result.isValid ? "success" : "error");
    } catch {
      setFormStatus("error");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleValidate();
  };

  // Load initial suggestions
  useEffect(() => {
    Object.keys(formData).forEach((field) => {
      loadSuggestions(field, "");
    });
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-ai">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-sm">AI Form Assistant</CardTitle>
              <CardDescription className="text-xs">Smart autofill & validation</CardDescription>
            </div>
          </div>
          <StatusBadge status={formStatus} />
        </CardHeader>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Card>
          <CardContent className="p-6 space-y-5">
            <FormField
              id="name"
              label="Full Name"
              icon={<User className="w-4 h-4 text-muted-foreground" />}
              value={formData.name}
              onChange={(value) => handleFieldChange("name", value)}
              suggestions={suggestions.name || []}
              isLoadingSuggestions={loadingField === "name"}
              placeholder="Enter your name"
            />

            <FormField
              id="email"
              label="Email Address"
              icon={<Mail className="w-4 h-4 text-muted-foreground" />}
              value={formData.email}
              onChange={(value) => handleFieldChange("email", value)}
              suggestions={suggestions.email || []}
              isLoadingSuggestions={loadingField === "email"}
              placeholder="your@email.com"
            />

            <FormField
              id="company"
              label="Company"
              icon={<Building2 className="w-4 h-4 text-muted-foreground" />}
              value={formData.company}
              onChange={(value) => handleFieldChange("company", value)}
              suggestions={suggestions.company || []}
              isLoadingSuggestions={loadingField === "company"}
              placeholder="Company name"
            />

            <FormField
              id="role"
              label="Role"
              icon={<Briefcase className="w-4 h-4 text-muted-foreground" />}
              value={formData.role}
              onChange={(value) => handleFieldChange("role", value)}
              suggestions={suggestions.role || []}
              isLoadingSuggestions={loadingField === "role"}
              placeholder="Your role"
            />
          </CardContent>
        </Card>

        {/* Validation Results */}
        <AnimatePresence>
          {validation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {/* Warnings */}
              {validation.warnings.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="space-y-1">
                    {validation.warnings.map((warning, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {warning}
                      </motion.div>
                    ))}
                  </AlertDescription>
                </Alert>
              )}

              {/* Tips */}
              {validation.tips.length > 0 && (
                <Alert className="border-accent/50 bg-accent/10">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  <AlertDescription className="text-accent space-y-1">
                    {validation.tips.map((tip, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {tip}
                      </motion.div>
                    ))}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success */}
              {validation.isValid && (
                <Alert className="border-success/50 bg-success/10">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    All fields validated successfully
                  </AlertDescription>
                </Alert>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isValidating}
          className="w-full gradient-ai text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {isValidating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Validating with AI...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Validate & Submit
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
