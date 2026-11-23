import { Component, type ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { reportOperationalError } from "@/lib/operational-errors";

type Props = { children: ReactNode };
type State = { failed: boolean };

export class OperationalErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch() {
    reportOperationalError("react-render");
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="prototype-section" role="alert">
        <h1>Nie udało się wyświetlić aplikacji</h1>
        <p className="my-5 max-w-2xl">
          Odśwież stronę. Twoje dane scenariusza pozostają zapisane w tej przeglądarce. Jeśli
          problem wraca, otwórz ustawienia danych i wyeksportuj syntetyczny scenariusz przed
          resetem.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            className={buttonVariants()}
            type="button"
            onClick={() => window.location.reload()}
          >
            Odśwież stronę
          </button>
          <a className={buttonVariants({ variant: "outline" })} href="./#/app/settings">
            Ustawienia danych
          </a>
        </div>
      </main>
    );
  }
}
