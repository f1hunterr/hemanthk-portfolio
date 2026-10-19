// Adapted from Magic UI's Border Beam (MIT, https://magicui.design) as plain CSS: a short light that
// travels around the parent's border. The parent must be position: relative.
export function BorderBeam() {
  return <span className="border-beam" data-border-beam aria-hidden="true" />;
}
