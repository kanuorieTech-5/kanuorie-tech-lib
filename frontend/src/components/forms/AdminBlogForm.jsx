export default function AdminBlogForm(props) {
  const {
    Button,
    Clock,
    Eye,
    EyeOff,
    ImageIcon,
    RefreshCw,
    Star,
    Upload,
    X,
    coverImageFile,
    coverPreview,
    editingBlog,
    form,
    handleChange,
    handleCoverImageChange,
    handleRemoveCoverImage,
    handleSubmit,
    resetForm,
    saving,
    uploadingImage,
    className,
    onSubmit,
  } = props;

  return (
    <form onSubmit={onSubmit} className={className}>
      {/* TITLE */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Title *
        </label>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter blog title"
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
          required
        />
      </div>

      {/* CATEGORY + READING TIME */}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Category
          </label>

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Technology"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Reading Time
          </label>

          <div className="relative">
            <Clock
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="number"
              name="readingTime"
              min="1"
              value={form.readingTime}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 dark:text-slate-100"
            />
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Estimated reading time in minutes.
          </p>
        </div>
      </div>

      {/* COVER IMAGE */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Cover Image
        </label>

        <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-5 transition hover:border-blue-300">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            {/* IMAGE PREVIEW */}

            <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 md:w-72">
              {coverPreview ? (
                <>
                  <img
                    src={coverPreview}
                    alt="Blog cover preview"
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveCoverImage}
                    disabled={uploadingImage || saving}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Remove cover image"
                  >
                    <X size={17} />
                  </button>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-slate-400">
                  <ImageIcon size={42} />

                  <span className="mt-2 text-sm">No cover image</span>
                </div>
              )}
            </div>

            {/* UPLOAD AREA */}

            <div className="flex-1">
              <div className="flex flex-col items-start gap-3">
                <label
                  htmlFor="blog-cover-image"
                  className={`inline-flex cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 ${
                    uploadingImage || saving
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  <Upload size={18} className="mr-2" />
                  Choose Image
                </label>

                <input
                  id="blog-cover-image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
                  onChange={handleCoverImageChange}
                  disabled={uploadingImage || saving}
                  className="hidden"
                />

                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  JPG, JPEG, PNG, WEBP, GIF or SVG.
                  <br />
                  Maximum file size: 10 MB.
                </p>

                {coverImageFile && (
                  <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
                    <strong>Selected:</strong> {coverImageFile.name}
                  </div>
                )}

                {uploadingImage && (
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                    <RefreshCw size={16} className="animate-spin" />
                    Uploading image to Cloudinary...
                  </div>
                )}

                {form.coverImage && !coverImageFile && (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <span className="flex h-2 w-2 rounded-full bg-green-500" />
                    Cloudinary image connected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EXCERPT */}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Excerpt *
          </label>

          <span
            className={`text-xs ${
              form.excerpt.length > 300 ? "text-red-600" : "text-slate-400"
            }`}
          >
            {form.excerpt.length}/300
          </span>
        </div>

        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          rows={4}
          maxLength={300}
          placeholder="Write a short summary of the article..."
          className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
          required
        />
      </div>

      {/* CONTENT */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Content *
        </label>

        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={14}
          placeholder="Write your article content..."
          className="w-full resize-y rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 leading-7 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
          required
        />
      </div>

      {/* TAGS */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Tags
        </label>

        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="react, javascript, web development"
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
        />

        <p className="mt-1 text-xs text-slate-400">
          Separate multiple tags with commas.
        </p>
      </div>

      {/* PUBLISHING OPTIONS */}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 p-4 transition hover:border-blue-300 hover:bg-blue-50/30">
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handleChange}
            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />

          <div>
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
              {form.published ? (
                <Eye className="text-green-600" size={17} />
              ) : (
                <EyeOff className="text-amber-600" size={17} />
              )}

              {form.published ? "Published" : "Draft"}
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {form.published
                ? "This article can appear on the public blog."
                : "Keep this article hidden until it is ready."}
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 p-4 transition hover:border-yellow-300 hover:bg-yellow-50/30">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="h-5 w-5 rounded border-slate-300 text-yellow-500 focus:ring-yellow-500"
          />

          <div>
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
              <Star
                size={17}
                className={
                  form.featured
                    ? "fill-yellow-400 text-yellow-500"
                    : "text-slate-400"
                }
              />
              Featured Article
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Highlight this article in featured blog sections.
            </p>
          </div>
        </label>
      </div>

      {/* SEO */}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-5">
        <div className="mb-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            SEO Settings
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Optional metadata to help search engines understand this article.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              SEO Title
            </label>

            <input
              name="seoTitle"
              value={form.seoTitle}
              onChange={handleChange}
              placeholder="SEO-friendly page title"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              SEO Description
            </label>

            <textarea
              name="seoDescription"
              value={form.seoDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Short description for search engines..."
              className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={saving || uploadingImage}
          className="text-slate-700 bg-slate-100 hover:bg-slate-200"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={saving}
          disabled={saving || uploadingImage}
        >
          {editingBlog ? "Update Blog Post" : "Create Blog Post"}
        </Button>
      </div>
    </form>
  );
}
