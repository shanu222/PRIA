"use client";

import * as React from "react";
import { Camera, Download, ExternalLink, FileText, Maximize2, Presentation } from "lucide-react";
import { drimMedia, type DrimModel } from "@/data/drim";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaImage } from "./MediaImage";

type View = "photo" | "board" | "pdf";

export function DrimViewer({ model }: { model: DrimModel }) {
  const [view, setView] = React.useState<View>("photo");
  const [zoom, setZoom] = React.useState<"photo" | "board" | null>(null);

  const zoomSrc = zoom === "board" ? drimMedia.poster(model.slug) : drimMedia.photo(model.slug);

  return (
    <div className="flex flex-col gap-3">
      <Tabs value={view} onValueChange={(v) => setView(v as View)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="h-auto border-2 bg-card p-1">
            <TabsTrigger value="photo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Camera className="h-4 w-4" aria-hidden />
              Photo
            </TabsTrigger>
            <TabsTrigger value="board" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Presentation className="h-4 w-4" aria-hidden />
              Display board
            </TabsTrigger>
            <TabsTrigger value="pdf" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" aria-hidden />
              PDF
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={drimMedia.pdf(model.slug)} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                Open PDF
              </a>
            </Button>
            <Button asChild size="sm">
              <a href={drimMedia.download(model.slug)} download={`${model.slug}.pdf`}>
                <Download />
                Download
              </a>
            </Button>
          </div>
        </div>

        <TabsContent value="photo" className="mt-3">
          <button
            type="button"
            onClick={() => setZoom("photo")}
            className="group relative block w-full overflow-hidden rounded-2xl border-2 shadow-soft transition-all hover:border-primary hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`View ${model.title} photo full screen`}
          >
            <MediaImage
              src={drimMedia.photo(model.slug)}
              alt={`${model.title}: full-scale NDMA demonstration model`}
              className="aspect-[4/3]"
              imgClassName="group-hover:scale-[1.03]"
              eager
            />
            <ZoomHint />
          </button>
          {model.lowResPhoto && (
            <p className="mt-2 text-xs text-muted-foreground">Only a low-resolution photo of this model is available.</p>
          )}
        </TabsContent>

        <TabsContent value="board" className="mt-3">
          <button
            type="button"
            onClick={() => setZoom("board")}
            className="group relative mx-auto block w-full max-w-md overflow-hidden rounded-2xl border-2 shadow-soft transition-all hover:border-primary hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`View ${model.title} display board full screen`}
          >
            <MediaImage
              src={drimMedia.poster(model.slug)}
              alt={`${model.title} display board: salient features, materials and suitable regions`}
              className="aspect-[1400/2287]"
              imgClassName="object-contain"
            />
            <ZoomHint />
          </button>
        </TabsContent>

        <TabsContent value="pdf" className="mt-3">
          <div className="overflow-hidden rounded-2xl border-2 bg-muted shadow-soft">
            <iframe
              src={`${drimMedia.pdf(model.slug)}#view=FitH&toolbar=1`}
              title={`${model.title} PDF`}
              className="h-[75vh] min-h-[520px] w-full"
              loading="lazy"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            If the PDF does not display, use <span className="font-semibold">Open PDF</span> or{" "}
            <span className="font-semibold">Download</span>.
          </p>
        </TabsContent>
      </Tabs>

      <Dialog open={zoom !== null} onOpenChange={(open) => !open && setZoom(null)}>
        <DialogContent className="max-h-[94vh] w-[calc(100%-1.5rem)] max-w-6xl gap-3 overflow-auto p-3 sm:p-4">
          <DialogTitle className="pr-8 text-base">{model.title}</DialogTitle>
          <DialogDescription className="sr-only">
            {zoom === "board" ? "Model display board" : "Photo of the demonstration model"}
          </DialogDescription>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={zoomSrc}
            alt={zoom === "board" ? `${model.title} display board` : `${model.title} photo`}
            className={cn("mx-auto h-auto rounded-lg", zoom === "board" ? "max-h-[84vh] w-auto" : "w-full")}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ZoomHint() {
  return (
    <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
      <Maximize2 className="h-3.5 w-3.5" aria-hidden />
      Full screen
    </span>
  );
}
