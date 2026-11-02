import type { ComponentProps } from "react";

const RESUME_FILE = "Hemanth-K-Resume.pdf";

/** Downloads the PDF itself, so HR gets a file to keep or forward (resume.html is the web version). */
export function ResumeLink(props: Omit<ComponentProps<"a">, "href" | "download">) {
  return (
    <a
      {...props}
      href={`${import.meta.env.BASE_URL}${RESUME_FILE}`}
      download={RESUME_FILE}
      data-goatcounter-click="resume-pdf"
    />
  );
}
