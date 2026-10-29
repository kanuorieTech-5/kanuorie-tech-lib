import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Card, Loader } from "../../components/common";
import { AdminFAQForm } from "../../components/forms";
import { createFAQ, deleteFAQ, getFAQs, updateFAQ } from "../../api/faqApi";

const blank = { question: "", answer: "", category: "General" };
const listFrom = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.faqs)) return response.data.faqs;
  if (Array.isArray(response?.faqs)) return response.faqs;
  return [];
};

export default function AdminFAQ() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const load = async () => { try { setItems(listFrom(await getFAQs())); } catch (error) { toast.error(error?.response?.data?.message || "Could not load FAQs."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const submit = async (event) => { event.preventDefault(); setSaving(true); try { if (editing) await updateFAQ(editing, form); else await createFAQ(form); toast.success(editing ? "FAQ updated." : "FAQ created."); setForm(blank); setEditing(null); setShowForm(false); await load(); } catch (error) { toast.error(error?.response?.data?.message || "Could not save FAQ."); } finally { setSaving(false); } };
  const edit = (item) => { setEditing(item._id || item.id); setForm({ question: item.question || "", answer: item.answer || "", category: item.category || "General" }); setShowForm(true); };
  const remove = async (item) => { if (!window.confirm("Delete this FAQ?")) return; try { await deleteFAQ(item._id || item.id); setItems((old) => old.filter((row) => (row._id || row.id) !== (item._id || item.id))); toast.success("FAQ deleted."); } catch (error) { toast.error(error?.response?.data?.message || "Could not delete FAQ."); } };
  if (loading) return <div className="flex min-h-64 items-center justify-center"><Loader /></div>;
  return <div className="space-y-6"><header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h1><p className="mt-1 text-slate-600 dark:text-slate-400">Manage the answers shown to visitors.</p></div><Button onClick={() => { setEditing(null); setForm(blank); setShowForm((value) => !value); }}><Plus size={17} className="mr-2" />Add FAQ</Button></header>
  {showForm && <Card className="p-5"><AdminFAQForm {...{ Button, editing, form, saving, setForm, setShowForm, submit }} onSubmit={submit} className="grid gap-4" /></Card>}
  <div className="space-y-3">{items.length ? items.map((item) => <Card key={item._id || item.id} className="flex items-start justify-between gap-4 p-5"><div><h2 className="font-semibold text-slate-900 dark:text-white">{item.question}</h2><p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{item.answer}</p><span className="mt-3 inline-block text-xs text-slate-500">{item.category || "General"}</span></div><div className="flex shrink-0 gap-2"><Button variant="secondary" onClick={() => edit(item)} aria-label="Edit FAQ"><Pencil size={16}/></Button><Button variant="secondary" onClick={() => remove(item)} aria-label="Delete FAQ"><Trash2 size={16}/></Button></div></Card>) : <Card className="p-8 text-center text-slate-600 dark:text-slate-300">No FAQs yet.</Card>}</div></div>;
}
