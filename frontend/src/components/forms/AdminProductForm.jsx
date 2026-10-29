export default function AdminProductForm(props) {
  const {
    BookOpen,
    CATEGORIES,
    FileText,
    FormField,
    FormSection,
    Globe,
    PRICING_TYPES,
    Save,
    Sparkles,
    Star,
    editingId,
    form,
    handleChange,
    handleSubmit,
    inputClass,
    saving,
    setModalOpen,
    className,
    onSubmit,
  } = props;

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="space-y-8">
        {/* ==================================
                    BASIC INFORMATION
                ================================== */}

        <FormSection
          icon={<BookOpen size={18} />}
          title="Basic Information"
          description="Describe the tool, platform or service."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField label="Product Name" required>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Visual Studio Code"
                  className={inputClass}
                  required
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Excerpt"
                hint="Short summary used on product cards."
              >
                <input
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  placeholder="A powerful code editor for modern development."
                  maxLength={250}
                  className={inputClass}
                />
              </FormField>
            </div>

            <FormField label="Category" required>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Logo / Image URL"
              hint="Use a publicly accessible image URL."
            >
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClass}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField
                label="Description"
                required
                hint="Explain what the product does and who it is useful for."
              >
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the product, its purpose and its main use cases..."
                  rows={5}
                  className={`${inputClass} resize-y`}
                  required
                />
              </FormField>
            </div>
          </div>
        </FormSection>

        {/* ==================================
                    LINKS
                ================================== */}

        <FormSection
          icon={<Globe size={18} />}
          title="Product Links"
          description="Help visitors access the official product resources."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Official Website"
              required
              hint="The main official product website."
            >
              <input
                type="url"
                name="websiteUrl"
                value={form.websiteUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                className={inputClass}
                required
              />
            </FormField>

            <FormField
              label="Documentation URL"
              hint="Official documentation, if available."
            >
              <input
                type="url"
                name="documentationUrl"
                value={form.documentationUrl}
                onChange={handleChange}
                placeholder="https://docs.example.com"
                className={inputClass}
              />
            </FormField>

            <FormField
              label="GitHub URL"
              hint="Useful for open-source projects."
            >
              <input
                type="url"
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className={inputClass}
              />
            </FormField>
          </div>
        </FormSection>

        {/* ==================================
                    PRICING
                ================================== */}

        <FormSection
          icon={<Sparkles size={18} />}
          title="Pricing"
          description="Describe how the product is priced."
        >
          <div className="grid gap-5 md:grid-cols-3">
            <FormField label="Pricing Type" required>
              <select
                name="pricingType"
                value={form.pricingType}
                onChange={handleChange}
                className={inputClass}
              >
                {PRICING_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Starting Price"
              hint="Use 0 when there is no applicable starting price."
            >
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                className={inputClass}
              />
            </FormField>

            <FormField label="Currency">
              <input
                name="currency"
                value={form.currency}
                onChange={handleChange}
                placeholder="USD"
                maxLength={3}
                className={inputClass}
              />
            </FormField>
          </div>
        </FormSection>

        {/* ==================================
                    CLASSIFICATION
                ================================== */}

        <FormSection
          icon={<FileText size={18} />}
          title="Classification"
          description="Add technologies, platforms or keywords."
        >
          <FormField
            label="Technologies / Tags"
            hint="Separate each tag with a comma. Example: JavaScript, React, Git, Open Source"
          >
            <input
              name="technologies"
              value={form.technologies}
              onChange={handleChange}
              placeholder="JavaScript, React, Git"
              className={inputClass}
            />
          </FormField>
        </FormSection>

        {/* ==================================
                    PUBLISHING
                ================================== */}

        <FormSection
          icon={<Star size={18} />}
          title="Publishing"
          description="Control how this product appears publicly."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-white/10">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Featured Product
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Highlight this product in featured sections.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-white/10">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Published
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Make this product visible on the public hub.
                </p>
              </div>
            </label>
          </div>
        </FormSection>
      </div>

      {/* ==================================
                  ACTIONS
              ================================== */}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end dark:border-white/10">
        <button
          type="button"
          onClick={() => setModalOpen(false)}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />

          {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
}
