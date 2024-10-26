import { Box } from "@hope-ui/solid";
import { useEffect, useRef } from "solid-js";
import { objStore } from "~/store";
import { getSetting } from "~/utils";

const PdfPreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pdfjsLib = window["pdfjs-dist/build/pdf"];
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

    const loadingTask = pdfjsLib.getDocument(objStore.raw_url);
    loadingTask.promise.then(
      (pdf) => {
        const numPages = pdf.numPages;
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          pdf.getPage(pageNum).then((page) => {
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
            page.render(renderContext).promise.then(() => {
              container.appendChild(canvas);
            });
          });
        }
      },
      (reason) => {
        console.error(reason);
      }
    );
  }, []);

  return <Box ref={containerRef} w="$full" h="70vh" />;
};

export default PdfPreview;
