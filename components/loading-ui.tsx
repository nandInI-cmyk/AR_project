export default function LoadingUI() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border border-dashed p-8 text-center animate-pulse">
      <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
      <h3 className="text-xl font-semibold">Loading AR Experience</h3>
      <p className="text-muted-foreground mt-2">Please wait while we initialize the AR components...</p>
    </div>
  )
}

