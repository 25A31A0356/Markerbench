import { useState } from "react";

type ProjectType = "DESIGN_3D" | "CIRCUIT" | "CODEBLOCK";

const projectTypes: {
  type: ProjectType;
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    type: "DESIGN_3D",
    title: "3D Design",
    description: "Create and organize 3D projects.",
    icon: "◇"
  },
  {
    type: "CIRCUIT",
    title: "Circuit",
    description: "Build and document electronic projects.",
    icon: "⌁"
  },
  {
    type: "CODEBLOCK",
    title: "Codeblock",
    description: "Create programmable maker projects.",
    icon: "</>"
  }
];

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] =
    useState<ProjectType>("DESIGN_3D");

  const [projectName, setProjectName] = useState("");

  const createProject = () => {
    if (!projectName.trim()) {
      return;
    }

    // Editor functionality is intentionally not implemented yet.
    setProjectName("");
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top navigation */}
      <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold">
            M
          </div>

          <span className="text-lg font-semibold tracking-tight">
            MakerBench
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-900 hover:text-white sm:block">
            Documentation
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-medium">
            U
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Project sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950 md:flex md:flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
            <span className="text-sm font-semibold">
              Projects
            </span>

            <button
              onClick={() => setModalOpen(true)}
              className="rounded-md px-2 py-1 text-lg text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="New project"
            >
              +
            </button>
          </div>

          <div className="flex-1 p-3">
            <div className="rounded-lg border border-dashed border-slate-800 p-4 text-center">
              <p className="text-sm text-slate-500">
                No projects yet
              </p>

              <button
                onClick={() => setModalOpen(true)}
                className="mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Create your first project
              </button>
            </div>
          </div>
        </aside>

        {/* Main canvas */}
        <main className="relative flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4 md:px-6">
            <div>
              <h1 className="text-lg font-semibold">
                Workspace
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Select a project to begin building.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              New Project
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center p-6">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-2xl text-slate-500">
                +
              </div>

              <h2 className="text-xl font-semibold">
                Your canvas is empty
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create a project to start working in MakerBench.
                The project editor will be added later.
              </p>

              <button
                onClick={() => setModalOpen(true)}
                className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold hover:bg-indigo-500"
              >
                Create Project
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* New Project modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-project-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2
                  id="new-project-title"
                  className="text-xl font-semibold"
                >
                  New Project
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a project type.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-900 hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-3">
              {projectTypes.map((project) => {
                const selected =
                  selectedType === project.type;

                return (
                  <button
                    key={project.type}
                    onClick={() =>
                      setSelectedType(project.type)
                    }
                    className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-800 bg-slate-900 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-semibold">
                      {project.icon}
                    </div>

                    <div>
                      <p className="font-medium">
                        {project.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {project.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              <label
                htmlFor="project-name"
                className="text-sm font-medium"
              >
                Project name
              </label>

              <input
                id="project-name"
                value={projectName}
                onChange={(event) =>
                  setProjectName(event.target.value)
                }
                placeholder="My Maker Project"
                maxLength={120}
                className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-indigo-500"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={createProject}
                disabled={!projectName.trim()}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
