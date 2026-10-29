export default function AdminServiceForm(props) {
  const {
    Loader2,
    X,
    addBenefit,
    addTechnology,
    benefitInput,
    closeForm,
    editingService,
    form,
    handleChange,
    handleSubmit,
    removeBenefit,
    removeTechnology,
    saving,
    setBenefitInput,
    setTechnologyInput,
    technologyInput,
    className,
    onSubmit,
  } = props;

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="grid gap-5 md:grid-cols-2">
        {/* TITLE */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Service Title
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Web Development"
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
          />
        </div>

        {/* SHORT DESCRIPTION */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Short Description
          </label>

          <input
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            maxLength={200}
            placeholder="A short description of the service..."
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
          />
        </div>

        {/* DESCRIPTION */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            placeholder="Describe the service in detail..."
            required
            className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
          />
        </div>

        {/* ICON */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Icon
          </label>

          <input
            name="icon"
            value={form.icon}
            onChange={handleChange}
            placeholder="Code2"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
          />

          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Use an icon name or emoji.
          </p>
        </div>

        {/* IMAGE */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Image URL
          </label>

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
          />
        </div>

        {/* PRICE */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Price
          </label>

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Starting from $500"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
          />
        </div>

        {/* ORDER */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Display Order
          </label>

          <input
            type="number"
            name="order"
            value={form.order}
            onChange={handleChange}
            min="0"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400/50"
          />
        </div>

        {/* TECHNOLOGIES */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Technologies
          </label>

          <div className="flex gap-2">
            <input
              value={technologyInput}
              onChange={(event) => setTechnologyInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTechnology();
                }
              }}
              placeholder="React, Node.js..."
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
            />

            <button
              type="button"
              onClick={addTechnology}
              className="rounded-xl bg-white/10 px-4 font-semibold text-white transition hover:bg-white/15"
            >
              Add
            </button>
          </div>

          {form.technologies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.technologies.map((technology) => (
                <span
                  key={technology}
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300"
                >
                  {technology}

                  <button
                    type="button"
                    onClick={() => removeTechnology(technology)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* BENEFITS */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Benefits
          </label>

          <div className="flex gap-2">
            <input
              value={benefitInput}
              onChange={(event) => setBenefitInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addBenefit();
                }
              }}
              placeholder="Mobile responsive..."
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
            />

            <button
              type="button"
              onClick={addBenefit}
              className="rounded-xl bg-white/10 px-4 font-semibold text-white transition hover:bg-white/15"
            >
              Add
            </button>
          </div>

          {form.benefits.length > 0 && (
            <div className="mt-3 space-y-2">
              {form.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300"
                >
                  <span>{benefit}</span>

                  <button
                    type="button"
                    onClick={() => removeBenefit(benefit)}
                    className="text-slate-500 dark:text-slate-400 hover:text-red-400"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STATUS */}

        <div className="md:col-span-2">
          <div className="flex flex-wrap gap-6">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="h-4 w-4 accent-cyan-500"
              />

              <span className="text-sm text-slate-300">Active service</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="h-4 w-4 accent-amber-400"
              />

              <span className="text-sm text-slate-300">Featured service</span>
            </label>
          </div>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={closeForm}
          disabled={saving}
          className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-slate-300 transition hover:bg-white/5"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving && <Loader2 size={17} className="animate-spin" />}

          {editingService ? "Update Service" : "Create Service"}
        </button>
      </div>
    </form>
  );
}
