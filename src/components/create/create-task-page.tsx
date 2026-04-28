"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Info, Save, Sparkles, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import { SITE_CONFIG, type TaskKey } from "@/lib/site-config";
import { addLocalPost } from "@/lib/local-posts";

type Field = {
  key: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "url"
    | "number"
    | "tags"
    | "images"
    | "highlights"
    | "category"
    | "file";
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
};

const FORM_CONFIG: Record<TaskKey, { title: string; description: string; fields: Field[] }> = {
  listing: {
    title: "Create Business Listing",
    description: "Add a local-only listing with business details.",
    fields: [
      { key: "title", label: "Listing title", type: "text", required: true, icon: <Sparkles className="h-4 w-4" /> },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Full description", type: "textarea", required: true },
      { key: "category", label: "Category", type: "category", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "address", label: "Address", type: "text" },
      { key: "website", label: "Website URL", type: "url" },
      { key: "email", label: "Business email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "logo", label: "Logo URL", type: "url" },
      { key: "images", label: "Gallery images", type: "images" },
      { key: "highlights", label: "Highlights", type: "highlights" },
    ],
  },
  classified: {
    title: "Create Classified",
    description: "Add a local-only classified ad.",
    fields: [
      { key: "title", label: "Ad title", type: "text", required: true, icon: <Sparkles className="h-4 w-4" /> },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Ad details", type: "textarea", required: true },
      { key: "category", label: "Category", type: "category", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "address", label: "Address", type: "text" },
      { key: "website", label: "Website URL", type: "url" },
      { key: "email", label: "Business email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "images", label: "Images", type: "images" },
      { key: "highlights", label: "Highlights", type: "highlights" },
    ],
  },
  article: {
    title: "Create Article",
    description: "Write a local-only article post.",
    fields: [
      { key: "title", label: "Article title", type: "text", required: true, icon: <Sparkles className="h-4 w-4" /> },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Article content (HTML allowed)", type: "textarea", required: true },
      { key: "category", label: "Category", type: "category", required: true },
      { key: "images", label: "Cover images", type: "images" },
      { key: "tags", label: "Tags", type: "tags" },
    ],
  },
  image: {
    title: "Create Image Share",
    description: "Share image-only content locally.",
    fields: [
      { key: "title", label: "Image title", type: "text", required: true, icon: <Sparkles className="h-4 w-4" /> },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Caption", type: "textarea" },
      { key: "category", label: "Category", type: "category" },
      { key: "images", label: "Images", type: "images", required: true },
      { key: "tags", label: "Tags", type: "tags" },
    ],
  },
  profile: {
    title: "Create Profile",
    description: "Create a local-only business profile.",
    fields: [
      { key: "brandName", label: "Brand name", type: "text", required: true, icon: <Sparkles className="h-4 w-4" /> },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "About the brand", type: "textarea" },
      { key: "website", label: "Website URL", type: "url", required: true },
      { key: "logo", label: "Logo URL", type: "url", required: true },
    ],
  },
  social: {
    title: "Create Social Post",
    description: "Publish a local-only social update.",
    fields: [
      { key: "title", label: "Post title", type: "text", required: true, icon: <Sparkles className="h-4 w-4" /> },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Post content", type: "textarea", required: true },
      { key: "category", label: "Category", type: "category" },
      { key: "images", label: "Images", type: "images" },
      { key: "tags", label: "Tags", type: "tags" },
    ],
  },
  sbm: {
    title: "Create Bookmark",
    description: "Submit a local-only social bookmark.",
    fields: [
      { key: "title", label: "Bookmark title", type: "text", required: true, icon: <Sparkles className="h-4 w-4" /> },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Why it's useful", type: "textarea" },
      { key: "website", label: "Target URL", type: "url", required: true },
      { key: "category", label: "Category", type: "category" },
      { key: "tags", label: "Tags", type: "tags" },
    ],
  },
  pdf: {
    title: "Create PDF Entry",
    description: "Add a local-only PDF resource.",
    fields: [
      { key: "title", label: "PDF title", type: "text", required: true, icon: <Sparkles className="h-4 w-4" /> },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "fileUrl", label: "PDF file URL", type: "file", required: true },
      { key: "category", label: "Category", type: "category", required: true },
      { key: "images", label: "Cover image", type: "images" },
    ],
  },
  org: {
    title: "Create Organization",
    description: "Create a local-only organization profile.",
    fields: [
      { key: "brandName", label: "Organization name", type: "text", required: true, icon: <Sparkles className="h-4 w-4" /> },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "About the organization", type: "textarea" },
      { key: "website", label: "Website URL", type: "url" },
      { key: "logo", label: "Logo URL", type: "url" },
    ],
  },
  comment: {
    title: "Create Blog Comment",
    description: "Store a local-only blog comment entry.",
    fields: [
      { key: "title", label: "Comment title", type: "text", required: true, icon: <Sparkles className="h-4 w-4" /> },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "description", label: "Comment body", type: "textarea", required: true },
      { key: "website", label: "Target post URL", type: "url", required: true },
      { key: "category", label: "Category", type: "category" },
    ],
  },
};

