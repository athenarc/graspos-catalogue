import zenodoLogo from "@assets/zenodo-logo.jpeg";
import openaireLogo from "@assets/openaire-logo.png";
import grasposLogo from "@assets/graspos_menu_logo.png";
import DOMPurify from "dompurify";

const logos = {
  zenodo: zenodoLogo,
  openaire: openaireLogo,
  graspos: grasposLogo,
};

export function getLogoUrl(logoName) {
  return logos[logoName.toLowerCase()] || "";
}

export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

export function sanitizeHtml(resource) {
  return DOMPurify.sanitize(resource);
}

export function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}
