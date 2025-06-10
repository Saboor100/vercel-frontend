import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, MessageSquare, Send, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { get, getDatabase, ref } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useTranslation } from "react-i18next";

// Example schema using zod
const formSchema = z.object({
  name: z.string().min(2, { message: "form.nameError" }),
  email: z.string().email({ message: "form.emailError" }),
  subject: z.string().min(5, { message: "form.subjectError" }),
  message: z.string().min(10, { message: "form.messageError" }),
});

type ContactFormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);

    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}/email`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        throw new Error(t("contacterrors.userNotFound"));
      }

      const userEmail = snapshot.val();

      const payload = {
        ...values,
        userEmail,
      };

      await fetch(
        "https://hook.us2.make.com/2lun7c4qi7kw6tngcu30rethfplgmbjz",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      toast.success(t("toast.successTitle"), {
        description: t("toast.successDescription"),
      });

      form.reset();
    } catch (error) {
      console.error("Error:", error);
      toast.error(t("toast.errorTitle"), {
        description: t("toast.errorDescription"),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="mb-4 text-[#E67912]  hover:bg-[#f19239] text-black border-[#E67912]"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("contactbuttons.backToHome")}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{t("titles.contactUs")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("contactPage.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.name")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.namePlaceholder")}
                          {...field}
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
                      <FormLabel>{t("form.email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.emailPlaceholder")}
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.subject")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.subjectPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.message")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("form.messagePlaceholder")}
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full text-[#E67912] bg-[#E67912] hover:bg-[#f19239] text-white border-[#E67912]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("contactbuttons.sending")}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t("contactbuttons.sendMessage")}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <div>
            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                {t("contactPage.getInTouch")}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-[#E67912] mt-0.5" />
                  <div>
                    <h3 className="font-medium">
                      {t("contactPage.emailTitle")}
                    </h3>
                    <p className="text-muted-foreground">
                      contact@flacroncv.com
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("contactPage.emailResponseTime")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 mr-3 text-[#E67912] mt-0.5" />
                  <div>
                    <h3 className="font-medium">
                      {t("contactPage.liveChatTitle")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("contactPage.liveChatAvailability")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("contactPage.liveChatHours")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
