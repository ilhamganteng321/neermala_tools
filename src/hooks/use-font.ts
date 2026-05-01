import { useEffect } from "react";

export const useFonts = () => {
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=IM+Fell+English:ital@0;1&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap";
    document.head.appendChild(fontLink);

    const globalStyle = document.createElement("style");
    globalStyle.textContent = `
      .np-preview * { box-sizing: border-box; }
      .np-preview {
        font-family: 'Playfair Display', 'Times New Roman', serif;
        line-height: 1.55;
      }
      .np-masthead {
        font-family: 'IM Fell English', 'Times New Roman', serif;
        letter-spacing: 0.04em;
      }
      .np-body-text {
        font-family: 'Libre Baskerville', Georgia, serif;
        font-size: 11.5px;
        text-align: justify;
        hyphens: auto;
        line-height: 1.65;
      }
      .np-dropcap::first-letter {
        font-family: 'Playfair Display', serif;
        font-size: 4.2em;
        font-weight: 900;
        float: left;
        line-height: 0.78;
        padding-right: 6px;
        padding-top: 4px;
      }
      .np-columns {
        column-count: 2;
        column-gap: 18px;
        column-rule: 1px solid currentColor;
      }
      .np-ornament {
        font-size: 1.3em;
        letter-spacing: 0.3em;
      }
      @keyframes np-fadein {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .np-animate { animation: np-fadein 0.35s ease both; }
    `;
    document.head.appendChild(globalStyle);

    return () => {
      document.head.removeChild(fontLink);
      document.head.removeChild(globalStyle);
    };
  }, []);
};
