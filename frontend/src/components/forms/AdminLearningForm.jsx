export default function AdminLearningForm(props) {
  const { Button, Checkbox, FormSection, Input, Select, TextArea, editingLearningResource, form, onChange, onClose, onSubmit, saving, className } = props;

  return (
    <form onSubmit={onSubmit} className={className}>
          <div className="space-y-8">
            {/* BASIC INFORMATION */}
            <FormSection title="Basic Information">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Title *"
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="learningResource title"
                />

                <Input
                  label="Author"
                  name="author"
                  value={form.author}
                  onChange={onChange}
                  placeholder="Author name"
                />

                <Input
                  label="Category *"
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  placeholder="Frontend, Backend, AI..."
                />

                <Input
                  label="ISBN"
                  name="isbn"
                  value={form.isbn}
                  onChange={onChange}
                  placeholder="ISBN"
                />
              </div>

              <TextArea
                label="Description *"
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Describe the learningResource..."
              />
            </FormSection>

            {/* MEDIA */}
            <FormSection title="Media & Files">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Cover Image URL"
                  name="image"
                  value={form.image}
                  onChange={onChange}
                  placeholder="https://..."
                />

                <Input
                  label="PDF URL"
                  name="pdf"
                  value={form.pdf}
                  onChange={onChange}
                  placeholder="https://..."
                />

                <Input
                  label="External Link"
                  name="link"
                  value={form.link}
                  onChange={onChange}
                  placeholder="https://..."
                />

                <Input
                  label="Preview URL"
                  name="preview"
                  value={form.preview}
                  onChange={onChange}
                  placeholder="https://..."
                />
              </div>

              {form.image && (
                <div className="mt-5">
                  <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Cover Preview
                  </p>

                  <img
                    src={form.image}
                    alt="learningResource preview"
                    className="h-40 w-28 rounded-lg object-cover shadow"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </FormSection>

            {/* DETAILS */}
            <FormSection title="learningResource Details">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <Select
                  label="Difficulty"
                  name="difficulty"
                  value={form.difficulty}
                  onChange={onChange}
                  options={["Beginner", "Intermediate", "Advanced"]}
                />

                <Input
                  label="Language"
                  name="language"
                  value={form.language}
                  onChange={onChange}
                  placeholder="English"
                />

                <Input
                  label="Pages"
                  type="number"
                  name="pages"
                  value={form.pages}
                  onChange={onChange}
                  min="0"
                />

                <Input
                  label="File Size"
                  type="number"
                  name="fileSize"
                  value={form.fileSize}
                  onChange={onChange}
                  min="0"
                  placeholder="Bytes"
                />
              </div>

              <Input
                label="Tags"
                name="tags"
                value={form.tags}
                onChange={onChange}
                placeholder="react, javascript, frontend"
              />
            </FormSection>

            {/* COMMERCE */}
            <FormSection title="Publishing & Pricing">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Price (₦)"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={onChange}
                  min="0"
                />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Checkbox
                  label="Published"
                  name="published"
                  checked={form.published}
                  onChange={onChange}
                />

                <Checkbox
                  label="Premium"
                  name="premium"
                  checked={form.premium}
                  onChange={onChange}
                />

                <Checkbox
                  label="Featured"
                  name="featured"
                  checked={form.featured}
                  onChange={onChange}
                />
              </div>
            </FormSection>
          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 dark:border-slate-700 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingLearningResource
                  ? "Update learningResource"
                  : "Create learningResource"}
            </Button>
          </div>

    </form>
  );
}
