import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Card, Loader } from "../../components/common";
import { AdminTestimonialForm } from "../../components/forms";
import { createTestimonial, deleteTestimonial, getTestimonials, updateTestimonial } from "../../api/testimonialApi";

const blank = { name: "", position: "", message: "", image: "" };
const listFrom = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.testimonials)) return response.data.testimonials;
  if (Array.isArray(response?.testimonials)) return response.testimonials;
  return [];
};

export default function AdminTestimonials() {
  const [items, setItems] = useState([]); const [form, setForm] = useState(blank); const [editing, setEditing] = useState(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [showForm, setShowForm] = useState(false);
  const load = async () => { try { setItems(listFrom(await getTestimonials())); } catch (error) { toast.error(error?.response?.data?.message || "Could not load testimonials."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const submit = async (event) => { event.preventDefault(); setSaving(true); try { if (editing) await updateTestimonial(editing, form); else await createTestimonial(form); toast.success(editing ? "Testimonial updated." : "Testimonial created."); setForm(blank); setEditing(null); setShowForm(false); await load(); } catch (error) { toast.error(error?.response?.data?.message || "Could not save testimonial."); } finally { setSaving(false); } };
  const edit = (item) => { setEditing(item._id || item.id); setForm({ name: item.name || item.author || "", position: item.position || item.role || item.title || "", message: item.message || item.quote || item.content || item.text || "", image: item.image || item.avatar || "" }); setShowForm(true); };
  const remove = async (item) => { if (!window.confirm("Delete this testimonial?")) return; try { await deleteTestimonial(item._id || item.id); setItems((old) => old.filter((row) => (row._id || row.id) !== (item._id || item.id))); toast.success("Testimonial deleted."); } catch (error) { toast.error(error?.response?.data?.message || "Could not delete testimonial."); } };
  if (loading) return <div className="flex min-h-64 items-center justify-center"><Loader /></div>;
  return <div className="space-y-6"><header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Testimonials</h1><p className="mt-1 text-slate-600 dark:text-slate-400">Manage customer stories displayed across the site.</p></div><Button onClick={() => { setEditing(null); setForm(blank); setShowForm((value) => !value); }}><Plus size={17} className="mr-2"/>Add testimonial</Button></header>
  {showForm && <Card className="p-5"><AdminTestimonialForm {...{ Button, editing, form, saving, setForm, setShowForm, submit }} onSubmit={submit} className="grid gap-4" /></Card>}
  <div className="grid gap-4 lg:grid-cols-2">{items.length ? items.map((item) => <Card key={item._id || item.id} className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">“{item.message || item.quote || item.content || item.text}”</p><h2 className="mt-4 font-semibold text-slate-900 dark:text-white">{item.name || item.author || "Customer"}</h2><p className="text-sm text-slate-500 dark:text-slate-400">{item.position || item.role || item.title}</p></div><div className="flex shrink-0 gap-2"><Button variant="secondary" onClick={() => edit(item)} aria-label="Edit testimonial"><Pencil size={16}/></Button><Button variant="secondary" onClick={() => remove(item)} aria-label="Delete testimonial"><Trash2 size={16}/></Button></div></div></Card>) : <Card className="p-8 text-center text-slate-600 dark:text-slate-300 lg:col-span-2">No testimonials yet.</Card>}</div></div>;
}


