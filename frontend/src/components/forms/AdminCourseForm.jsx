export default function AdminCourseForm(props) {
  const {
    BookOpen,
    ChevronDown,
    ChevronUp,
    Field,
    FormSection,
    GripVertical,
    Plus,
    Save,
    SelectField,
    TextAreaField,
    Toggle,
    Trash2,
    activeModule,
    addModule,
    addModuleLesson,
    categories,
    closeForm,
    editingId,
    enableModuleAssessment,
    form,
    handleSubmit,
    levels,
    removeModule,
    removeModuleAssessment,
    removeModuleLesson,
    saving,
    setActiveModule,
    updateArrayField,
    updateField,
    updateModule,
    updateModuleAssessment,
    updateModuleLesson,
    className,
    onSubmit,
  } = props;

  return (
    <form onSubmit={onSubmit} className={className}>
      {/* BASIC INFORMATION */}

      <FormSection
        title="Basic Information"
        description="Core information displayed to learners."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Course Title"
            required
            value={form.title}
            onChange={(value) => updateField("title", value)}
            placeholder="e.g. Modern React Development"
          />

          <Field
            label="Instructor"
            value={form.instructor}
            onChange={(value) => updateField("instructor", value)}
            placeholder="KanuorieTech"
          />

          <SelectField
            label="Category"
            value={form.category}
            onChange={(value) => updateField("category", value)}
            options={categories}
          />

          <SelectField
            label="Level"
            value={form.level}
            onChange={(value) => updateField("level", value)}
            options={levels}
          />

          <Field
            label="Language"
            value={form.language}
            onChange={(value) => updateField("language", value)}
            placeholder="English"
          />

          <Field
            label="Duration (hours)"
            type="number"
            value={form.duration}
            onChange={(value) => updateField("duration", value)}
            placeholder="20"
          />

          <Field
            label="Course Image URL"
            type="url"
            value={form.image}
            onChange={(value) => updateField("image", value)}
            placeholder="https://..."
          />

          <Field
            label="Course Link"
            type="url"
            value={form.link}
            onChange={(value) => updateField("link", value)}
            placeholder="https://..."
          />
        </div>

        <TextAreaField
          label="Description"
          required
          value={form.description}
          onChange={(value) => updateField("description", value)}
          placeholder="Describe what learners will gain from this course..."
          rows={5}
        />
      </FormSection>

      {/* SETTINGS */}

      <FormSection
        title="Publishing & Settings"
        description="Control how this course appears on the platform."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Toggle
            label="Published"
            checked={form.published}
            onChange={(value) => updateField("published", value)}
          />

          <Toggle
            label="Featured"
            checked={form.featured}
            onChange={(value) => updateField("featured", value)}
          />

          <Toggle
            label="Premium"
            checked={form.premium}
            onChange={(value) => updateField("premium", value)}
          />
        </div>

        {form.premium && (
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-5">
            <div className="mb-4">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                Premium Course Pricing
              </h4>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Set the price learners must pay before they can access this
                course.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Price"
                type="number"
                value={form.price}
                onChange={(value) => updateField("price", value)}
                placeholder="49"
                required
              />

              <SelectField
                label="Currency"
                value={form.currency}
                onChange={(value) => updateField("currency", value)}
                options={["USD", "NGN"]}
              />
            </div>

            <div className="mt-4 rounded-xl border border-purple-100 bg-white/70 px-4 py-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Course price
              </p>

              <p className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">
                {form.currency === "NGN" ? "₦" : "$"}
                {Number(form.price || 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </FormSection>

      {/* METADATA */}

      <FormSection
        title="Course Metadata"
        description="Use comma-separated values."
      >
        <Field
          label="Tags"
          value={form.tags.join(", ")}
          onChange={(value) => updateArrayField("tags", value)}
          placeholder="React, JavaScript, Frontend"
        />

        <Field
          label="Prerequisites"
          value={form.prerequisites.join(", ")}
          onChange={(value) => updateArrayField("prerequisites", value)}
          placeholder="HTML, CSS, JavaScript"
        />

        <Field
          label="Learning Outcomes"
          value={form.outcomes.join(", ")}
          onChange={(value) => updateArrayField("outcomes", value)}
          placeholder="Build React apps, Manage state, Work with APIs"
        />
      </FormSection>

      {/* CURRICULUM */}

      <FormSection
        title="Course Curriculum"
        description="Organize your course into modules and lessons."
      >
        <div className="space-y-5">
          {form.modules.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 dark:bg-slate-950 px-6 py-10 text-center">
              <BookOpen size={35} className="mx-auto text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                No modules added yet.
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Create a module and then add lessons to it.
              </p>
            </div>
          ) : (
            form.modules.map((module, moduleIndex) => {
              const moduleOpen = activeModule === moduleIndex;

              return (
                <div
                  key={moduleIndex}
                  className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  {/* MODULE HEADER */}

                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-4">
                    <GripVertical size={18} className="text-slate-400" />

                    <button
                      type="button"
                      onClick={() =>
                        setActiveModule(moduleOpen ? null : moduleIndex)
                      }
                      className="flex min-w-0 flex-1 items-center justify-between gap-4 text-left"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Module {moduleIndex + 1}
                        </p>

                        <p className="truncate font-bold text-slate-800 dark:text-slate-200">
                          {module.title || "Untitled module"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {module.lessons?.length || 0} lesson
                          {module.lessons?.length === 1 ? "" : "s"}
                        </p>
                      </div>

                      {moduleOpen ? (
                        <ChevronUp size={19} />
                      ) : (
                        <ChevronDown size={19} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeModule(moduleIndex)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      title="Delete module"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  {/* MODULE CONTENT */}

                  {moduleOpen && (
                    <div className="space-y-5 p-5">
                      <Field
                        label="Module Title"
                        required
                        value={module.title}
                        onChange={(value) =>
                          updateModule(moduleIndex, "title", value)
                        }
                        placeholder="e.g. React Fundamentals"
                      />

                      <TextAreaField
                        label="Module Description"
                        value={module.description}
                        onChange={(value) =>
                          updateModule(moduleIndex, "description", value)
                        }
                        placeholder="Describe what learners will cover in this module..."
                        rows={3}
                      />

                      {/* MODULE LESSONS */}

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200">
                              Module Lessons
                            </h4>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Add lessons belonging to this module.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => addModuleLesson(moduleIndex)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            <Plus size={16} />
                            Add Lesson
                          </button>
                        </div>

                        {module.lessons?.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-5 py-6 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              No lessons in this module yet.
                            </p>
                          </div>
                        ) : (
                          module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lessonIndex}
                              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4"
                            >
                              <div className="mb-4 flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                    Lesson {lessonIndex + 1}
                                  </p>

                                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                                    {lesson.title || "Untitled lesson"}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeModuleLesson(moduleIndex, lessonIndex)
                                  }
                                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                  title="Delete lesson"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <Field
                                  label="Lesson Title"
                                  required
                                  value={lesson.title}
                                  onChange={(value) =>
                                    updateModuleLesson(
                                      moduleIndex,
                                      lessonIndex,
                                      "title",
                                      value,
                                    )
                                  }
                                  placeholder="Introduction to React"
                                />

                                <Field
                                  label="Video URL"
                                  type="url"
                                  value={lesson.videoUrl}
                                  onChange={(value) =>
                                    updateModuleLesson(
                                      moduleIndex,
                                      lessonIndex,
                                      "videoUrl",
                                      value,
                                    )
                                  }
                                  placeholder="https://..."
                                />

                                <Field
                                  label="Duration (minutes)"
                                  type="number"
                                  value={lesson.duration}
                                  onChange={(value) =>
                                    updateModuleLesson(
                                      moduleIndex,
                                      lessonIndex,
                                      "duration",
                                      value,
                                    )
                                  }
                                  placeholder="20"
                                />

                                <Field
                                  label="Resources"
                                  value={
                                    Array.isArray(lesson.resources)
                                      ? lesson.resources.join(", ")
                                      : ""
                                  }
                                  onChange={(value) =>
                                    updateModuleLesson(
                                      moduleIndex,
                                      lessonIndex,
                                      "resources",
                                      value
                                        .split(",")
                                        .map((item) => item.trim())
                                        .filter(Boolean),
                                    )
                                  }
                                  placeholder="https://resource.com, https://..."
                                />

                                <div className="md:col-span-2">
                                  <TextAreaField
                                    label="Lesson Description"
                                    value={lesson.description}
                                    onChange={(value) =>
                                      updateModuleLesson(
                                        moduleIndex,
                                        lessonIndex,
                                        "description",
                                        value,
                                      )
                                    }
                                    placeholder="Explain what this lesson covers..."
                                    rows={3}
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <TextAreaField
                                    label="Lesson Content:"
                                    value={lesson.lessonContent}
                                    onChange={(value) =>
                                      updateModuleLesson(
                                        moduleIndex,
                                        lessonIndex,
                                        "lessonContent",
                                        value,
                                      )
                                    }
                                    placeholder="Write the full lesson content here. You can explain concepts, provide examples, instructions, code snippets, tips, and practical explanations..."
                                    rows={12}
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      {/* MODULE ASSESSMENT */}

                      <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200">
                              Module Exercise / Project
                            </h4>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Give learners a practical task to complete after
                              this module.
                            </p>
                          </div>

                          {!module.assessment ? (
                            <button
                              type="button"
                              onClick={() =>
                                enableModuleAssessment(moduleIndex)
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                            >
                              <Plus size={16} />
                              Add Exercise / Project
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                removeModuleAssessment(moduleIndex)
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2 size={16} />
                              Remove Assessment
                            </button>
                          )}
                        </div>

                        {module.assessment && (
                          <div className="space-y-5 rounded-2xl border border-blue-200 bg-blue-50/40 p-5">
                            <div className="grid gap-4 md:grid-cols-2">
                              <SelectField
                                label="Assessment Type"
                                value={module.assessment.type}
                                onChange={(value) =>
                                  updateModuleAssessment(
                                    moduleIndex,
                                    "type",
                                    value,
                                  )
                                }
                                options={["exercise", "project"]}
                              />

                              <SelectField
                                label="Submission Type"
                                value={module.assessment.submissionType}
                                onChange={(value) =>
                                  updateModuleAssessment(
                                    moduleIndex,
                                    "submissionType",
                                    value,
                                  )
                                }
                                options={["text", "url", "file", "none"]}
                              />
                            </div>

                            <Field
                              label="Exercise / Project Title"
                              required
                              value={module.assessment.title}
                              onChange={(value) =>
                                updateModuleAssessment(
                                  moduleIndex,
                                  "title",
                                  value,
                                )
                              }
                              placeholder="e.g. Build a React Counter"
                            />

                            <TextAreaField
                              label="Description"
                              value={module.assessment.description}
                              onChange={(value) =>
                                updateModuleAssessment(
                                  moduleIndex,
                                  "description",
                                  value,
                                )
                              }
                              placeholder="Explain the purpose of this exercise or project..."
                              rows={3}
                            />

                            <TextAreaField
                              label="Instructions"
                              value={module.assessment.instructions}
                              onChange={(value) =>
                                updateModuleAssessment(
                                  moduleIndex,
                                  "instructions",
                                  value,
                                )
                              }
                              placeholder="Tell learners exactly what they need to build or complete..."
                              rows={5}
                            />

                            <Field
                              label="Requirements"
                              value={module.assessment.requirements.join(", ")}
                              onChange={(value) =>
                                updateModuleAssessment(
                                  moduleIndex,
                                  "requirements",
                                  value
                                    .split(",")
                                    .map((item) => item.trim())
                                    .filter(Boolean),
                                )
                              }
                              placeholder="Use React, Create components, Add state management"
                            />

                            <Field
                              label="Resources"
                              value={module.assessment.resources.join(", ")}
                              onChange={(value) =>
                                updateModuleAssessment(
                                  moduleIndex,
                                  "resources",
                                  value
                                    .split(",")
                                    .map((item) => item.trim())
                                    .filter(Boolean),
                                )
                              }
                              placeholder="https://react.dev, https://..."
                            />

                            <Toggle
                              label="Required to complete module"
                              checked={module.assessment.required}
                              onChange={(value) =>
                                updateModuleAssessment(
                                  moduleIndex,
                                  "required",
                                  value,
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* ADD MODULE */}

          <button
            type="button"
            onClick={addModule}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-100"
          >
            <Plus size={18} />
            Add Module
          </button>
        </div>
      </FormSection>

      {/* FORM ACTIONS */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 dark:border-slate-700 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={closeForm}
          disabled={saving}
          className="rounded-xl border border-slate-200 dark:border-slate-700 px-6 py-3 font-semibold text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />

          {saving ? "Saving..." : editingId ? "Update Course" : "Create Course"}
        </button>
      </div>
    </form>
  );
}
