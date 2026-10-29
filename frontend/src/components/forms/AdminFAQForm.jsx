export default function AdminFAQForm(props) {
  const {
    Button,
    editing,
    form,
    saving,
    setForm,
    setShowForm,
    submit,
    className,
    onSubmit,
  } = props;

  return (
    <form onSubmit={onSubmit} className={className}>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        {editing ? "Edit FAQ" : "New FAQ"}
      </h2>
      <input
        required
        value={form.question}
        onChange={(e) => setForm({ ...form, question: e.target.value })}
        placeholder="Question"
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
      <input
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        placeholder="Category"
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
      <textarea
        required
        rows={4}
        value={form.answer}
        onChange={(e) => setForm({ ...form, answer: e.target.value })}
        placeholder="Answer"
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save FAQ"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
