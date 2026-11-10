import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Laptop, Smartphone, ShieldCheck } from 'lucide-react'
import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { Icon } from '@astryxdesign/core/Icon'
import { Tab, TabList } from '@astryxdesign/core/TabList'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'

type TabId = 'strava' | 'garmin' | 'apple' | 'wahoo' | 'planners'

interface Step {
  text: string
  detail?: string
  device: 'web' | 'mobile'
}

interface AppGuide {
  name: string
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
      difficulty: 'Low',
      description: 'Export the GPS track for an activity from Strava on the web, then open the downloaded GPX file here.',
      steps: [
        { text: 'Log in to your Strava account using a web browser on your computer or phone.', device: 'web' },
        { text: 'Navigate to the specific activity details page you want to analyze.', device: 'web' },
        { text: 'On the activity page, open the Actions menu (the three-dot button).', device: 'web' },
        { text: 'Select "Export GPX" from the dropdown options. The file will download immediately.', device: 'web', detail: 'Note: Routes can also be exported by viewing the route details in "My Routes" and clicking "Export GPX".' }
      ],
      tip: 'Strava does not permit raw GPX exports from the mobile application. Ensure you use a web browser.'
    },
    garmin: {
      name: 'Garmin Connect',
      difficulty: 'Low',
      description: 'Export the GPS track of a completed activity from Garmin Connect. GPX carries the route; other sensor data may require the original activity format.',
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
      difficulty: 'Low',
      description: 'Use the Wahoo companion app to share a completed activity as a GPX file.',
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
    <VStack as="main" gap={0} className="pit-guide-page">
      <VStack gap={8} className="pit-container pit-guide-container">
        <Link to="/" className="pit-guide-back"><Icon icon={ArrowLeft} size="sm" /> Back to viewer</Link>

        <VStack gap={3} className="pit-guide-intro">
          <Heading level={1}>Get your GPX file.</Heading>
          <Text type="body" display="block">
            Export a route from the service you use, then open the file in GPX Fitness Viewer. Choose your source below for the steps.
          </Text>
        </VStack>

        <section className="pit-guide-workspace" aria-label="Export instructions">
          <VStack gap={0} className="pit-guide-main">
            <VStack gap={2} className="pit-guide-tabs-heading">
              <Heading level={2}>Choose your source</Heading>
              <Text type="supporting">Instructions change with your selection.</Text>
            </VStack>
            <TabList value={activeTab} onChange={(value) => setActiveTab(value as TabId)} role="tablist" hasDivider size="md">
              {(Object.keys(guides) as TabId[]).map((tabId) => (
                <Tab key={tabId} value={tabId} label={guides[tabId].name} panelId="pit-guide-panel" />
              ))}
            </TabList>

            <VStack as="section" gap={5} id="pit-guide-panel" role="tabpanel" aria-label={`${activeGuide.name} export instructions`} className="pit-guide-instructions">
              <HStack gap={4} hAlign="between" vAlign="center" wrap="wrap">
                <Heading level={2}>Export from {activeGuide.name}</Heading>
                <Text type="supporting">EXPORT EFFORT · {activeGuide.difficulty.toUpperCase()}</Text>
              </HStack>
              <Text type="body" display="block" className="pit-guide-description">{activeGuide.description}</Text>

              <VStack as="ol" gap={0} className="pit-guide-steps">
                {activeGuide.steps.map((step, index) => (
                  <VStack as="li" gap={0} key={index}>
                    <Text type="label" className="pit-guide-step-number" hasTabularNumbers>{String(index + 1).padStart(2, '0')}</Text>
                    <VStack gap={2}>
                      <Text type="body" display="block">{step.text}</Text>
                      <HStack gap={1} vAlign="center" className="pit-guide-device">
                        <Icon icon={step.device === 'web' ? Laptop : Smartphone} size="xsm" />
                        <Text type="supporting">{step.device === 'web' ? 'Web' : 'Mobile'}</Text>
                      </HStack>
                      {step.detail && <Text type="supporting" display="block" className="pit-guide-step-detail">{step.detail}</Text>}
                    </VStack>
                  </VStack>
                ))}
              </VStack>

              {activeGuide.tip && (
                <VStack as="aside" gap={0} className="pit-guide-tip">
                  <Text type="label" display="block">GOOD TO KNOW</Text>
                  <Text type="body" display="block">{activeGuide.tip}</Text>
                </VStack>
              )}
            </VStack>
          </VStack>

          <VStack as="aside" gap={6} className="pit-guide-rail" aria-label="GPX file essentials">
            <VStack gap={3}>
              <Icon icon="upload" size="lg" color="accent" />
              <Heading level={2}>What the viewer reads</Heading>
              <Text type="body" display="block">A GPX track needs coordinates to draw a route. Other fields add more detail when your export includes them.</Text>
            </VStack>
            <dl className="pit-guide-fields">
              <dt>Latitude + longitude</dt><dd>Route position</dd>
              <dt>Timestamps</dt><dd>Moving time, pace and speed</dd>
              <dt>Elevation</dt><dd>Gain, loss and height</dd>
            </dl>
            <HStack gap={2} vAlign="start" className="pit-guide-privacy">
              <Icon icon={ShieldCheck} size="sm" />
              <Text type="supporting">Your GPX file is read in your browser; it is not uploaded to our server.</Text>
            </HStack>
            <Link to="/" className="pit-guide-action">Open the viewer <Icon icon={ArrowRight} size="sm" /></Link>
          </VStack>
        </section>

        <VStack as="section" gap={4} className="pit-guide-faq" aria-label="Frequently asked questions">
          <Heading level={2}>Questions about your file</Heading>
          <VStack gap={0}>
            <VStack gap={2} className="pit-guide-faq-item">
              <Heading level={3}>Why does my GPX file not show speed data?</Heading>
              <Text type="body" display="block">Some exports omit timestamps. Choose a track export with times recorded for each point; without them, speed and moving time cannot be calculated.</Text>
            </VStack>
            <VStack gap={2} className="pit-guide-faq-item">
              <Heading level={3}>How are the three sectors calculated?</Heading>
              <Text type="body" display="block">For one continuous track segment, the viewer divides the distance into three equal parts and calculates an average speed for each. Files with multiple segments do not show sector splits.</Text>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  )
}
