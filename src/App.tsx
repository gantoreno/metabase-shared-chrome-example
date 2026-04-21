import chrome from "./shared/chrome.json";

const Header = () => {
  return (
    <div
      className="top-0 left-0 z-50 fixed w-full"
      dangerouslySetInnerHTML={{ __html: chrome?.header_html ?? "" }}
      suppressHydrationWarning
    />
  );
};

const Footer = () => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: chrome?.footer_html ?? "" }}
      suppressHydrationWarning
    />
  );
};

function App() {
  return (
    <div className="bg-white pt-[77px] min-h-screen text-slate-950">
      <Header />

      <main className="flex flex-col gap-6 mx-auto px-6 py-16 max-w-4xl min-h-[50vh]">
        <div className="space-y-3">
          <p className="font-medium text-slate-500 text-sm uppercase tracking-[0.2em]">
            Shared chrome loader
          </p>
          <h1 className="font-semibold text-4xl tracking-tight">
            Dynamic asset injection in a Vite app
          </h1>
          <p className="max-w-2xl text-slate-600 text-lg">
            This page uses a manifest fetched before dev and build, emits its
            head assets through Vite, and renders the shared header and footer
            around local app content.
          </p>
        </div>

        <section className="bg-slate-50 p-4 border border-slate-200 rounded-2xl">
          <p className="font-medium text-slate-900">Status</p>
          <p className="mt-2 text-slate-600">{"✅"} Loaded</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
