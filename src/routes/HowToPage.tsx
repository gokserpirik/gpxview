import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Cpu, 
  HelpCircle, 
  ChevronRight, 
  ArrowLeft,
  Smartphone,
  Laptop,
  AlertCircle
} from 'lucide-react'

type TabId = 'strava' | 'garmin' | 'apple' | 'wahoo' | 'planners'

interface Step {
  text: string
  detail?: string
  device: 'web' | 'mobile'
}

interface AppGuide {
  name: string
  logoText: string
  color: string
  difficulty: 'Low' | 'Medium' | 'High'
  description: string
  steps: Step[]
  tip?: string
}

export default function HowToPage() {
  const [activeTab, setActiveTab] = useState<TabId>('strava')

  const guides: Record<TabId, AppGuide> = {
    strava: {
      name: 'Strava',
      logoText: '🧡',
      color: '#FC6100',
      difficulty: 'Low',
      description: 'Strava allows direct GPX telemetry exports of any public or personal activities via their web dashboard.',
      steps: [
        { text: 'Log in to your Strava account using a web browser on your computer or phone.', device: 'web' },
        { text: 'Navigate to the specific activity details page you want to analyze.', device: 'web' },
        { text: 'On the left sidebar (under the map view), click the Actions (ellipsis button: "...") menu.', device: 'web' },
        { text: 'Select "Export GPX" from the dropdown options. The file will download immediately.', device: 'web', detail: 'Note: Routes can also be exported by viewing the route details in "My Routes" and clicking "Export GPX".' }
      ],
      tip: 'Strava does not permit raw GPX exports from the mobile application. Ensure you use a web browser.'
    },
    garmin: {
      name: 'Garmin Connect',
      logoText: '🖤',
      color: '#007ACC',
      difficulty: 'Low',
      description: 'Garmin captures rich sensor telemetry (heart rate, cadence, power). Exporting the raw GPX retains these data streams.',
      steps: [
        { text: 'Sign in to connect.garmin.com in your web browser.', device: 'web' },
        { text: 'Expand the sidebar and select "Activities" -> "All Activities".', device: 'web' },
        { text: 'Click on the specific activity name to open the details view.', device: 'web' },
        { text: 'Locate the gear icon (⚙️) in the top-right corner of the page.', device: 'web' },
        { text: 'Select "Export to GPX" from the menu. Save the file to your computer.', device: 'web', detail: 'If you want full original sensor data, you can also export as "Original" (FIT format), but GPX is recommended for instant visualization.' }
      ],
      tip: 'If using a Garmin watch, sync your watch to Garmin Connect. The file is instantly accessible on the web portal.'
    },
    apple: {
      name: 'Apple Workouts',
      logoText: '❤️',
      color: '#FF2D55',
      difficulty: 'High',
      description: 'Apple Watch health data is secure. Exporting individual workout logs natively is difficult, so using a bridge app is highly recommended.',
      steps: [
        { text: 'Install a bridge app like RunGap or HealthFit from the App Store on your iPhone.', device: 'mobile', detail: 'These apps connect directly to Apple Health, extract individual workout data, and generate clean GPX files.' },
        { text: 'Open the bridge app, grant permissions to read Workouts and GPS data.', device: 'mobile' },
        { text: 'Select your completed workout session from the list.', device: 'mobile' },
        { text: 'Choose "Export GPX" or share it to your local files or cloud storage.', device: 'mobile' }
      ],
      tip: 'Native export is possible by exporting all health data (Health Profile -> Export Health Data), unzipping the bulk folder, and finding GPX files in "workout-routes/". However, this is extremely slow and tedious!'
    },
    wahoo: {
      name: 'Wahoo Elemnt',
      logoText: '💙',
      color: '#8A8A8F',
      difficulty: 'Low',
      description: 'Wahoo companion app lets you share completed telemetry files directly in GPX format.',
      steps: [
        { text: 'Open the Wahoo ELEMNT Companion app on your mobile device.', device: 'mobile' },
        { text: 'Select the "History" tab from the bottom menu.', device: 'mobile' },
        { text: 'Tap the specific activity you want to analyze.', device: 'mobile' },
        { text: 'Tap the Share icon (box with an upward arrow) in the top-right corner.', device: 'mobile' },
        { text: 'Select "Share File..." -> "GPX" format.', device: 'mobile' },
        { text: 'Send the GPX file via AirDrop, Email, or save it to your local Files app.', device: 'mobile' }
      ],
      tip: 'You can set up automatic uploads to Dropbox or Google Drive inside Wahoo Settings to access GPX files instantly on your desktop.'
    },
    planners: {
      name: 'Komoot / RideWithGPS',
      logoText: '💚',
      color: '#4CD964',
      difficulty: 'Low',
      description: 'Route builders allow you to download planned routes to see your target layout before riding.',
      steps: [
        { text: 'For Komoot: Open your planned or completed Tour details page.', device: 'web' },
        { text: 'Click "Export to GPS device" or click the "..." menu and select "Download GPX file".', device: 'web' },
        { text: 'For RideWithGPS: Open your Route page.', device: 'web' },
        { text: 'In the right-side control panel, click the "Export" tab.', device: 'web' },
        { text: 'Select "GPX File (.gpx)" to start downloading.', device: 'web' }
      ],
      tip: 'Ensure you download the GPX track (points spaced closer) rather than a simplified GPX route, to maintain full segment resolution.'
    }
  }

  const activeGuide = guides[activeTab]

  return (
    <div className="min-h-screen bg-[var(--f1-carbon)] py-12 px-6">
      <div className="mx-auto max-w-5xl">
        
        {/* Back Link */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground transition hover:text-foreground no-underline"
        >
          <ArrowLeft className="size-3 text-[var(--f1-red)]" />
          Back to Telemetry Deck
        </Link>

        {/* Page Header */}
        <div className="border-b border-border pb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-sm bg-[var(--f1-red)] px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-white">
            <Cpu className="size-3.5" />
            <span>Telemetry Manual</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl font-sans uppercase tracking-tight">
            Telemetry Acquisition <span className="text-[var(--f1-red)]">Guide</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-mono max-w-3xl leading-relaxed">
            GPX (GPS Exchange Format) logs capture latitude, longitude, elevation, and timestamp data. 
            Follow the instructions below to extract raw activity telemetry from your primary hardware and services.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-border bg-[var(--f1-panel)]/50 p-1 rounded-sm">
              {(Object.keys(guides) as TabId[]).map((tabId) => (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`flex items-center gap-1.5 rounded-sm px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition ${
                    activeTab === tabId
                      ? 'bg-[var(--f1-red)] text-white font-bold'
                      : 'text-muted-foreground hover:bg-[var(--f1-carbon)] hover:text-foreground'
                  }`}
                >
                  <span className="text-sm leading-none">{guides[tabId].logoText}</span>
                  {guides[tabId].name}
                </button>
              ))}
            </div>

            {/* Guide Card */}
            <div className="rounded-sm border border-border bg-[var(--f1-panel)] p-6 border-t-2" style={{ borderTopColor: activeGuide.color }}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-sans tracking-wide text-foreground uppercase">
                  {activeGuide.name} Setup
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">Complexity:</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm uppercase ${
                    activeGuide.difficulty === 'Low' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    activeGuide.difficulty === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {activeGuide.difficulty}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs font-mono text-muted-foreground leading-relaxed">
                {activeGuide.description}
              </p>

              {/* Steps List */}
              <div className="mt-6 space-y-4">
                {activeGuide.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    {/* Monospace Step Number */}
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-muted text-[10px] font-mono font-bold text-foreground border border-border">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="space-y-1 mt-0.5">
                      <p className="text-sm font-sans text-foreground leading-snug flex items-center gap-1.5 flex-wrap">
                        {step.text}
                        <span className="inline-flex items-center gap-0.5 rounded bg-[var(--f1-carbon)] px-1.5 py-0.5 text-[8px] font-mono font-bold text-muted-foreground border border-border">
                          {step.device === 'web' ? <Laptop className="size-2 text-[var(--f1-red)]" /> : <Smartphone className="size-2 text-[var(--f1-red)]" />}
                          {step.device.toUpperCase()}
                        </span>
                      </p>
                      {step.detail && (
                        <p className="text-xs font-mono text-muted-foreground/80 leading-relaxed bg-[var(--f1-carbon)]/40 p-2 border-l border-[var(--f1-red)]/50 mt-1">
                          {step.detail}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tip Box */}
              {activeGuide.tip && (
                <div className="mt-6 flex items-start gap-2.5 rounded-sm border border-amber-500/20 bg-amber-500/5 p-3 text-xs font-mono text-amber-300">
                  <AlertCircle className="size-4 shrink-0 text-amber-500 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-400 uppercase mr-1">Engineer Note:</span>
                    {activeGuide.tip}
                  </div>
                </div>
              )}
            </div>

            {/* General GPX Details */}
            <div className="rounded-sm border border-border bg-[var(--f1-panel)] p-6">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <HelpCircle className="size-4 text-[var(--f1-red)]" />
                Frequently Asked Questions
              </h3>
              
              <div className="mt-4 space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground">Why does my GPX file not show speed data?</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Some export filters strip timestamp data to reduce file size. Make sure to export the "Original" or "Track" version, which includes precise time variables per coordinate. Without time, speed calculation is impossible.
                  </p>
                </div>
                <div className="space-y-1 border-t border-border/50 pt-4">
                  <h4 className="font-bold text-foreground">How does GPX Fitness divide my ride into 3 sectors?</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    We automatically divide the total distance of your uploaded track file into three mathematically equal distance intervals (Sectors 1, 2, and 3) to mimic racing track telemetry sectors.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* Telemetry Decoder Panel (F1 Style) */}
            <div className="rounded-sm border border-border bg-[var(--f1-panel)] p-5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3 flex items-center justify-between">
                <span>Decoder Status</span>
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>

              <div className="mt-4 space-y-3 font-mono text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">RECEIVER PROTOCOL:</span>
                  <span className="font-bold text-foreground">GPX / XML 1.1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">MAX RESOLUTION:</span>
                  <span className="font-bold text-foreground">1 HZ (1 SEC/PT)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">CALIBRATION STATE:</span>
                  <span className="font-bold text-emerald-400">READY</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">CHANNELS DETECTED:</span>
                  <span className="font-bold text-foreground">LAT, LON, ELE, TIME</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">SPEED SENSOR FILTER:</span>
                  <span className="font-bold text-[var(--f1-red)]">AUTO-CAP &lt;40KM/H</span>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <p className="text-[9px] font-mono text-muted-foreground leading-relaxed">
                  The visualizer runs entirely client-side. Your uploaded logs do not leave your terminal device.
                </p>
              </div>
            </div>

            {/* Quick Upload Portal Callout */}
            <div className="rounded-sm border border-[var(--f1-red)]/30 bg-[var(--f1-red)]/5 p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
                  Ready to Analyze?
                </h4>
                <p className="mt-2 text-xs font-sans text-muted-foreground leading-normal">
                  Acquired your telemetry file? Load it directly onto the track canvas to review your speed sector analysis.
                </p>
              </div>
              <Link
                to="/"
                className="mt-6 flex items-center justify-center gap-2 rounded-sm bg-[var(--f1-red)] px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white transition hover:bg-[var(--f1-red)]/90 no-underline"
              >
                <span>Access Visualizer</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
