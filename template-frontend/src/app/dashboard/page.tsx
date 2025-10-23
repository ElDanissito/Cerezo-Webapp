export default function Dashboard() {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Inicio de sesión exitoso</p>
      </header>

      <section className="bg-white border rounded-xl shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-green-600"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.527L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              ¡Has iniciado sesión correctamente!
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Este es tu dashboard. Desde aquí podrás acceder a todas las secciones de la aplicación.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
