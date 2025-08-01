"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { auth, db } from "@/firebase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  User,
  Mail,
  MessageSquare,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";
import { Bug, Sparkles, MessageCircle } from "lucide-react";
// Schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  type: z.enum(["Bug Report", "Feature Request", "General Feedback"], {
    required_error: "Please select a feedback type",
  }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(1000),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      type: undefined,
      message: "",
    },
  });

  // Load Firebase user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        form.setValue("name", firebaseUser.displayName || "Anonymous");
        form.setValue("email", firebaseUser.email || "");
      }
    });
    return () => unsubscribe();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "feedback"), {
        ...values,
        createdAt: new Date(),
      });
      toast.success("Thanks for your feedback! 🙌");
      form.reset({ ...values, message: "" });
    } catch (error) {
      console.error("Feedback error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #808080 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #808080 0%, transparent 50%)`,
            backgroundSize: "400px 400px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 pt-20 pb-16 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            We'd love to hear from you. Send us your feedback, questions, or
            just say hello.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-300" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-300" />
              <span>hello@company.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-300" />
              <span>Mon-Fri 9AM-6PM</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Feedback Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="backdrop-blur-xl bg-white/5 p-8 md:p-10 rounded-3xl border border-gray-700 shadow-2xl hover:bg-gray-800/10 transition-all duration-300"
            >
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3 text-white">
                  <div className="p-2 bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  Send Feedback
                </h2>
                <p className="text-gray-300 text-lg">
                  Your thoughts help us improve. We read every message.
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 flex items-center gap-2 text-sm font-medium">
                            <User className="w-4 h-4 text-gray-300" /> Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              readOnly
                              className="bg-white/5 border-gray-700 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 transition-all duration-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 flex items-center gap-2 text-sm font-medium">
                            <Mail className="w-4 h-4 text-gray-300" /> Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              readOnly
                              className="bg-white/5 border-gray-700 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 transition-all duration-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 text-sm font-medium">
                          Feedback Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-gray-700 text-white h-12 rounded-xl focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 transition-all duration-200">
                              <SelectValue placeholder="Select feedback type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem
                              value="Bug Report"
                              className="text-white hover:bg-gray-700 flex items-center gap-2"
                            >
                              <Bug className="w-4 h-4 text-red-400" />
                              Bug Report
                            </SelectItem>

                            <SelectItem
                              value="Feature Request"
                              className="text-white hover:bg-gray-700 flex items-center gap-2"
                            >
                              <Sparkles className="w-4 h-4 text-yellow-400" />
                              Feature Request
                            </SelectItem>

                            <SelectItem
                              value="General Feedback"
                              className="text-white hover:bg-gray-700 flex items-center gap-2"
                            >
                              <MessageCircle className="w-4 h-4 text-blue-400" />
                              General Feedback
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2 text-sm font-medium">
                          <MessageSquare className="w-4 h-4 text-gray-300" />{" "}
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Tell us what's on your mind..."
                            className="bg-white/5 border-gray-700 text-white placeholder:text-gray-500 min-h-[140px] resize-none rounded-xl focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Submit Feedback
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>

            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-6"
            >
              {/* Location Info */}
              <div className="backdrop-blur-xl bg-white/5 p-6 rounded-3xl border border-gray-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-white">
                  <div className="p-2 bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.37 0 0 5.373 0 12a12 12 0 008.21 11.432c.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.613-4.042-1.613-.546-1.388-1.333-1.757-1.333-1.757-1.09-.745.082-.73.082-.73 1.204.085 1.837 1.236 1.837 1.236 1.07 1.834 2.808 1.304 3.492.997.107-.775.42-1.305.763-1.605-2.665-.305-5.467-1.335-5.467-5.933 0-1.31.47-2.38 1.235-3.22-.124-.303-.535-1.527.117-3.18 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 016 0c2.29-1.552 3.297-1.23 3.297-1.23.654 1.653.243 2.877.12 3.18.768.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.922.432.373.816 1.104.816 2.227 0 1.608-.015 2.908-.015 3.304 0 .32.216.694.825.576A12.001 12.001 0 0024 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  Contribute on GitHub
                </h3>

                <p className="text-gray-300 mb-4">
                  Help us improve by contributing to our open-source repository.
                  Your ideas and fixes are welcome!
                </p>

                <a
                  href="https://github.com/AHAPRX/interviewer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Go to GitHub Repo
                </a>
              </div>
              {/* Map */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-700 bg-white/5 backdrop-blur-xl">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019288187034!2d-122.41941568468195!3d37.77492977975914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c5ae4c0b3%3A0x9a6c6c6a56cb510!2sSan+Francisco!5e0!3m2!1sen!2sus!4v1719999999999"
                  width="100%"
                  height="400"
                  className="w-full filter grayscale"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
