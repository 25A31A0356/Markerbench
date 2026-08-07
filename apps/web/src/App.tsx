import { useEffect, useState } from "react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

import { useApi } from "./lib/api";

type ProjectType =
  | "DESIGN_3D"
  | "CIRCUIT"
  | "CODEBLOCK";

type Project = {
  id: string;
  name: string;
  type: ProjectType;
  status: string;
};

const projectTypes = [
  {
    type: "DESIGN_3D" as const,
    title: "3D Design",
    description: "Create and organize 3D projects.",
    icon: "◇",
  },
  {
    type: "CIRCUIT" as const,
    title: "Circuit",
    description: "Build and document electronic projects.",
    icon: "⌁",
  },
  {
    type: "CODEBLOCK" as const,
    title: "Codeblock",
    description: "Create programmable maker projects.",
    icon: "</>",
  },
];

function AuthScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold">
          M
        </div>

        <h1 className="mt-5 text-2xl font-bold">
          Welcome to MakerBench
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Sign in to create and manage your projects.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <SignInButton mode="modal">
            <button className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold hover:bg-indigo-500">
              Sign in
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="w-full rounded-lg border border-slate-700 px-4 py-3 text-sm font-semibold hover:bg-slate-800">
              Create account
            </button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { request } = useApi();

  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] =
    useState<ProjectType>("DESIGN_3D");
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const result = await request<{
          projects: Project[];
        }>("/api/projects");

        setProjects(result.projects);
      } catch {
        setError("Unable to load projects.");
      } finally {
        setLoadingProjects(false);
      }
    }

    loadProjects();
  }, [request]);

  async function createProject() {
    if (!projectName.trim()) return;

    setLoading(true);
    setError("");

    try {
      const result = await request<{
        project: Project;
      }>("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          name: projectName.trim(),
          type: selectedType,
        }),
      });

      setProjects((current) => [
        result.project,
        ...current,
      ]);

      setProjectName("");
      setModalOpen(false);
    } catch {
      setError("Unable to create project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="flex h-16 items-center justify-between border-b border-slate-800 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold">
            M
          </div>

          <span className="text-lg font-semibold">
            MakerBench
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden px-3 py-2 text-sm text-slate-400 sm:block">
            Documentation
          </button>

          <UserButton />
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="hidden w-64 shrink-0 border-r border-slate-800 md:flex md:flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
            <span className="text-sm font-semibold">
              Projects
            </span>

            <button
              onClick={() => setModalOpen(true)}
              className="rounded-md px-2 py-1 text-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              +
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {loadingProjects ? (
              <p className="p-3 text-sm text-slate-500">
                Loading projects...
              </p>
            ) : projects.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-800 p-4 text-center">
                <p className="text-sm text-slate-500">
                  No projects yet
                </p>

                <button
                  onClick={() => setModalOpen(true)}
                  className="mt-3 text-sm font-medium text-indigo-400"
                >
                  Create your first project
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    className="w-full rounded-lg px-3 py-3 text-left hover:bg-slate-900"
                  >
                    <p className="truncate text-sm font-medium">
                      {project.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {project.type}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
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
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500"
            >
              New Project
            </button>
          </div>

          {error && (
            <div className="mx-4 mt-4 rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300 md:mx-6">
              {error}
            </div>
          )}

          <div className="flex flex-1 items-center justify-center p-6">
            <div className="max-w-md text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-2xl text-slate-500">
                +
              </div>

              <h2 className="text-xl font-semibold">
                Your canvas is empty
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create a project to start working in
                MakerBench.
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  New Project
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a project type.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="px-2 py-1 text-slate-500"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-3">
              {projectTypes.map((project) => (
                <button
                  key={project.type}
                  onClick={() =>
                    setSelectedType(project.type)
                  }
                  className={`flex items-center gap-4 rounded-xl border p-4 text-left ${
                    selectedType === project.type
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-800 bg-slate-900"
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800 text-sm font-semibold">
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
              ))}
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
                className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:bg-slate-900"
              >
                Cancel
              </button>

              <button
                onClick={createProject}
                disabled={
                  loading || !projectName.trim()
                }
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-40"
              >
                {loading
                  ? "Creating..."
                  : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <>
      <SignedOut>
        <AuthScreen />
      </SignedOut>

      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
  );
}
