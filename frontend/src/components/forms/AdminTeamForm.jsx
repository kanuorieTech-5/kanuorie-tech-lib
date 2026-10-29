export default function AdminTeamForm(props) {
  const { Facebook, Github, ImageIcon, Instagram, Linkedin, Toggle, Twitter, Upload, closeModal, editingMember, error, form, handleImageChange, handleSubmit, imageFile, imagePreview, saving, updateField, updateSocial, uploadingImage, className, onSubmit } = props;

  return (
    <form onSubmit={onSubmit} className={className}>
              {error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                  {error}
                </p>
              )}

              {/* BASIC INFO */}
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Basic Information
                </h3>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <input
                    required
                    value={form.firstName}
                    onChange={(event) =>
                      updateField("firstName", event.target.value)
                    }
                    placeholder="First name"
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  />

                  <input
                    required
                    value={form.lastName}
                    onChange={(event) =>
                      updateField("lastName", event.target.value)
                    }
                    placeholder="Last name"
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  />

                  <input
                    required
                    value={form.position}
                    onChange={(event) =>
                      updateField("position", event.target.value)
                    }
                    placeholder="Position e.g. Founder & CEO"
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  />

                  <input
                    type="number"
                    min="0"
                    value={form.order}
                    onChange={(event) =>
                      updateField("order", event.target.value)
                    }
                    placeholder="Display order"
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  />

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="Email address"
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  />

                  <input
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="Phone number"
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  />

                  <div className="md:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Profile image
                    </span>
                    <div className="flex flex-col gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950 sm:flex-row sm:items-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Team member preview"
                          className="h-24 w-24 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 dark:bg-slate-900">
                          <ImageIcon className="h-8 w-8" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          Choose an image from your device
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                          {imageFile?.name || "JPG, PNG, or WEBP, up to 5MB"}
                        </p>
                        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700">
                          <Upload className="h-4 w-4" />
                          {imagePreview ? "Choose another image" : "Choose image"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            onClick={(event) => {
                              event.currentTarget.value = "";
                            }}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <textarea
                    value={form.bio}
                    onChange={(event) =>
                      updateField("bio", event.target.value)
                    }
                    placeholder="Short biography"
                    rows="5"
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none focus:border-cyan-500 md:col-span-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  />
                </div>
              </section>

              {/* SOCIAL LINKS */}
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Social Links
                </h3>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="relative">
                    <Facebook className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      value={form.socialLinks.facebook}
                      onChange={(event) =>
                        updateSocial(
                          "facebook",
                          event.target.value
                        )
                      }
                      placeholder="Facebook URL"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-3 pl-10 pr-4 text-sm outline-none focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                    />
                  </div>

                  <div className="relative">
                    <Twitter className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      value={form.socialLinks.twitter}
                      onChange={(event) =>
                        updateSocial(
                          "twitter",
                          event.target.value
                        )
                      }
                      placeholder="Twitter / X URL"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-3 pl-10 pr-4 text-sm outline-none focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                    />
                  </div>

                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      value={form.socialLinks.linkedin}
                      onChange={(event) =>
                        updateSocial(
                          "linkedin",
                          event.target.value
                        )
                      }
                      placeholder="LinkedIn URL"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-3 pl-10 pr-4 text-sm outline-none focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                    />
                  </div>

                  <div className="relative">
                    <Github className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      value={form.socialLinks.github}
                      onChange={(event) =>
                        updateSocial(
                          "github",
                          event.target.value
                        )
                      }
                      placeholder="GitHub URL"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-3 pl-10 pr-4 text-sm outline-none focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                    />
                  </div>

                  <div className="relative">
                    <Instagram className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      value={form.socialLinks.instagram}
                      onChange={(event) =>
                        updateSocial(
                          "instagram",
                          event.target.value
                        )
                      }
                      placeholder="Instagram URL"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-3 pl-10 pr-4 text-sm outline-none focus:border-cyan-500 md:col-span-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </section>

              {/* VISIBILITY */}
              <section className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Visibility
                </h3>

                <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:gap-10">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Active
                    </p>

                    <Toggle
                      checked={form.active}
                      onChange={(value) =>
                        updateField("active", value)
                      }
                      label="Toggle active status"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Featured
                    </p>

                    <Toggle
                      checked={form.featured}
                      onChange={(value) =>
                        updateField("featured", value)
                      }
                      label="Toggle featured status"
                    />
                  </div>
                </div>
              </section>

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 dark:border-slate-700 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? uploadingImage
                      ? "Uploading image..."
                      : "Saving..."
                    : editingMember
                      ? "Update Member"
                      : "Create Member"}
                </button>
              </div>

    </form>
  );
}
