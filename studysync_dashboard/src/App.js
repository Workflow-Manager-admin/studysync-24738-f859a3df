        <label className="block mb-1 font-semibold">Subject</label>
        <input
          required
          className="border rounded p-2 w-full"
          value={subject}
          maxLength={32}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Date</label>
        <input
          required
          className="border rounded p-2 w-full"
          type="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button
          disabled={saving}
          type="submit"
          className="bg-primary text-white rounded px-4 py-2 font-semibold hover:bg-blue-700"
          style={{ background: COLORS.primary }}
        >
          {saving ? "Saving..." : initial ? "Update" : "Add Exam"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="bg-gray-200 text-gray-700 rounded px-4 py-2 font-semibold"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// --- GRADE/REFLECTION LOGGING ---
function GradeReflectionForm({ exam, onSave, onCancel }) {
  const [grade, setGrade] = useState(exam.grade || "");
  const [reflection, setReflection] = useState(exam.reflection || "");
  const [saving, setSaving] = useState(false);

  // PUBLIC_INTERFACE
  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...exam, grade, reflection });
    setSaving(false);
  }

  return (
    <form className="flex flex-col gap-2 mt-2 p-2 rounded border bg-white bg-opacity-80" onSubmit={submit}>
      <div>
        <label className="block mb-1 font-semibold">Grade</label>
        <input
          className="border rounded p-2 w-full"
          value={grade}
          maxLength={8}
          onChange={(e) => setGrade(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Reflection</label>
        <textarea
          className="border rounded p-2 w-full"
          value={reflection}
          maxLength={512}
          rows={2}
          onChange={(e) => setReflection(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button
          disabled={saving}
          type="submit"
          className="bg-accent text-white rounded px-4 py-2 font-semibold hover:bg-orange-700"
          style={{ background: COLORS.accent }}
        >
          {saving ? "Saving..." : "Save Reflection"}
        </button>
        <button
          type="button"
          className="bg-gray-200 text-gray-700 rounded px-4 py-2 font-semibold"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// --- MILESTONES ---

function MilestoneForm({ onSave, initial, examId, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [target_date, setTargetDate] = useState(
    initial?.target_date || ""
  );
  const [saving, setSaving] = useState(false);
  // PUBLIC_INTERFACE
  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...initial, title, target_date, exam_id: examId });
    setSaving(false);
  }

  return (
    <form
      className="flex flex-col gap-1 bg-white bg-opacity-80 p-2 rounded border"
      onSubmit={submit}
    >
      <div>
        <input
          required
          className="border rounded p-1 w-full text-sm"
          value={title}
          placeholder="Milestone..."
          maxLength={64}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <input
          required
          className="border rounded p-1 w-full text-sm"
          type="date"
          value={target_date}
          onChange={(e) => setTargetDate(e.target.value)}
        />
      </div>
      <div className="flex gap-1 mt-1">
        <button
          type="submit"
          className="bg-primary text-white rounded px-2 py-1 text-xs font-semibold"
          style={{ background: COLORS.primary }}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="bg-gray-100 text-gray-700 rounded px-2 py-1 text-xs font-semibold"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// --- MILESTONES LIST ---
function Milestones({
  milestones,
  examId,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-1">
        <strong>Milestones</strong>
        {!adding && (
          <button
            className="bg-accent text-white rounded px-2 py-1 text-xs font-bold ml-2"
            style={{ background: COLORS.accent }}
            onClick={() => setAdding(true)}
          >
            + Add
          </button>
        )}
      </div>
      {/* Add new */}
      {adding && (
        <MilestoneForm
          onSave={async (m) => {
            await onAdd(m);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
          examId={examId}
        />
      )}
      {/* Display list */}
      <ul className="space-y-2 mt-1">
        {milestones.map((ms) =>
          editing === ms.id ? (
            <li key={ms.id}>
              <MilestoneForm
                initial={ms}
                onSave={async (m) => {
                  await onUpdate(m);
                  setEditing(null);
                }}
                onCancel={() => setEditing(null)}
                examId={examId}
              />
            </li>
          ) : (
            <li
              key={ms.id}
              className="flex justify-between items-center bg-gray-50 border rounded p-2"
            >
              <div>
                <div className="font-medium">{ms.title}</div>
                <div className="text-xs text-gray-500">
                  {ms.target_date}{" "}
                  <span
                    className={
                      ms.status === "done"
                        ? "text-green-600 font-semibold"
                        : "text-yellow-600"
                    }
                  >
                    {ms.status === "done" ? "Done" : "Pending"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {ms.status !== "done" && (
                  <button
                    onClick={() => onUpdate({ ...ms, status: "done" })}
                    className="text-xs bg-green-100 text-green-700 rounded px-2 py-1"
                  >
                    Mark Done
                  </button>
                )}
                <button
                  onClick={() => setEditing(ms.id)}
                  className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(ms.id)}
                  className="text-xs bg-red-100 text-red-700 rounded px-2 py-1"
                >
                  Delete
                </button>
              </div>
            </li>
          )
        )}
        {!milestones.length && (
          <li className="text-xs text-gray-400 italic mt-2">
            No milestones set yet!
          </li>
        )}
      </ul>
    </div>
  );
}

// --- EXAMS DASHBOARD ---
function ExamsDashboard({
  exams,
  milestones,
  onExamDelete,
  onExamUpdate,
  onMilestoneAdd,
  onMilestoneUpdate,
  onMilestoneDelete,
  onReflectionSave,
  sortBy,
  loadingExams,
  theme,
}) {
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [loggingExamId, setLoggingExamId] = useState(null);

  // Sorted exams
  const sortedExams = [...exams].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === "subject") {
      return a.subject.localeCompare(b.subject);
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="container mx-auto pt-8 pb-12 px-2 sm:px-6">
      <div className="flex items-center justify-between mt-6 mb-3">
        <h2 className="text-2xl font-semibold" style={{ color: COLORS.primary }}>
          Your Exams
        </h2>
        {!adding && (
          <button
            className="bg-primary text-white font-bold px-4 py-2 rounded shadow hover:bg-blue-800 flex items-center gap-1"
            style={{ background: COLORS.primary }}
            onClick={() => {
              setEditing(null);
              setAdding(true);
            }}
          >
            + Add Exam
          </button>
        )}
      </div>
      {adding && (
        <div className="mb-4">
          <ExamForm
            onSave={async (exam) => {
              await onExamUpdate(exam);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}
      {loadingExams && (
        <div className="text-center text-gray-400 p-8">Loading exams…</div>
      )}
      {/* List Exams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedExams.map((exam) => {
          const days = daysUntil(exam.date);
          const milestoneList =
            milestones.filter((m) => m.exam_id === exam.id) || [];
          return (
            <div
              key={exam.id}
              className={`rounded border shadow p-4 flex flex-col transition bg-white ${
                expanded[exam.id] ? "ring-2 ring-primary" : ""
              }`}
              style={{
                borderColor: daysCountdownColor(days),
                background:
                  theme === "dark"
                    ? "#23272f"
                    : COLORS.secondary,
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-bold">{exam.title}</div>
                  <div className="text-sm text-gray-600">
                    {exam.subject}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Exam: {exam.date}
                  </div>
                </div>
                <div>
                  <span
                    className="rounded px-2 py-1 font-mono font-semibold"
                    style={{
                      background: daysCountdownColor(days),
                      color: "#fff",
                    }}
                  >
                    {days < 0
                      ? "Passed"
                      : days === 0
                      ? "Today"
                      : `${days}d`}
                  </span>
                </div>
              </div>
              {/* Reflection entry after date */}
              {days < 0 && (
                <div className="mt-2">
                  {loggingExamId === exam.id ? (
                    <GradeReflectionForm
                      exam={exam}
                      onSave={async (ex) => {
                        await onReflectionSave(ex);
                        setLoggingExamId(null);
                      }}
                      onCancel={() => setLoggingExamId(null)}
                    />
                  ) : (
                    <div className="flex flex-col gap-1 bg-gray-50 p-2 rounded text-xs mt-1">
                      <div>
                        <span className="font-semibold">Grade:</span>{" "}
                        {exam.grade || <span className="italic text-gray-400">N/A</span>}
                      </div>
                      <div>
                        <span className="font-semibold">Reflection:</span>{" "}
                        {exam.reflection || <span className="italic text-gray-400">N/A</span>}
                      </div>
                      <button
                        className="px-2 py-1 bg-accent text-white rounded mt-1 text-xs"
                        style={{ background: COLORS.accent }}
                        onClick={() => setLoggingExamId(exam.id)}
                      >
                        Edit Grade/Reflection
                      </button>
                    </div>
                  )}
                </div>
              )}
              {/* Card Actions */}
              <div className="flex gap-2 mt-2">
                <button
                  className="text-xs px-2 py-1 rounded border font-bold hover:bg-primary hover:text-white"
                  style={{
                    background: COLORS.secondary,
                    color: COLORS.primary,
                  }}
                  onClick={() =>
                    setExpanded((e) => ({
                      ...e,
                      [exam.id]: !e[exam.id],
                    }))
                  }
                >
                  {expanded[exam.id] ? "Hide Details" : "Show Details"}
                </button>
                <button
                  className="text-xs px-2 py-1 rounded border font-bold hover:bg-blue-100"
                  style={{
                    color: "#1e293b",
                    borderColor: COLORS.primary,
                  }}
                  onClick={() => {
                    setEditing(exam.id);
                    setAdding(false);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-xs px-2 py-1 rounded border font-bold hover:bg-red-200"
                  style={{
                    color: "#b91c1c",
                    borderColor: "#ef4444",
                  }}
                  onClick={() => onExamDelete(exam.id)}
                >
                  Delete
                </button>
              </div>
              {/* Edit form */}
              {editing === exam.id && (
                <div className="my-2">
                  <ExamForm
                    initial={exam}
                    onSave={async (ex) => {
                      await onExamUpdate(ex);
                      setEditing(null);
                    }}
                    onCancel={() => setEditing(null)}
                  />
                </div>
              )}
              {/* Milestones */}
              {expanded[exam.id] && (
                <Milestones
                  milestones={milestoneList}
                  examId={exam.id}
                  onAdd={onMilestoneAdd}
                  onUpdate={onMilestoneUpdate}
                  onDelete={onMilestoneDelete}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* No exams */}
      {!exams.length && (
        <div className="text-center text-gray-400 p-8 italic">
          You have no exams... Add one above!
        </div>
      )}
    </div>
  );
}

// --- === .ICS EXPORT === ---
function generateICS(exams, milestones) {
  // Export all exams + milestones as .ics events (simple)
  let icsStr = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:StudySync-Export
CALSCALE:GREGORIAN
`;
  exams.forEach((ex) => {
    icsStr += `BEGIN:VEVENT
UID:${ex.id}@studysync
SUMMARY:${ex.title} (${ex.subject})
DTSTART;VALUE=DATE:${ex.date.replace(/-/g, "")}
DESCRIPTION:Exam for ${ex.subject}. ${ex.grade ? "Grade: " + ex.grade + ". " : ""}${
      ex.reflection ? "Reflection: " + ex.reflection : ""
    }
END:VEVENT
`;
    (milestones || [])
      .filter((m) => m.exam_id === ex.id)
      .forEach((ms) => {
        icsStr += `BEGIN:VEVENT
UID:ms${ms.id}@studysync
SUMMARY:[Milestone] ${ms.title} (${ex.title})
DTSTART;VALUE=DATE:${ms.target_date.replace(/-/g, "")}
DESCRIPTION:Milestone for ${ex.title}. Status: ${ms.status}
END:VEVENT
`;
      });
  });
  icsStr += `END:VCALENDAR`;
  return icsStr;
}

// PUBLIC_INTERFACE
function downloadICS(exams, milestones) {
  const ics = generateICS(exams, milestones);
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "studysync_exams.ics";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

// --- === MAIN APP CONTAINER === ---

// PUBLIC_INTERFACE
export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [exams, setExams] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [theme, setTheme] = useState("light");
  const [loadingExams, setLoadingExams] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const isMobile = useMobile();

  // PUBLIC_INTERFACE
  // Auth state handling
  const fetchUser = useCallback(async () => {
    // handle session via Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Theme prefers dark based on system
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    // Apply theme to body
    document.body.style.background =
      theme === "dark" ? "#18181b" : COLORS.secondary;
    document.body.style.color = theme === "dark" ? "#fff" : "#222";
  }, [theme]);

  // Fetch data only when user is loaded
  useEffect(() => {
    if (!user) return;
    fetchData();
    // eslint-disable-next-line
  }, [user]);

  // PUBLIC_INTERFACE
  async function fetchData() {
    setLoadingExams(true);
    setFetchError("");
    try {
      const { data: examsData, error: e1 } = await supabase
        .from("exams")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });
      const { data: milestoneData, error: m1 } = await supabase
        .from("milestones")
        .select("*")
        .eq("user_id", user.id);
      if (e1 || m1) throw e1 || m1;
      setExams(examsData || []);
      setMilestones(milestoneData || []);
    } catch (err) {
      setFetchError(err.message || "Problem fetching exams.");
    }
    setLoadingExams(false);
  }

  // Add/Update exam
  // PUBLIC_INTERFACE
  async function handleExamUpdate(exam) {
    let { id, ...fields } = exam;
    if (!fields.title || !fields.subject || !fields.date) return;
    if (id) {
      // Update
      await supabase
        .from("exams")
        .update({ ...fields })
        .eq("id", id);
    } else {
      // Add
      await supabase.from("exams").insert([
        {
          ...fields,
          user_id: user.id,
        },
      ]);
    }
    fetchData();
  }
  // Delete exam
  // PUBLIC_INTERFACE
  async function handleExamDelete(id) {
    await supabase.from("exams").delete().eq("id", id);
    // Delete milestones also
    await supabase.from("milestones").delete().eq("exam_id", id);
    fetchData();
  }

  // PUBLIC_INTERFACE
  async function handleMilestoneAdd(ms) {
    await supabase.from("milestones").insert([
      {
        ...ms,
        user_id: user.id,
        status: "pending",
      },
    ]);
    fetchData();
  }

  // PUBLIC_INTERFACE
  async function handleMilestoneUpdate(ms) {
    await supabase
      .from("milestones")
      .update({
        ...ms,
        status: ms.status || "pending",
      })
      .eq("id", ms.id);
    fetchData();
  }

  // PUBLIC_INTERFACE
  async function handleMilestoneDelete(id) {
    await supabase.from("milestones").delete().eq("id", id);
    fetchData();
  }

  // PUBLIC_INTERFACE
  async function handleReflectionSave(exam) {
    await supabase
      .from("exams")
      .update({
        grade: exam.grade,
        reflection: exam.reflection,
      })
      .eq("id", exam.id);
    fetchData();
  }

  // PUBLIC_INTERFACE
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setExams([]);
    setMilestones([]);
    setAuthChecked(false);
  };

  // PUBLIC_INTERFACE
  const handleExport = () => {
    downloadICS(exams, milestones);
  };

  // Main render
  if (!authChecked)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-bold text-gray-700">Loading…</div>
      </div>
    );

  if (!user)
    return <Auth onAuth={fetchUser} />;

  return (
    <div
      className={`flex flex-col min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-secondary text-gray-900"
      }`}
    >
      <Navbar
        user={user}
        onLogout={handleLogout}
        sortBy={sortBy}
        setSortBy={setSortBy}
        theme={theme}
        setTheme={setTheme}
        onExport={handleExport}
        onRefresh={fetchData}
      />
      <main className="flex-1 mt-[60px]">
        {fetchError && (
          <div className="p-4 bg-red-50 text-red-700 mx-auto max-w-lg rounded my-3 border">
            {fetchError}
          </div>
        )}
        <ExamsDashboard
          exams={exams}
          milestones={milestones}
          onExamDelete={handleExamDelete}
          onExamUpdate={handleExamUpdate}
          onMilestoneAdd={handleMilestoneAdd}
          onMilestoneUpdate={handleMilestoneUpdate}
          onMilestoneDelete={handleMilestoneDelete}
          onReflectionSave={handleReflectionSave}
          sortBy={sortBy}
          loadingExams={loadingExams}
          theme={theme}
        />
      </main>
      <footer className="flex justify-center items-center text-xs text-gray-400 mt-4 mb-2">
        &copy; {new Date().getFullYear()} StudySync | Powered by Supabase
      </footer>
    </div>
  );
}
