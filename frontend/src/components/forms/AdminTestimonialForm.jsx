export default function AdminTestimonialForm(props) {
  const { Button, editing, form, saving, setForm, setShowForm, submit, className, onSubmit } = props;

  return (
    <form onSubmit={onSubmit} className={className}>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        {editing ? "Edit testimonial" : "New testimonial"}
        </h2>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Customer name" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"/>
        <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Role or organization" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"/>
        <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL (optional)" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"/>
        <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Testimonial" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"/>
          <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save testimonial"}
         </Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
              </Button>
              </div>
    </form>
  );
}
