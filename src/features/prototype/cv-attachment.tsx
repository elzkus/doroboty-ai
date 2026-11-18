import { useState } from "react";
import { Eye, FileText, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import people from "./data/people.json" with { type: "json" };

// These scenario assets are immutable; revisions require new versioned files.
const candidateFiles = new Map([
  ["candidate-anna", "anna-kowalska-cv-v1.pdf"],
  ["candidate-marek", "marek-nowak-cv-v1.pdf"],
]);

export function ProfileCvAttachment({
  candidateId,
  fallbackText,
  removed,
  onRemove,
  onRestore,
}: {
  candidateId: string;
  fallbackText: string;
  removed: boolean;
  onRemove: () => void;
  onRestore: () => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const filename = candidateFiles.get(candidateId);
  const source = people.find((person) => person.id === candidateId);
  const preparedPdf = filename && source?.cv === fallbackText;

  if (removed)
    return (
      <div className="profile-cv-removed" role="status">
        <span>Załącznik został usunięty.</span>
        <Button variant="ghost" size="xs" onClick={onRestore}>
          Cofnij
        </Button>
      </div>
    );

  if (!preparedPdf)
    return (
      <div className="profile-cv-attachment">
        <div className="profile-cv-file-row">
          <span className="profile-cv-file-icon">
            <FileText aria-hidden="true" />
          </span>
          <div className="profile-cv-file-description">
            <strong>Zapisana treść CV</strong>
            <span>CV z profilu</span>
          </div>
          <div className="profile-cv-file-actions">
            <Button
              variant="ghost"
              size="sm"
              aria-expanded={previewOpen}
              onClick={() => setPreviewOpen((current) => !current)}
            >
              <Eye aria-hidden="true" /> {previewOpen ? "Ukryj podgląd" : "Podgląd"}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Usuń załączone CV"
              onClick={() => {
                setPreviewOpen(false);
                onRemove();
              }}
            >
              <Trash2 aria-hidden="true" />
            </Button>
          </div>
        </div>
        {previewOpen && <p className="profile-cv-text-preview">{fallbackText}</p>}
      </div>
    );

  const href = `${import.meta.env.BASE_URL}cv/${filename}`;
  return (
    <div className="profile-cv-attachment">
      <div className="profile-cv-file-row">
        <span className="profile-cv-file-icon">
          <FileText aria-hidden="true" />
        </span>
        <div className="profile-cv-file-description">
          <a href={href} target="_blank" rel="noopener noreferrer">
            {filename}
            <span className="sr-only"> — otwórz w nowej karcie</span>
          </a>
          <span>PDF · dodano 14 listopada 2026</span>
        </div>
        <div className="profile-cv-file-actions">
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={previewOpen}
            aria-controls="profile-cv-preview"
            onClick={() => setPreviewOpen((current) => !current)}
          >
            <Eye aria-hidden="true" /> {previewOpen ? "Ukryj podgląd" : "Podgląd"}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Usuń załączone CV"
            onClick={() => {
              setPreviewOpen(false);
              onRemove();
            }}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </div>
      {previewOpen && (
        <iframe
          id="profile-cv-preview"
          className="cv-preview profile-cv-preview"
          title="Podgląd CV (PDF)"
          src={`${href}#view=FitH`}
        />
      )}
    </div>
  );
}

export function CvAttachment({
  candidateId,
  fallbackText,
  layout = "stack",
  preview = false,
  contextLabel = "CV z momentu aplikowania",
}: {
  candidateId: string;
  fallbackText: string;
  layout?: "stack" | "row";
  preview?: boolean;
  contextLabel?: string;
}) {
  const filename = candidateFiles.get(candidateId);
  const source = people.find((person) => person.id === candidateId);
  // An imported custom CV must not be presented as a different prepared PDF.
  if (!filename || source?.cv !== fallbackText)
    return preview || layout === "row" ? (
      <div className="cv-attachment">
        <div className="cv-file-row">
          <FileText aria-hidden="true" size={24} />
          <div className="cv-file-description">
            <strong>Zapisana treść CV</strong>
            <span>{contextLabel}</span>
          </div>
        </div>
        <p className="cv-text whitespace-pre-wrap text-sm leading-relaxed">{fallbackText}</p>
      </div>
    ) : (
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{fallbackText}</p>
    );
  const href = `${import.meta.env.BASE_URL}cv/${filename}`;
  return (
    <div className="cv-attachment">
      <div className={layout === "row" ? "cv-file-row" : "space-y-4"}>
        {layout === "row" ? (
          <>
            <FileText aria-hidden="true" size={24} />
            <div className="cv-file-description">
              <strong>{filename}</strong>
              <span>{contextLabel} · PDF</span>
            </div>
          </>
        ) : (
          <p className="break-all text-sm text-muted-foreground">{filename} · PDF</p>
        )}
        <div className="flex flex-wrap gap-3">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Otwórz CV (PDF)<span className="sr-only"> w nowej karcie</span>
          </a>
          <a
            href={href}
            download={filename}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Pobierz CV (PDF)
          </a>
        </div>
      </div>
      {preview && (
        <iframe className="cv-preview" title="Podgląd CV (PDF)" src={`${href}#view=FitH`} />
      )}
    </div>
  );
}