export default function CreateTaskPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const taskKey = params?.task as TaskKey;

  const taskConfig = useMemo(
    () => SITE_CONFIG.tasks.find((task) => task.key === taskKey && task.enabled),
    [taskKey]
  );
  const formConfig = FORM_CONFIG[taskKey];

  const [values, setValues] = useState<Record<string, string>>({});
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  if (!taskConfig || !formConfig) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_100%)] font-sans">
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Task not available</h1>
          <p className="mt-2 text-slate-600">
            This task is not enabled for the current site.
          </p>
          <Link 
            href="/" 
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-600/25 transition hover:bg-cyan-700"
          >
            Back home
          </Link>
        </main>
      </div>
    );
  }

  const updateValue = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in before creating content.",
      });
      router.push("/login");
      return;
    }

    const missing = formConfig.fields.filter((field) => field.required && !values[field.key]);
    if (missing.length) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields before saving.",
      });
      return;
    }

    const title = values.title || values.brandName || "Untitled";
    const summary = values.summary || "";
    const contentType = taskConfig.contentType || taskKey;

    const content: Record<string, unknown> = {
      type: contentType,
    };

    if (values.category) content.category = values.category;
    if (values.description) content.description = values.description;
    if (values.website) content.website = values.website;
    if (values.email) content.email = values.email;
    if (values.phone) content.phone = values.phone;
    if (values.address) content.address = values.address;
    if (values.location) content.location = values.location;
    if (values.logo) content.logo = values.logo;
    if (values.fileUrl) content.fileUrl = values.fileUrl;
    if (values.brandName) content.brandName = values.brandName;

    const highlights = values.highlights
      ? values.highlights.split(",").map((item) => item.trim()).filter(Boolean)
      : [];
    if (highlights.length) content.highlights = highlights;

    const tags = values.tags
      ? values.tags.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const images = values.images
      ? values.images.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const post = addLocalPost({
      task: taskKey,
      title,
      summary,
      authorName: user.name,
      tags,
      content,
      media: images.map((url) => ({ url, type: "IMAGE" })),
      publishedAt: new Date().toISOString(),
    });

    toast({
      title: "Saved locally",
      description: "This post is stored only in your browser.",
    });

    router.push(`/local/${taskKey}/${post.slug}`);
  };

  // Group fields into sections
  const fieldGroups = [
    { title: "Basic Information", fields: formConfig.fields.slice(0, 3) },
    { title: "Details & Content", fields: formConfig.fields.slice(3, 7) },
    { title: "Media & Extras", fields: formConfig.fields.slice(7) },
  ].filter((group) => group.fields.length > 0);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_100%)] font-sans">
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link 
            href="/" 
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-cyan-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900">{formConfig.title}</h1>
              <p className="mt-1 text-slate-600">{formConfig.description}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar - Progress */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 space-y-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Progress</h3>
                <div className="mt-4 space-y-3">
                  {fieldGroups.map((group, idx) => {
                    const isCompleted = group.fields.every((field) => !field.required || values[field.key]);
                    const isActive = activeSection === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveSection(idx)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                          isActive 
                            ? "bg-cyan-50 text-cyan-700" 
                            : isCompleted 
                              ? "text-slate-600 hover:bg-slate-50" 
                              : "text-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        <div className={`h-2 w-2 rounded-full ${
                          isCompleted ? "bg-cyan-600" : isActive ? "bg-cyan-400" : "bg-slate-300"
                        }`} />
                        {group.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-2 text-cyan-600">
                  <Info className="h-4 w-4" />
                  <span className="text-sm font-semibold">Local-only</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  This content is stored only in your browser and won't be synced to a server.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Form */}
          <div className="space-y-8">
            {fieldGroups.map((group, groupIdx) => (
              <div 
                key={groupIdx} 
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
              >
                <h2 className="text-lg font-semibold text-slate-900">{group.title}</h2>
                <div className="mt-6 grid gap-6">
                  {group.fields.map((field) => (
                    <div key={field.key} className="grid gap-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        {field.icon}
                        {field.label}
                        {field.required ? <span className="text-cyan-600">*</span> : null}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          rows={4}
                          placeholder={field.placeholder}
                          value={values[field.key] || ""}
                          onChange={(event) => updateValue(field.key, event.target.value)}
                          className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                        />
                      ) : field.type === "category" ? (
                        <select
                          value={values[field.key] || ""}
                          onChange={(event) => updateValue(field.key, event.target.value)}
                          className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                        >
                          <option value="">Select category</option>
                          {CATEGORY_OPTIONS.map((option) => (
                            <option key={option.slug} value={option.slug}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "file" ? (
                        <div className="grid gap-3">
                          <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-3">
                            <Upload className="h-5 w-5 text-slate-400" />
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (!file) return;
                                if (file.type !== "application/pdf") {
                                  toast({
                                    title: "Invalid file",
                                    description: "Please upload a PDF file.",
                                  });
                                  return;
                                }
                                const reader = new FileReader();
                                setUploadingPdf(true);
                                reader.onload = () => {
                                  const result = typeof reader.result === "string" ? reader.result : "";
                                  updateValue(field.key, result);
                                  setUploadingPdf(false);
                                  toast({
                                    title: "PDF uploaded",
                                    description: "File is stored locally.",
                                  });
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="flex-1 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:transition hover:file:bg-cyan-700"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Or paste a PDF URL"
                            value={values[field.key] || ""}
                            onChange={(event) => updateValue(field.key, event.target.value)}
                            className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                          />
                          {uploadingPdf ? (
                            <p className="text-xs text-slate-500">Uploading PDF…</p>
                          ) : null}
                        </div>
                      ) : (
                        <input
                          type={field.type === "number" ? "number" : "text"}
                          placeholder={
                            field.type === "images" || field.type === "tags" || field.type === "highlights"
                              ? "Separate values with commas"
                              : field.placeholder
                          }
                          value={values[field.key] || ""}
                          onChange={(event) => updateValue(field.key, event.target.value)}
                          className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-600/25 transition hover:bg-cyan-700"
              >
                <Save className="h-4 w-4" />
                Save locally
              </button>
              <Link
                href={taskConfig.route}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-cyan-300 hover:bg-cyan-50"
              >
                View {taskConfig.label}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
