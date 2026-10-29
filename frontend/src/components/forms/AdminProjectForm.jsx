export default function AdminProjectForm(props) {
  const {
    closeModal,
    editingProject,
    form,
    galleryFiles,
    galleryPreviews,
    handleChange,
    handleGalleryChange,
    handleMainImageChange,
    handleSubmit,
    mainImageFile,
    mainImagePreview,
    saving,
    setMainImageFile,
    setMainImagePreview,
    className,
    onSubmit,
  } = props;

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Title */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Project Title *
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. KanuorieTech Website"
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
          />
        </div>

        {/* Category */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Category
          </label>

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Web Development"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
          />
        </div>

        {/* Client */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Client
          </label>

          <input
            name="client"
            value={form.client}
            onChange={handleChange}
            placeholder="Client name"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
          />
        </div>

        {/* Description */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Description *
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the project..."
            rows={6}
            required
            className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
          />
        </div>

        {/* Main Image */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Main Project Image
          </label>

          <div className="space-y-4">
            {/* File Upload */}

            <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 px-6 py-8 text-center transition hover:border-cyan-400/40 hover:bg-white/10">
              <div>
                <p className="font-semibold text-white">
                  📎 Choose image from your computer
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  JPG, PNG, WEBP, GIF or SVG
                </p>
              </div>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                onChange={handleMainImageChange}
                className="hidden"
              />
            </label>

            {/* Selected File */}

            {mainImageFile && (
              <p className="text-sm text-cyan-400">
                Selected: {mainImageFile.name}
              </p>
            )}

            {/* Preview */}

            {(mainImagePreview || form.image) && (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                <img
                  src={mainImagePreview || form.image}
                  alt="Project preview"
                  className="h-64 w-full object-cover"
                />
              </div>
            )}

            {/* URL */}

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-400">
                Or use an image URL
              </label>

              <input
                name="image"
                value={form.image}
                onChange={(event) => {
                  handleChange(event);

                  if (mainImageFile) {
                    setMainImageFile(null);
                    setMainImagePreview("");
                  }
                }}
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
              />
            </div>
          </div>
        </div>

        {/* Technologies */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-500 dark:text-slate-400">
            Technologies
          </label>

          <input
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB, Tailwind CSS"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
          />

          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            Separate technologies with commas.
          </p>
        </div>

        {/* Gallery */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Gallery Images
          </label>

          <div className="space-y-4">
            {/* Multiple File Upload */}

            <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 px-6 py-8 text-center transition hover:border-cyan-400/40 hover:bg-white/10">
              <div>
                <p className="font-semibold text-white">
                  📎 Choose multiple images
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Select up to 10 images
                </p>
              </div>

              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                onChange={handleGalleryChange}
                className="hidden"
              />
            </label>

            {/* Selected Files */}

            {galleryFiles.length > 0 && (
              <p className="text-sm text-cyan-400">
                {galleryFiles.length} image
                {galleryFiles.length > 1 ? "s" : ""} selected
              </p>
            )}

            {/* Preview Grid */}

            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {galleryPreviews.map((preview, index) => (
                  <div
                    key={preview}
                    className="overflow-hidden rounded-xl border border-white/10 bg-slate-900"
                  >
                    <img
                      src={preview}
                      alt={`Gallery preview ${index + 1}`}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Existing / Manual URLs */}

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-400">
                Or add image URLs
              </label>

              <textarea
                name="gallery"
                value={form.gallery}
                onChange={handleChange}
                placeholder={`https://image-1.jpg https://image-2.jpg`}
                rows={4}
                className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
              />

              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Add one image URL per line.
              </p>
            </div>
          </div>
        </div>

        {/* GitHub */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            GitHub URL
          </label>

          <input
            name="github"
            value={form.github}
            onChange={handleChange}
            placeholder="https://github.com/..."
            type="url"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
          />
        </div>

        {/* Live Demo */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Live Demo URL
          </label>

          <input
            name="liveDemo"
            value={form.liveDemo}
            onChange={handleChange}
            placeholder="https://..."
            type="url"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-400/50"
          />
        </div>
      </div>

      {/* Status */}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="h-5 w-5 accent-cyan-500"
          />

          <div>
            <p className="font-medium text-white">Featured Project</p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Show this project prominently.
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handleChange}
            className="h-5 w-5 accent-cyan-500"
          />

          <div>
            <p className="font-medium text-white">Published</p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Make this project visible publicly.
            </p>
          </div>
        </label>
      </div>

      {/* Buttons */}

      <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={closeModal}
          disabled={saving}
          className="rounded-xl bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
          )}

          {editingProject ? "Update Project" : "Create Project"}
        </button>
      </div>
    </form>
  );
}
