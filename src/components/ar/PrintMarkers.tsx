'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Download, Info, Printer } from 'lucide-react';
import { DEMO_SONGS } from '@/lib/ar/songs';

export default function PrintMarkers() {
  const [selectedSong, setSelectedSong] = useState(DEMO_SONGS[0].id);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (markerUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = markerUrl;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-marker.patt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="print:shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Printer className="h-5 w-5 mr-2" />
          AR Markers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 print:hidden">
          <Info className="h-4 w-4" />
          <AlertTitle>How to use AR markers</AlertTitle>
          <AlertDescription>
            Print these markers and place them on your guitar at the indicated positions. Make sure to print at actual
            size (100%) on non-glossy paper for best results.
          </AlertDescription>
        </Alert>

        <Tabs value={selectedSong} onValueChange={setSelectedSong} className="print:hidden">
          <TabsList className="grid grid-cols-3">
            {DEMO_SONGS.map((song) => (
              <TabsTrigger key={song.id} value={song.id}>
                {song.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {DEMO_SONGS.map((song) => (
            <TabsContent key={song.id} value={song.id} className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">{song.title} AR Marker</h3>
                <p className="text-sm text-muted-foreground mb-4">Place this marker at the headstock of your guitar</p>

                <div className="border rounded-md p-4 mb-4 mx-auto max-w-xs">
                  <img
                    src={`/markers/${song.id}-preview.png`}
                    alt={`${song.title} AR marker`}
                    className="w-full h-auto"
                  />
                </div>

                <div className="flex justify-center space-x-4">
                  <Button onClick={handlePrint} className="flex items-center">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(song.markerUrl, song.title)}
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-sm">
                <h4 className="font-medium mb-2">Placement Instructions:</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Print the marker at 100% size on non-glossy paper</li>
                  <li>Cut out the marker along the outer border</li>
                  <li>Attach the marker to the headstock of your guitar using removable tape</li>
                  <li>Make sure the marker is flat and clearly visible to the camera</li>
                </ol>
              </div>
            </TabsContent>
          ))}
        </Tabs>

         Print view - only shown when printing 
        <div className="hidden print:block">
          {DEMO_SONGS.map((song) => (
            <div key={song.id} className="page-break-after">
              <h2 className="text-2xl font-bold text-center mb-4">{song.title} AR Marker</h2>
              <div className="border rounded-md p-8 mb-8 mx-auto max-w-md">
                <img
                  src={`/markers/${song.id}-preview.png`}
                  alt={`${song.title} AR marker`}
                  className="w-full h-auto"
                />
              </div>

              <div className="text-sm">
                <h4 className="font-medium mb-2">Placement Instructions:</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Cut out the marker along the outer border</li>
                  <li>Attach the marker to the headstock of your guitar using removable tape</li>
                  <li>Make sure the marker is flat and clearly visible to the camera</li>
                </ol>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
